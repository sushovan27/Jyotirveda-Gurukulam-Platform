import * as React from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

type SiteShellProps = {
  children: React.ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="min-h-screen bg-brand-cream text-brand-text">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
