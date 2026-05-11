import clsx from "clsx";
import { AnchorHTMLAttributes, ReactNode } from "react";

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;

  variant?: "primary" | "accent" | "muted" | "ghost" | "surface" | "success";

  size?: "sm" | "md" | "lg";

  rounded?: "sm" | "md" | "lg" | "xl" | "full";

  fullWidth?: boolean;
}

export default function ButtonLink({
  children,
  variant = "surface",
  size = "md",
  rounded = "lg",
  fullWidth = false,
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <a
      className={clsx(
        "inline-flex items-center justify-center gap-2 font-medium transition",
        "disabled:pointer-events-none disabled:opacity-50",

        {
          "bg-primary text-primary-foreground hover:opacity-90":
            variant === "primary",
          "bg-accent text-accent-foreground hover:opacity-90":
            variant === "accent",
          "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground":
            variant === "muted",
          "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground":
            variant === "ghost",
          "border border-border bg-muted text-foreground hover:bg-accent hover:text-accent-foreground":
            variant === "surface",
          "bg-success text-success-foreground hover:opacity-90":
            variant === "success",

          "px-3 py-1.5 text-sm": size === "sm",
          "px-4 py-2 text-sm": size === "md",
          "px-5 py-3 text-base": size === "lg",

          "rounded-md": rounded === "sm",
          "rounded-lg": rounded === "md",
          "rounded-xl": rounded === "lg",
          "rounded-2xl": rounded === "xl",
          "rounded-full": rounded === "full",

          "w-full": fullWidth,
        },

        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
