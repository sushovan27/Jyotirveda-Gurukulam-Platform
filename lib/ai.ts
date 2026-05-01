import Groq from "groq-sdk";

// ---------------------------------------------------------------------------
// Provider initialisation (lazy – keys may not be present during build)
// ---------------------------------------------------------------------------

function getGroqClient(): Groq {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured");
  }
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
}

/** Call OpenAI-compatible REST API via native fetch (no SDK required). */
async function fetchOpenAI(
  messages: ChatMessage[],
  options: { model?: string; temperature?: number; maxTokens?: number } = {}
): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is not configured");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: options.model ?? "gpt-4o-mini",
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 2048,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error ${res.status}: ${err}`);
  }

  const data = (await res.json()) as {
    choices: Array<{ message: { content: string } }>;
  };
  return data.choices[0]?.message?.content ?? "";
}

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type KundliInput = {
  name: string;
  dob: string; // ISO date string YYYY-MM-DD
  tob: string; // HH:MM 24-hour
  pob: string; // Place of birth
};

export type KundliInterpretation = {
  summary: string;
  ascendant: string;
  sunSign: string;
  moonSign: string;
  planets: Array<{
    name: string;
    sign: string;
    house: number;
    degree: string;
    nakshatra: string;
    effects: string;
  }>;
  career: string;
  marriage: string;
  health: string;
  remedies: string[];
  favourableColours: string[];
  luckyNumbers: number[];
  mahadasha: string;
};

// ---------------------------------------------------------------------------
// System prompts
// ---------------------------------------------------------------------------

const ASTROLOGER_SYSTEM_PROMPT = `You are Jyotisha-GPT, an expert Vedic astrologer with decades of experience in Jyotish Shastra. You embody the wisdom of a traditional Gurukulam teacher—calm, precise, compassionate and deeply knowledgeable.

Your responses must:
- Draw exclusively from Vedic / Jyotish principles (not Western astrology)
- Use authentic Sanskrit terms with brief English explanations where needed (e.g., "Lagna (ascendant)")
- Maintain a warm, wise, spiritually uplifting tone
- Provide practical, actionable guidance including mantras, gemstones, or yogic practices as appropriate
- Be thorough yet accessible; avoid jargon overload
- Respect the seeker's privacy and spiritual journey`;

const HOROSCOPE_SYSTEM_PROMPT = `${ASTROLOGER_SYSTEM_PROMPT}

Generate fresh, insightful daily horoscope predictions for Vedic rashis. Keep each prediction to 3-4 sentences covering today's energy, a practical tip, and an encouraging note. Use Vedic rashi names (Mesha, Vrishabha, Mithuna, Karka, Simha, Kanya, Tula, Vrishchika, Dhanu, Makara, Kumbha, Meena).`;

// ---------------------------------------------------------------------------
// Core AI call helpers
// ---------------------------------------------------------------------------

async function callGroq(
  messages: ChatMessage[],
  options: { model?: string; temperature?: number; maxTokens?: number } = {}
): Promise<string> {
  const client = getGroqClient();
  const completion = await client.chat.completions.create({
    model: options.model ?? "llama-3.3-70b-versatile",
    messages,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.maxTokens ?? 2048,
  });
  return completion.choices[0]?.message?.content ?? "";
}

