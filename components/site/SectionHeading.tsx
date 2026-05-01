"use client";

import * as React from "react";
import { motion } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={isCenter ? "text-center" : ""}
    >
      {eyebrow ? (
        <div
          className={[
            "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
            "bg-white/60 ring-1 ring-brand-dark/10 text-brand-dark/80",
          ].join(" ")}
        >
          <span style={{ fontFamily: "var(--font-sanskrit)" }}>शुभम्</span>
          <span className="h-3 w-px bg-brand-dark/20" />
          <span className="uppercase tracking-[0.12em]">{eyebrow}</span>
        </div>
      ) : null}
      <div className={isCenter ? "mx-auto max-w-2xl" : "max-w-2xl"}>
        <h2
          className="mt-3 text-balance text-2xl font-semibold tracking-tight text-brand-dark sm:text-3xl font-display"
        >
          {title}
        </h2>
        {description ? (
          <p className="mt-3 text-pretty text-sm leading-relaxed text-brand-dark/70 sm:text-base">
            {description}
          </p>
        ) : null}
      </div>

      <div className={isCenter ? "mx-auto mt-5 h-8 w-8" : "mt-5 h-8 w-8"}>
        <Ornament className="h-full w-full text-brand-gold opacity-70" />
      </div>
    </motion.div>
  );
}
