import { DateTime } from "luxon";
import { NextRequest, NextResponse } from "next/server";
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
import { rateLimit } from "@/lib/utils/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

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

function inferYogas(planets: KundaliResponse["planets"], moonSign: string) {
  const yogas = new Set<string>();
  const moon = planets.find((planet) => planet.name === "Moon");
  const jupiter = planets.find((planet) => planet.name === "Jupiter");
  const sun = planets.find((planet) => planet.name === "Sun");
  const mercury = planets.find((planet) => planet.name === "Mercury");

  if (moon && jupiter && [1, 4, 7, 10].includes(((jupiter.house - moon.house + 12) % 12) + 1)) {
    yogas.add("Gajakesari Yoga");
  }

  if (sun && mercury && sun.house === mercury.house) {
    yogas.add("Budhaditya Yoga");
  }

  if (moonSign === "Cancer" || moonSign === "Taurus") {
    yogas.add("Chandra Bala Support");
  }

  return Array.from(yogas);
}

function inferDoshas(planets: KundaliResponse["planets"]) {
  const mars = planets.find((planet) => planet.name === "Mars");
  const rahu = planets.find((planet) => planet.name === "Rahu");
  const ketu = planets.find((planet) => planet.name === "Ketu");
  const realPlanets = planets.filter((planet) => !["Rahu", "Ketu"].includes(planet.name));

  const manglik = mars ? [1, 2, 4, 7, 8, 12].includes(mars.house) : false;
  const pitruDosha = rahu ? [1, 5, 9, 10].includes(rahu.house) : false;
  const kaalSarpa =
    rahu && ketu
      ? realPlanets.every((planet) => {
          const house = planet.house;
          const start = rahu.house;
          const end = ketu.house;

          if (start <= end) {
            return house >= start && house <= end;
          }

          return house >= start || house <= end;
        })
      : false;

  return { manglik, kaalSarpa, pitruDosha };
}

/**
 * Computes a full Vedic Kundali chart for the supplied birth details.
 */
export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);

    const ip = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const rateLimitResponse = rateLimit(ip, 10, 60000); // 10 charts per minute
    if (rateLimitResponse) return rateLimitResponse;

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
          "X-Cache": "HIT",
          "Cache-Control": "no-store"
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

    const sun = planets.find((planet) => planet.name === "Sun");

    if (!sun) {
      throw new Error("Sun placement could not be determined.");
    }

    const moonSign = moon.rashi;
    const sunSign = sun.rashi;
    const yogas = inferYogas(planets, moonSign);
    const doshas = inferDoshas(planets);

    const response: KundaliResponse = {
      name: payload.name,
      birthDetails: {
        date: payload.birthDate,
        time: payload.birthTime,
        place: payload.city ?? "Unknown",
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        timezone: payload.timezone
      },
      lagna: ascendant.sign,
      moonSign,
      sunSign,
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
      birthTimestampUtc: birthDateTimeUtc.toISO() ?? birthDateTimeUtc.toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'"),
      yogas,
      doshas
    };

    kundaliCache.set(cacheKey, response);

    // Save to database and send email
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // @ts-expect-error - Table not yet in generated database types
      await supabase.from("kundli_reports").upsert({
        user_id: user.id,
        name: payload.name,
        dob: payload.birthDate,
        tob: payload.birthTime,
        pob: payload.city,
        chart_data: response,
      }, { onConflict: "user_id" });

      if (process.env.RESEND_API_KEY && user.email) {
        import("resend").then(({ Resend }) => {
          const resend = new Resend(process.env.RESEND_API_KEY);
          resend.emails.send({
            from: "Jyotirveda <onboarding@resend.dev>",
            to: user.email!,
            subject: "Your Vedic Birth Chart is Ready!",
            html: `<p>Namaste ${payload.name},</p><p>Your Kundli has been generated successfully.</p><p><strong>Ascendant (Lagna):</strong> ${response.lagna}</p><p>Log in to your dashboard to view your complete planetary positions and chat with our AI Astrologer!</p>`,
          }).catch(e => console.error("Failed to send email", e));
        }).catch(e => console.error("Failed to import resend", e));
      }
    }

    return NextResponse.json({ interpretation: response }, {
      headers: {
        "X-Cache": "MISS",
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    if (error instanceof Error && (error.message.includes("Cross-origin") || error.message.includes("Invalid request origin"))) {
      return errorResponse(403, "FORBIDDEN", error.message);
    }

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
