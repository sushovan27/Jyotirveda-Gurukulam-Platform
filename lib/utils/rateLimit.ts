import { NextResponse } from "next/server";

const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export function rateLimit(
  ip: string,
  limit: number = 10,
  windowMs: number = 60000 // 1 minute default
): NextResponse | null {
  // Take the first IP if it's a comma-separated list (from x-forwarded-for)
  const clientIp = ip.split(',')[0].trim();
  const now = Date.now();
  const windowData = rateLimitMap.get(clientIp);

  if (!windowData) {
    rateLimitMap.set(clientIp, { count: 1, lastReset: now });
    return null;
  }

  if (now - windowData.lastReset > windowMs) {
    // Reset window
    windowData.count = 1;
    windowData.lastReset = now;
    return null;
  }

  if (windowData.count >= limit) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  windowData.count++;
  return null;
}
