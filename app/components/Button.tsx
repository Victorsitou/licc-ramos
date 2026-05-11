import clsx from "clsx";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "accent" | "muted" | "ghost" | "success" | "surface";
  size?: "sm" | "md" | "lg";
  rounded?: "sm" | "md" | "lg" | "full";
  fullWidth?: boolean;
  isHighlighted?: boolean;
  shouldPulse?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  rounded = "full",
  fullWidth = false,
  isHighlighted = false,
  shouldPulse = false,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 font-medium transition",
        "cursor-pointer disabled:cursor-not-allowed",
        "disabled:opacity-50",

        {
          "bg-primary text-primary-foreground hover:opacity-90":
            variant === "primary",
          "bg-accent text-accent-foreground hover:opacity-90":
            variant === "accent",
          "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground":
            variant === "muted",
          "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground":
            variant === "ghost",
          "bg-success text-success-foreground hover:opacity-90":
            variant === "success",
          "border border-border bg-muted text-foreground hover:bg-accent hover:text-accent-foreground":
            variant === "surface",

          "px-3 py-1.5 text-sm": size === "sm",
          "px-4 py-2 text-sm": size === "md",
          "px-5 py-3 text-base": size === "lg",

          "rounded-md": rounded === "sm",
          "rounded-lg": rounded === "md",
          "rounded-xl": rounded === "lg",
          "rounded-full": rounded === "full",

          "w-full": fullWidth,

          "ring-2 ring-ring bg-highlight": isHighlighted,

          "scale-[1.03]": shouldPulse,
        },

        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
