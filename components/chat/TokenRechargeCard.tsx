"use client";

import * as React from "react";
import { Button } from "@/components/site/Button";
import { ASTROLOGER_WHATSAPP, TOKEN_PACKS } from "@/lib/jyotirveda";

type TokenRechargeCardProps = {
  userName?: string | null;
  compact?: boolean;
};

function buildRechargeLink(label: string, tokens: number, price: number, userName?: string | null) {
  const message = `Namaste. I would like to request a token recharge for Jyotirveda AI chat.

Pack: ${label}
Tokens: ${tokens}
Price: Rs. ${price}
Name: ${userName ?? "Not provided"}

Please share the manual payment steps or confirm the recharge process.`;

  return `https://wa.me/${ASTROLOGER_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

export function TokenRechargeCard({ userName, compact = false }: TokenRechargeCardProps) {
  return (
    <div className={`rounded-3xl bg-white/90 p-5 ring-1 ring-brand-dark/10 shadow-sm ${compact ? "" : "sm:p-6"}`}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold">Recharge Tokens</p>
          <h3 className="mt-1 text-xl font-semibold text-brand-dark font-display">Continue after the free session</h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-dark/70">
            Online payment gateway integration is still in progress. For now, users can request a manual token recharge and receive payment instructions directly.
          </p>
        </div>
        <div className="rounded-full bg-brand-cream px-3 py-1 text-xs font-semibold text-brand-dark/60 ring-1 ring-brand-dark/10">
          Gateway coming soon
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {TOKEN_PACKS.map((pack) => (
          <div key={pack.id} className="rounded-2xl border border-brand-dark/10 bg-brand-cream/50 p-4">
            <div className="text-sm font-semibold text-brand-dark">{pack.label}</div>
            <div className="mt-2 text-2xl font-semibold text-brand-dark font-display">{pack.tokens} Tokens</div>
            <div className="mt-1 text-sm text-brand-dark/60">Rs. {pack.price}</div>
            <div className="mt-4 flex flex-col gap-2">
              <a
                href={buildRechargeLink(pack.label, pack.tokens, pack.price, userName)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-brand-dark px-4 py-2.5 text-sm font-semibold text-brand-cream transition hover:bg-[#3A0707]"
              >
                Request Manual Recharge
              </a>
              <button
                type="button"
                disabled
                className="inline-flex items-center justify-center rounded-full border border-brand-dark/15 bg-white px-4 py-2.5 text-sm font-semibold text-brand-dark/40"
              >
                Card / UPI Gateway Soon
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
