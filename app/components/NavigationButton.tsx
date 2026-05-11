import clsx from "clsx";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface NavigationButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  value: string;
  direction?: "left" | "right";
  icon: ReactNode;
}

export default function NavigationButton({
  label,
  value,
  direction = "left",
  icon,
  className,
  ...props
}: NavigationButtonProps) {
  return (
    <button
      className={clsx(
        "group flex items-center gap-2",
        "rounded-xl border border-border bg-muted",
        "px-4 py-2.5",
        "transition-all",
        "hover:border-accent hover:bg-card",
        "disabled:pointer-events-none disabled:opacity-30",

        className,
      )}
      {...props}
    >
      {direction === "left" && (
        <div className="transition-transform group-hover:-translate-x-0.5">
          {icon}
        </div>
      )}

      <div className={direction === "right" ? "text-right" : "text-left"}>
        <p className="mb-0.5 text-[10px] uppercase tracking-widest leading-none text-muted-foreground">
          {label}
        </p>

        <p className="text-xs font-semibold text-foreground">{value}</p>
      </div>

      {direction === "right" && (
        <div className="transition-transform group-hover:translate-x-0.5">
          {icon}
        </div>
      )}
    </button>
  );
}
