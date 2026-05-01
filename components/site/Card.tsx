import * as React from "react";

type CardProps = {
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={[
        "relative rounded-2xl bg-white/75 backdrop-blur-sm",
        "ring-1 ring-brand-dark/8",
        "shadow-[0_8px_30px_-12px_rgba(74,10,10,0.12)]",
        "transition-all duration-300 ease-out",
        "hover:shadow-[0_20px_50px_-15px_rgba(74,10,10,0.18)]",
        "hover:ring-brand-gold/20",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
