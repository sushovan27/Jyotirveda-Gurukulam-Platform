import { NextRequest, NextResponse } from "next/server";
import { generateKundli } from "@/lib/ai";
import { z } from "zod";

const kundliSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  tob: z.string().regex(/^\d{2}:\d{2}$/, "Time must be HH:MM"),
  pob: z.string().min(2, "Place of birth is required").max(150),
});

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const parsed = kundliSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const interpretation = await generateKundli(parsed.data);
    return NextResponse.json({ interpretation });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
