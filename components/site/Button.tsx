import Link from "next/link";
import * as React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = {
  variant?: ButtonVariant;
  href?: string;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const stylesByVariant: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-dark text-brand-cream hover:bg-brand-dark-hover ring-1 ring-brand-gold/40 shadow-[0_12px_30px_-18px_rgba(212,175,55,0.55)]",
  secondary:
    "bg-brand-cream text-brand-dark hover:bg-white ring-1 ring-brand-dark/15",
  ghost:
    "bg-transparent text-brand-dark hover:bg-brand-dark/5 ring-1 ring-transparent",
};

export function Button({
  variant = "primary",
  href,
  className,
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold tracking-wide transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/70 disabled:opacity-50";
  const cls = [base, stylesByVariant[variant], className].filter(Boolean).join(" ");

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
