import { DateTime } from "luxon";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { createClient } from "@/lib/supabase/server";

import type { KundaliResponse } from "@/types/kundali";
import { calculateAscendant } from "@/lib/astro/ascendant";
import { getLahiriAyanamsa } from "@/lib/astro/ayanamsa";
import { buildVimshottariDasha } from "@/lib/astro/dasha";
import { buildWholeSignHouses } from "@/lib/astro/houses";
import { buildDivisionalCharts, calculatePlanetaryPositions, findMoonPlacement } from "@/lib/astro/planets";
import { SwissEphemerisError } from "@/lib/astro/swisseph";
import { buildKundaliCacheKey, kundaliCache } from "@/lib/cache";
import { convertBirthDataToUtc, toJulianDay } from "@/lib/utils/dateTime";
import { GeocodingError, resolveCoordinates } from "@/lib/utils/geo";
import { validateKundaliPayload } from "@/lib/utils/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function errorResponse(status: number, code: string, message: string, details?: unknown) {
  return NextResponse.json(
    {
      error: {
        code,
        message,
        details
      }
    },
    { status }
  );
}

/**
 * Computes a full Vedic Kundali chart for the supplied birth details.
 */
export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    
    // Map from frontend schema to API schema if needed
    const payloadBody = {
      name: rawBody.name,
      birthDate: rawBody.dob || rawBody.birthDate,
      birthTime: rawBody.tob || rawBody.birthTime,
      city: rawBody.pob || rawBody.city,
      timezone: rawBody.timezone || "Asia/Kolkata",
    };

    const payload = validateKundaliPayload(payloadBody);
    const coordinates = await resolveCoordinates({
      latitude: payload.latitude,
      longitude: payload.longitude,
      city: payload.city
    });

    const cacheKey = buildKundaliCacheKey({
      birthDate: payload.birthDate,
      birthTime: payload.birthTime,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      timezone: payload.timezone
    });

    const cached = kundaliCache.get(cacheKey);

    if (cached) {
      return NextResponse.json({ interpretation: cached }, {
        headers: {
          "X-Cache": "HIT"
        }
      });
    }

    const birthDateTimeUtc = convertBirthDataToUtc(payload.birthDate, payload.birthTime, payload.timezone);
    const julianDayUt = toJulianDay(birthDateTimeUtc);
    const ayanamsa = await getLahiriAyanamsa(julianDayUt);
    const ascendant = calculateAscendant(julianDayUt, coordinates.latitude, coordinates.longitude, ayanamsa);
    const planets = await calculatePlanetaryPositions(julianDayUt, ascendant.signIndex, ayanamsa);
    const moon = findMoonPlacement(planets);
    const { houses, rashiChart } = buildWholeSignHouses(ascendant.siderealLongitude, planets);
    const dasha = buildVimshottariDasha(moon.longitude, birthDateTimeUtc, DateTime.utc());
    const divisionalCharts = buildDivisionalCharts(planets);

    const response: KundaliResponse = {
      lagna: ascendant.sign,
      lagnaLongitude: ascendant.siderealLongitude,
      ayanamsa,
      rashiChart,
      planets,
      nakshatras: planets.map((planet) => ({
        planet: planet.name,
        nakshatra: planet.nakshatra,
        pada: planet.pada,
        lord: planet.nakshatraLord
      })),
      houses,
      dasha,
      divisionalCharts,
      birthTimestampUtc: birthDateTimeUtc.toISO() ?? birthDateTimeUtc.toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'")
    };

    kundaliCache.set(cacheKey, response);

    // Save to database and send email
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await (supabase.from("kundli_reports") as any).upsert({
        user_id: user.id,
        name: payload.name,
        dob: payload.birthDate,
        tob: payload.birthTime,
        pob: payload.city,
        chart_data: response as any,
      }, { onConflict: "user_id" });

      if (process.env.RESEND_API_KEY && user.email) {
        try {
          const { Resend } = await import("resend");
          const resend = new Resend(process.env.RESEND_API_KEY);
          await resend.emails.send({
            from: "Jyotirveda <onboarding@resend.dev>",
            to: user.email,
            subject: "Your Vedic Birth Chart is Ready!",
            html: `<p>Namaste ${payload.name},</p><p>Your Kundli has been generated successfully.</p><p><strong>Ascendant (Lagna):</strong> ${response.lagna}</p><p>Log in to your dashboard to view your complete planetary positions and chat with our AI Astrologer!</p>`,
          });
        } catch (e) {
          console.error("Failed to send email", e);
        }
      }
    }

    return NextResponse.json({ interpretation: response }, {
      headers: {
        "X-Cache": "MISS"
      }
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse(
        400,
        "VALIDATION_ERROR",
        "The request payload is invalid.",
        error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message
        }))
      );
    }

    if (error instanceof SyntaxError) {
      return errorResponse(400, "INVALID_JSON", "Request body must contain valid JSON.");
    }

    if (error instanceof GeocodingError || error instanceof RangeError) {
      return errorResponse(400, "INVALID_INPUT", error.message);
    }

    if (error instanceof SwissEphemerisError) {
      return errorResponse(502, "SWISSEPH_FAILURE", error.message);
    }

    console.error(error);
    return errorResponse(500, "INTERNAL_SERVER_ERROR", "An unexpected error occurred.");
  }
}
