export class GeocodingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GeocodingError";
  }
}

/**
 * Resolves coordinates directly from the payload or via Nominatim city lookup.
 */
export async function resolveCoordinates(input: {
  latitude?: number;
  longitude?: number;
  city?: string;
}): Promise<{ latitude: number; longitude: number }> {
  if (typeof input.latitude === "number" && typeof input.longitude === "number") {
    return {
      latitude: input.latitude,
      longitude: input.longitude
    };
  }

  if (!input.city) {
    throw new GeocodingError("Latitude and longitude are required unless a city is supplied for geocoding.");
  }

  const params = new URLSearchParams({
    q: input.city,
    format: "jsonv2",
    limit: "1"
  });

  const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
    headers: {
      "User-Agent": "vedic-kundali-api/1.0"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new GeocodingError(`Geocoding request failed with status ${response.status}.`);
  }

  const data = (await response.json()) as Array<{ lat: string; lon: string }>;
  const first = data[0];

  if (!first) {
    throw new GeocodingError(`No coordinates found for city "${input.city}".`);
  }

  return {
    latitude: Number.parseFloat(first.lat),
    longitude: Number.parseFloat(first.lon)
  };
}
