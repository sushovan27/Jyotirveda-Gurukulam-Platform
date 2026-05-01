import { z } from "zod";

import type { KundaliRequestBody } from "@/types/kundali";
import { isValidTimeZone } from "@/lib/utils/dateTime";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

export const kundaliRequestSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required.").max(100, "Name is too long."),
    birthDate: z.string().regex(DATE_PATTERN, "birthDate must match YYYY-MM-DD."),
    birthTime: z.string().regex(TIME_PATTERN, "birthTime must match HH:MM in 24-hour format."),
    latitude: z.number().finite().optional(),
    longitude: z.number().finite().optional(),
    timezone: z.string().trim().min(1, "Timezone is required."),
    city: z.string().trim().min(1).max(150, "City is too long.").optional()
  })
  .superRefine((value, context) => {
    if (
      (typeof value.latitude === "number" && typeof value.longitude !== "number") ||
      (typeof value.longitude === "number" && typeof value.latitude !== "number")
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Latitude and longitude must be supplied together."
      });
    }

    if (typeof value.latitude === "number" && (value.latitude < -90 || value.latitude > 90)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Latitude must be between -90 and 90."
      });
    }

    if (typeof value.longitude === "number" && (value.longitude < -180 || value.longitude > 180)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Longitude must be between -180 and 180."
      });
    }

    if (!isValidTimeZone(value.timezone)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Timezone must be a valid IANA timezone string."
      });
    }

    if (typeof value.latitude !== "number" && typeof value.longitude !== "number" && !value.city) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Provide latitude and longitude, or include city for geolocation fallback."
      });
    }
  });

/**
 * Validates and parses a Kundali API payload.
 */
export function validateKundaliPayload(payload: unknown): KundaliRequestBody {
  return kundaliRequestSchema.parse(payload);
}
