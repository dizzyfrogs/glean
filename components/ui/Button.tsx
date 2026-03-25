"use client";

import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-semibold rounded-[10px] transition-all duration-150 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const sizes = {
      sm: "h-9 px-3 text-[13px]",
      md: "h-11 px-5 text-[14px]",
      lg: "h-12 px-7 text-[15px]",
    };

    const variants = {
      primary:
        "bg-[#4a7c2f] text-white shadow-[0_2px_8px_rgba(74,124,47,0.3)] hover:-translate-y-[1px] hover:bg-[#3d6827] hover:shadow-[0_4px_12px_rgba(74,124,47,0.4)] active:translate-y-0",
      secondary:
        "bg-white text-[#1a1916] border border-[#e7e5e0] hover:-translate-y-[1px] hover:bg-[#fafaf9] active:translate-y-0",
      ghost:
        "bg-transparent text-[#5c5851] hover:bg-[#f4f3f0] hover:text-[#1a1916]",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
        {...props}
      >
        {loading && (
          <Loader2
            size={16}
            strokeWidth={2}
            className="animate-spin"
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
