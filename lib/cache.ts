import { createHash } from "node:crypto";

import type { KundaliResponse } from "@/types/kundali";

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class InMemoryLruCache<T> {
  private readonly store = new Map<string, CacheEntry<T>>();

  constructor(
    private readonly maxEntries: number,
    private readonly ttlMs: number
  ) {}

  get(key: string): T | undefined {
    const entry = this.store.get(key);

    if (!entry) {
      return undefined;
    }

    if (entry.expiresAt <= Date.now()) {
      this.store.delete(key);
      return undefined;
    }

    this.store.delete(key);
    this.store.set(key, entry);
    return entry.value;
  }

  set(key: string, value: T): void {
    if (this.store.has(key)) {
      this.store.delete(key);
    }

    this.store.set(key, {
      value,
      expiresAt: Date.now() + this.ttlMs
    });

    while (this.store.size > this.maxEntries) {
      const oldestKey = this.store.keys().next().value as string | undefined;

      if (!oldestKey) {
        break;
      }

      this.store.delete(oldestKey);
    }
  }
}

/**
 * Builds a stable cache key from birth and location inputs.
 */
export function buildKundaliCacheKey(input: {
  birthDate: string;
  birthTime: string;
  latitude: number;
  longitude: number;
  timezone: string;
}): string {
  const payload = JSON.stringify({
    birthDate: input.birthDate,
    birthTime: input.birthTime,
    latitude: Number(input.latitude.toFixed(6)),
    longitude: Number(input.longitude.toFixed(6)),
    timezone: input.timezone
  });

  return createHash("sha256").update(payload).digest("hex");
}

export const kundaliCache = new InMemoryLruCache<KundaliResponse>(500, 1000 * 60 * 60 * 24);
