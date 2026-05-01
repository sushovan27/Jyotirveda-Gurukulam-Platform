import * as React from "react";

type CardProps = {
  className?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

export function Card({ className, children, onClick }: CardProps) {
  return (
    <div
      className={[
        "rounded-2xl bg-white/70 backdrop-blur",
        "ring-1 ring-brand-dark/10",
        "shadow-[0_18px_50px_-28px_rgba(74,10,10,0.35)]",
        className,
      ].join(" ")}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
