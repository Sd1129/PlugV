import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  icon?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
};

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  icon = false,
  fullWidth = false,
  disabled = false,
  className = "",
  type = "button",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300";

  const variants = {
    primary:
      "bg-sky-400 text-slate-950 shadow-lg shadow-sky-400/20 hover:bg-sky-300 hover:-translate-y-0.5 hover:shadow-xl",
    secondary:
      "border border-white/10 bg-white/5 text-white hover:bg-white/10",
    ghost:
      "text-slate-200 hover:bg-white/5 hover:text-white",
  };

  const width = fullWidth ? "w-full" : "";
  const disabledStyle = disabled ? "pointer-events-none opacity-50" : "";

  const classes = [
    base,
    variants[variant],
    width,
    disabledStyle,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {children}
      {icon && <ArrowRight className="h-4 w-4" />}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        aria-disabled={disabled}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {content}
    </button>
  );
}