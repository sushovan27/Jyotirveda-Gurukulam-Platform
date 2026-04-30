import { NextRequest, NextResponse } from "next/server";
import { streamChatResponse } from "@/lib/ai";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import Groq from "groq-sdk";

export const runtime = "nodejs";
export const maxDuration = 60;

const ASTROLOGER_SYSTEM_PROMPT = `You are Jyotisha-GPT, an expert Vedic astrologer with decades of experience in Jyotish Shastra. You embody the wisdom of a traditional Gurukulam teacher—calm, precise, compassionate and deeply knowledgeable.

Your responses must:
- Draw exclusively from Vedic / Jyotish principles (not Western astrology)
- Use authentic Sanskrit terms with brief English explanations where needed (e.g., "Lagna (ascendant)")
- Maintain a warm, wise, spiritually uplifting tone
- Be thorough yet accessible; avoid jargon overload
- Always guide them to book an online consultation for deep, personalized insights.
- DO NOT make random predictions. If the user has a generated chart (provided below), answer ONLY based on that chart.
- If the user DOES NOT have a chart yet, politely ask them for their: Name, Date of Birth (YYYY-MM-DD), Time of Birth (HH:MM), and City of Birth to generate it.`;

async function extractDetails(text: string): Promise<{name: string, dob: string, tob: string, city: string} | null> {
  if (!process.env.GROQ_API_KEY) return null;
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const prompt = `Extract Name, Date of Birth (YYYY-MM-DD), Time of Birth (HH:MM 24-hour), and City from the following text. 
If all 4 are present, return a JSON object with keys: "name", "dob", "tob", "city". 
If ANY are missing, return exactly "null". DO NOT wrap in markdown.
Text: "${text}"`;
  
  try {
    const res = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
      max_tokens: 100
    });
    const out = res.choices[0]?.message?.content?.trim();
    if (!out || out === "null") return null;
    return JSON.parse(out);
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please log in or sign up to use the AI Astrologer." }, { status: 401 });
    }

    const { data: profile } = await (supabase.from("profiles") as any).select("tokens").eq("id", user.id).single();
    if (profile && profile.tokens !== null && profile.tokens <= 0) {
      return NextResponse.json({ error: "Token limit reached. Please recharge your tokens to continue chatting and book an online consultation!" }, { status: 403 });
    }

    if (profile && profile.tokens !== null && profile.tokens > 0) {
      await (supabase.from("profiles") as any).update({ tokens: profile.tokens - 1 }).eq("id", user.id);
    }

    const { messages } = await request.json();
    const lastMessage = messages[messages.length - 1]?.content || "";

    let { data: kundliReport } = await (supabase.from("kundli_reports") as any).select("chart_data").eq("user_id", user.id).single();

    let chartGeneratedNow = false;
    let newChartMessage = "";

    if (!kundliReport?.chart_data && lastMessage.length > 10) {
      const extracted = await extractDetails(lastMessage);
      if (extracted && extracted.name && extracted.dob && extracted.tob && extracted.city) {
        // Generate chart using the robust offline engine API
        const baseUrl = request.nextUrl.origin;
        const res = await fetch(`${baseUrl}/api/kundli`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "cookie": request.headers.get("cookie") || ""
          },
          body: JSON.stringify({
            name: extracted.name,
            dob: extracted.dob,
            tob: extracted.tob,
            city: extracted.city,
            timezone: "Asia/Kolkata"
          })
        });
        
        if (res.ok) {
          const data = await res.json();
          kundliReport = { chart_data: data.interpretation } as any;
          chartGeneratedNow = true;
          newChartMessage = " (I have successfully generated their chart just now based on their details! Proceed to give them an analysis!)";
        }
      }
    }

    let chartContext = "";
    if (kundliReport && kundliReport.chart_data) {
      chartContext = `\n\nUSER'S GENERATED CHART:\n${JSON.stringify(kundliReport.chart_data, null, 2)}${newChartMessage}`;
    } else {
      chartContext = `\n\nUSER HAS NO CHART YET. You must politely ask for Name, Date of Birth, Time of Birth, and City of Birth so the backend can generate it.`;
    }

    // Prepend the system prompt manually to the messages array since streamChatResponse takes user/assistant messages
    const finalMessages = [
      { role: "system", content: ASTROLOGER_SYSTEM_PROMPT + chartContext },
      ...messages
    ];

    const stream = await streamChatResponse(finalMessages);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
