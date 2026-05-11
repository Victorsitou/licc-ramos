import clsx from "clsx";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;

  size?: "sm" | "md" | "lg";
}

export default function IconButton({
  children,
  size = "md",
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center",
        "rounded-xl border border-border bg-card",
        "text-foreground transition",
        "hover:border-accent hover:bg-muted",
        "disabled:pointer-events-none disabled:opacity-30",

        {
          "p-1.5": size === "sm",
          "p-2": size === "md",
          "p-3": size === "lg",
        },

        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