/** Try Groq first; fall back to OpenAI if Groq is unavailable. */
async function callWithFallback(
  messages: ChatMessage[],
  options: { temperature?: number; maxTokens?: number } = {}
): Promise<string> {
  try {
    return await callGroq(messages, options);
  } catch (groqError) {
    // Only fall back if Groq is genuinely unavailable (not a prompt error)
    const isRateOrKey =
      groqError instanceof Error &&
      (groqError.message.includes("API key") ||
        groqError.message.includes("rate") ||
        groqError.message.includes("quota"));
    if (isRateOrKey) {
      return await fetchOpenAI(messages, options);
    }
    throw groqError;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generate a daily horoscope prediction for a given Vedic rashi.
 */
export async function generateDailyHoroscope(rashi: string): Promise<string> {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const messages: ChatMessage[] = [
    { role: "system", content: HOROSCOPE_SYSTEM_PROMPT },
    {
      role: "user",
      content: `Today is ${today}. Write the daily Vedic horoscope for ${rashi} rashi. Be insightful and specific to today's cosmic energy.`,
    },
  ];

  return callWithFallback(messages, { temperature: 0.8, maxTokens: 256 });
}

/**
 * Generate horoscopes for all 12 rashis (batched single call for efficiency).
 */
export async function generateAllHoroscopes(): Promise<
  Record<string, string>
> {
  const rashis = [
    "Mesha",
    "Vrishabha",
    "Mithuna",
    "Karka",
    "Simha",
    "Kanya",
    "Tula",
    "Vrishchika",
    "Dhanu",
    "Makara",
    "Kumbha",
    "Meena",
  ];

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const messages: ChatMessage[] = [
    { role: "system", content: HOROSCOPE_SYSTEM_PROMPT },
    {
      role: "user",
      content: `Today is ${today}. Generate daily Vedic horoscope predictions for ALL 12 rashis. Respond with valid JSON only (no markdown):
{
  "Mesha": "prediction...",
  "Vrishabha": "prediction...",
  "Mithuna": "prediction...",
  "Karka": "prediction...",
  "Simha": "prediction...",
  "Kanya": "prediction...",
  "Tula": "prediction...",
  "Vrishchika": "prediction...",
  "Dhanu": "prediction...",
  "Makara": "prediction...",
  "Kumbha": "prediction...",
  "Meena": "prediction..."
}`,
    },
  ];

  const raw = await callWithFallback(messages, {
    temperature: 0.8,
    maxTokens: 3000,
  });

  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const parsed = JSON.parse(cleaned) as Record<string, string>;

  // Ensure all rashis are present even if AI missed one
  return rashis.reduce<Record<string, string>>((acc, r) => {
    acc[r] = parsed[r] ?? "Planetary alignment favours patience and inner reflection today. Trust the cosmic timing.";
    return acc;
  }, {});
}

/**
 * Stream a conversational AI astrologer response.
 * Returns a ReadableStream of text chunks.
 */
export async function streamChatResponse(
  messages: ChatMessage[]
): Promise<ReadableStream<Uint8Array>> {
  const systemMessage: ChatMessage = {
    role: "system",
    content: ASTROLOGER_SYSTEM_PROMPT,
  };

  const allMessages = [systemMessage, ...messages];

  const encoder = new TextEncoder();

  // Try Groq streaming first
  if (process.env.GROQ_API_KEY) {
    try {
      const client = getGroqClient();
      const stream = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: allMessages,
        temperature: 0.7,
        max_tokens: 1024,
        stream: true,
      });

      return new ReadableStream<Uint8Array>({
        async start(controller) {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content ?? "";
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        },
      });
    } catch {
      // Fall through to OpenAI
    }
  }

  // OpenAI SSE streaming fallback using native fetch
  if (process.env.OPENAI_API_KEY) {
    const key = process.env.OPENAI_API_KEY;
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: allMessages,
        temperature: 0.7,
        max_tokens: 1024,
        stream: true,
      }),
    });

    if (!res.ok || !res.body) {
      throw new Error(`OpenAI streaming error: ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    return new ReadableStream<Uint8Array>({
      async start(controller) {
        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            const trimmed = line.replace(/^data: /, "").trim();
            if (!trimmed || trimmed === "[DONE]") continue;
            try {
              const parsed = JSON.parse(trimmed) as {
                choices: Array<{ delta: { content?: string } }>;
              };
              const text = parsed.choices[0]?.delta?.content ?? "";
              if (text) controller.enqueue(encoder.encode(text));
            } catch {
              // skip malformed chunks
            }
          }
        }
        controller.close();
      },
    });
  }

  throw new Error("No AI provider configured. Please set GROQ_API_KEY or OPENAI_API_KEY.");
}
