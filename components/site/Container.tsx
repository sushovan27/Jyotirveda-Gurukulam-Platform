import * as React from "react";

type ContainerProps = {
  className?: string;
  children: React.ReactNode;
};

export function Container({ className, children }: ContainerProps) {
  return (
    <div className={["mx-auto w-full max-w-6xl px-4 sm:px-6", className].join(" ")}>
      {children}
    </div>
  );
}
