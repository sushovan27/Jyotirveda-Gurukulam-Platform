import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateChatResponse } from "@/lib/ai";
import {
  FIRM_PROMPT_MESSAGE,
  REDIRECT_MESSAGE,
  SOFT_NUDGE_MESSAGE,
  formatKundaliContext,
  type StoredKundaliRequest
} from "@/lib/jyotirveda";
import type { KundaliResponse } from "@/types/kundali";
import { rateLimit } from "@/lib/utils/rateLimit";

export const runtime = "nodejs";
export const maxDuration = 60;

const chatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().min(1).max(2000)
    })
  ).min(1).max(20),
  exchangeNumber: z.number().int().min(1),
  kundali: z.any().nullable().optional(),
  birthDetails: z
    .object({
      name: z.string().trim().min(1).max(100),
      dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      tob: z.string().regex(/^\d{2}:\d{2}$/),
      pob: z.string().trim().min(2).max(150)
    })
    .nullable()
    .optional()
});

function assertSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const requestOrigin = request.nextUrl.origin;

  if (origin && origin !== requestOrigin) {
    throw new Error("Cross-origin requests are not allowed.");
  }

  if (referer) {
    try {
      const refererOrigin = new URL(referer).origin;
      if (refererOrigin !== requestOrigin) {
        throw new Error("Cross-origin requests are not allowed.");
      }
    } catch {
      throw new Error("Invalid request origin.");
    }
  }
}

const JYOTI_SYSTEM_PROMPT = `You are Jyoti, the AI astrology guide for Jyotirveda Gurukulam - a sacred platform blending ancient Vedic wisdom with modern insight. You help users understand their Kundali (birth chart), planetary influences, active Dasha periods, doshas, yogas, and life predictions based on Jyotish (Vedic astrology).

PERSONALITY:
- Warm, wise, and spiritually grounded.
- Encouraging - astrology is a tool for self-understanding, not fatalism.
- Never alarming or fear-inducing. Avoid phrases like "bad period" or "dangerous planet."
- Use language like "planetary influences," "areas of growth," "opportunities," "energies."
- End replies with a gentle blessing when appropriate.

HOW TO ANSWER:
- Always base predictions on the actual Kundali data provided to you in context.
- Reference the user's Lagna (ascendant), Moon sign, Sun sign, active Mahadasha/Antardasha, and specific planetary positions in your answers.
- Interpret planetary combinations (yogas), aspects, and house lords meaningfully.
- Never make up planetary positions or Dasha periods - only use the data provided.
- If chart data is not available, ask the user for their birth date, time, and place first.
- Structure answers as: Observation -> Interpretation -> Practical Guidance.
- Use simple, clear language. Avoid excessive Sanskrit jargon unless the user uses it first.

DO NOT:
- Answer medical, legal, or financial questions definitively.
- Predict death, severe illness, or irreversible misfortune.
- Make promises about outcomes.
- Discuss Western or Chinese astrology as primary - stay Vedic.
- Answer questions unrelated to astrology or spirituality.
- Engage with any 5th or later message in the session - only show the booking redirect.`;

function buildExchangeInstructions(exchangeNumber: number) {
  if (exchangeNumber <= 2) {
    return "Exchange 1-2: answer fully and helpfully using the chart data.";
  }

  if (exchangeNumber === 3) {
    return `Exchange 3: answer fully, then append exactly this consultation nudge:\n${SOFT_NUDGE_MESSAGE}`;
  }

  return `Exchange 4: give a brief helpful answer, then append exactly this firm consultation recommendation:\n${FIRM_PROMPT_MESSAGE}`;
}

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);

    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";
    const rateLimitResponse = rateLimit(ip, 20, 60000);
    if (rateLimitResponse) return rateLimitResponse;

    const parsed = chatRequestSchema.parse(await request.json());
    const { messages, exchangeNumber, kundali, birthDetails } = parsed;

    if (exchangeNumber >= 5) {
      return NextResponse.json({ content: REDIRECT_MESSAGE });
    }

    const lastMessage = messages[messages.length - 1]?.content ?? "";
    if (!lastMessage) {
      return NextResponse.json({ error: "A user message is required." }, { status: 400 });
    }

    let resolvedKundali: KundaliResponse | null | undefined = undefined;

    if (birthDetails) {
      const baseUrl = request.nextUrl.origin;
      const kundaliResponse = await fetch(`${baseUrl}/api/kundli`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(birthDetails satisfies StoredKundaliRequest)
      });

      const kundaliJson = await kundaliResponse.json();
      if (kundaliResponse.ok && kundaliJson.interpretation) {
        resolvedKundali = kundaliJson.interpretation as KundaliResponse;
      }
    }

    if (!resolvedKundali && kundali) {
      resolvedKundali = kundali as KundaliResponse;
    }

    const chartContext = resolvedKundali
      ? formatKundaliContext(resolvedKundali)
      : "No Kundali data is available for this user yet. Ask for Full Name, Date of Birth, Time of Birth, and Place of Birth before attempting any personalised chart reading.";

    const response = await generateChatResponse(
      [
        {
          role: "system",
          content: `${JYOTI_SYSTEM_PROMPT}\n\n${chartContext}\n\n${buildExchangeInstructions(exchangeNumber)}`
        },
        ...messages
      ],
      { temperature: 0.6, maxTokens: exchangeNumber === 4 ? 420 : 700 }
    );

    return NextResponse.json(
      { content: response.trim() },
      {
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid chat payload." }, { status: 400, headers: { "Cache-Control": "no-store" } });
    }

    const message = err instanceof Error ? err.message : "Unexpected error";
    const status = message.includes("Cross-origin") || message.includes("Invalid request origin") ? 403 : 500;
    return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
  }
}
