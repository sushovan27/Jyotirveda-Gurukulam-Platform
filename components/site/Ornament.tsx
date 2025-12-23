import * as React from "react";

type OrnamentProps = {
  className?: string;
  title?: string;
};

export function Ornament({ className, title = "Ornament" }: OrnamentProps) {
  return (
    <svg
      aria-hidden="true"
      role="img"
      viewBox="0 0 200 200"
      className={className}
    >
      <title>{title}</title>
      <defs>
        <radialGradient id="g" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="60%" stopColor="currentColor" stopOpacity="0.08" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" opacity="0.16" />
      <circle cx="100" cy="100" r="64" fill="none" stroke="currentColor" opacity="0.14" />
      <circle cx="100" cy="100" r="36" fill="url(#g)" />

      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * Math.PI) / 6;
        const x1 = 100 + Math.cos(a) * 36;
        const y1 = 100 + Math.sin(a) * 36;
        const x2 = 100 + Math.cos(a) * 92;
        const y2 = 100 + Math.sin(a) * 92;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            opacity="0.10"
          />
        );
      })}

      <path
        d="M100 52c10 14 10 28 0 42-10-14-10-28 0-42Z"
        fill="currentColor"
        opacity="0.12"
      />
      <path
        d="M148 100c-14 10-28 10-42 0 14-10 28-10 42 0Z"
        fill="currentColor"
        opacity="0.12"
      />
      <path
        d="M100 148c-10-14-10-28 0-42 10 14 10 28 0 42Z"
        fill="currentColor"
        opacity="0.12"
      />
      <path
        d="M52 100c14-10 28-10 42 0-14 10-28 10-42 0Z"
        fill="currentColor"
        opacity="0.12"
      />
    </svg>
  );
}
