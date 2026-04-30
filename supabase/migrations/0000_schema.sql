-- ============================================================
-- Jyotirveda Gurukulam – Core Schema
-- ============================================================

-- 1. Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id           UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email        TEXT UNIQUE NOT NULL,
  full_name    TEXT,
  avatar_url   TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Kundli Reports
CREATE TABLE IF NOT EXISTS public.kundli_reports (
  id                 UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id            UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name               TEXT NOT NULL,
  dob                DATE NOT NULL,
  tob                TIME NOT NULL,
  pob                TEXT NOT NULL,
  chart_data         JSONB NOT NULL DEFAULT '{}'::jsonb,
  ai_interpretation  JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at         TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Chat History
CREATE TABLE IF NOT EXISTS public.chat_history (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title      TEXT NOT NULL DEFAULT 'New conversation',
  messages   JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Blog Posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug         TEXT UNIQUE NOT NULL,
  title        TEXT NOT NULL,
  content      TEXT NOT NULL,
  excerpt      TEXT,
  category     TEXT NOT NULL DEFAULT 'Vedic Astrology',
  author_id    UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE public.profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kundli_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts     ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Kundli Reports: users own their reports
CREATE POLICY "kundli_all_own" ON public.kundli_reports
  FOR ALL USING (auth.uid() = user_id);

-- Chat History: users own their chats
CREATE POLICY "chat_all_own" ON public.chat_history
  FOR ALL USING (auth.uid() = user_id);

-- Blog Posts: anyone can read published; only author can modify
CREATE POLICY "blog_select_published" ON public.blog_posts
  FOR SELECT USING (published_at IS NOT NULL AND published_at <= NOW());

CREATE POLICY "blog_modify_own" ON public.blog_posts
  FOR ALL USING (auth.uid() = author_id);

-- ============================================================
-- Auto-update updated_at on profiles and chat_history
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER chat_history_updated_at
  BEFORE UPDATE ON public.chat_history
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- Auto-create profile on new auth user
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
