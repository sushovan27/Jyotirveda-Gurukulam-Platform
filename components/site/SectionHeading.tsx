import * as React from "react";
import { Ornament } from "@/components/site/Ornament";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const isCenter = align === "center";
  return (
    <div className={isCenter ? "text-center" : ""}>
      {eyebrow ? (
        <div
          className={[
            "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
            "bg-white/60 ring-1 ring-brand-dark/10 text-brand-dark/80",
          ].join(" ")}
        >
          <span style={{ fontFamily: "var(--font-sanskrit)" }}>शुभम्</span>
          <span>{eyebrow}</span>
        </div>
      ) : null}
      <div className={isCenter ? "mx-auto max-w-2xl" : "max-w-2xl"}>
        <h2
          className="mt-3 text-balance text-2xl font-semibold tracking-tight text-brand-dark sm:text-3xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-pretty text-sm leading-relaxed text-brand-dark/75 sm:text-base">
            {description}
          </p>
        ) : null}
      </div>

      <div className={isCenter ? "mx-auto mt-4 h-10 w-10" : "mt-4 h-10 w-10"}>
        <Ornament className="h-full w-full text-brand-gold" />
      </div>
    </div>
  );
}
