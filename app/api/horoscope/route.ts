import { NextRequest, NextResponse } from "next/server";
import { generateAllHoroscopes, generateDailyHoroscope } from "@/lib/ai";
import { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 60;

const rashiSchema = z.object({
  rashi: z.string().optional(),
});

/**
 * GET  /api/horoscope          → returns all 12 rashis
 * GET  /api/horoscope?rashi=X  → returns one rashi
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rashi = searchParams.get("rashi");

  const parsed = rashiSchema.safeParse({ rashi: rashi ?? undefined });
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid rashi parameter" }, { status: 400 });
  }

  try {
    if (parsed.data.rashi) {
      const prediction = await generateDailyHoroscope(parsed.data.rashi);
      return NextResponse.json({ [parsed.data.rashi]: prediction });
    }

    const horoscopes = await generateAllHoroscopes();
    return NextResponse.json(horoscopes);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
