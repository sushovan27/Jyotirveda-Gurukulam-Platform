import type { KundaliResponse, PlanetPosition } from "@/types/kundali";

export const BOOKING_URL = "/services";
export const CHAT_SESSION_KEY = "jyotirveda-chat-count";
export const KUNDALI_SESSION_KEY = "jyotirveda-kundali";
export const KUNDALI_REQUEST_SESSION_KEY = "jyotirveda-kundali-request";
export const ASTROLOGER_WHATSAPP = "918697332855";

export type StoredKundaliRequest = {
  name: string;
  dob: string;
  tob: string;
  pob: string;
};

export const TOKEN_PACKS = [
  { id: "starter", label: "Starter Pack", tokens: 20, price: 299 },
  { id: "seeker", label: "Seeker Pack", tokens: 50, price: 699 },
  { id: "deep-dive", label: "Deep Dive Pack", tokens: 120, price: 1499 }
] as const;

export const AI_DISCLAIMER =
  "⚠️ I am an AI assistant. Astrological insights provided here are general in nature and may not be fully accurate. For precise and personalised predictions, please consult our certified Vedic astrologers.";

export const SOFT_NUDGE_MESSAGE = `For a more detailed and personalised reading covering all aspects of your life,
I recommend booking a one-on-one consultation with our expert astrologers.
📅 Book a Consultation → ${BOOKING_URL}`;

export const FIRM_PROMPT_MESSAGE = `You've asked about some very important areas of your chart. Our astrologers can
give you a complete, in-depth analysis covering career, relationships, health,
and spiritual growth in a dedicated consultation session.
📅 Book Your Consultation: Book Now → ${BOOKING_URL}`;

export const REDIRECT_MESSAGE = `Thank you for your questions! I've reached the limit of what I can share in
this free session. For the detailed, accurate, and personalised analysis you
deserve, please book a consultation with our Jyotirveda experts who will
study your complete birth chart with full care and attention.

📅 Book a Consultation Now → ${BOOKING_URL}

Wishing you clarity and light on your path. 🙏`;

export const PLANET_ABBREVIATIONS: Record<string, string> = {
  Sun: "Su",
  Moon: "Mo",
  Mars: "Ma",
  Mercury: "Me",
  Jupiter: "Ju",
  Venus: "Ve",
  Saturn: "Sa",
  Rahu: "Ra",
  Ketu: "Ke"
};

export function getActiveDoshas(doshas: KundaliResponse["doshas"]) {
  return Object.entries(doshas)
    .filter(([, isActive]) => isActive)
    .map(([name]) => name);
}

export function formatPlanetSummary(planet: PlanetPosition) {
  return `${planet.name}: ${planet.rashi}, House ${planet.house}${planet.isRetrograde ? ", Retrograde" : ""}`;
}

export function formatKundaliContext(kundali: KundaliResponse) {
  const activeDoshas = getActiveDoshas(kundali.doshas);

  return `KUNDALI DATA FOR THIS USER:
Name: ${kundali.name}
Birth: ${kundali.birthDetails.date} at ${kundali.birthDetails.time}, ${kundali.birthDetails.place}
Lagna: ${kundali.lagna}
Moon Sign: ${kundali.moonSign}
Sun Sign: ${kundali.sunSign}
Planets: ${kundali.planets.map(formatPlanetSummary).join("; ")}
Current Mahadasha: ${kundali.dasha.mahadasha.lord} until ${kundali.dasha.mahadasha.end}
Current Antardasha: ${kundali.dasha.antardasha.lord} until ${kundali.dasha.antardasha.end}
Current Pratyantar: ${kundali.dasha.pratyantar?.lord ?? "Unavailable"} until ${kundali.dasha.pratyantar?.end ?? "Unavailable"}
Yogas: ${kundali.yogas.length > 0 ? kundali.yogas.join(", ") : "None noted"}
Doshas: ${activeDoshas.length > 0 ? activeDoshas.join(", ") : "None active"}

Use only this data to answer. Do not fabricate any planetary positions.`;
}

export function readSessionJson<T>(key: string): T | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(key);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    window.sessionStorage.removeItem(key);
    return null;
  }
}

export function saveStoredKundali(kundali: KundaliResponse) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(KUNDALI_SESSION_KEY, JSON.stringify(kundali));
}

export function readStoredKundali() {
  return readSessionJson<KundaliResponse>(KUNDALI_SESSION_KEY);
}

export function saveStoredKundaliRequest(request: StoredKundaliRequest) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(KUNDALI_REQUEST_SESSION_KEY, JSON.stringify(request));
}

export function readStoredKundaliRequest() {
  return readSessionJson<StoredKundaliRequest>(KUNDALI_REQUEST_SESSION_KEY);
}
