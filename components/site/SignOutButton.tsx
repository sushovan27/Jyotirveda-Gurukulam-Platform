"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      className="inline-flex items-center justify-center rounded-full bg-[#FFF7E6] px-5 py-2.5 text-sm font-semibold tracking-wide text-[#4A0A0A] ring-1 ring-[#4A0A0A]/15 transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/70"
    >
      Sign Out
    </button>
  );
}
