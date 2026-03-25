import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className = "", ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-[13px] font-semibold text-[#1a1916] font-jakarta"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`h-11 w-full rounded-[10px] border-[1.5px] bg-white px-3 text-[14px] text-[#1a1916] placeholder:text-[#7d7870] outline-none transition-all duration-150
            ${error ? "border-[#e84c3b] focus:border-[#e84c3b] focus:shadow-[0_0_0_3px_rgba(232,76,59,0.15)]" : "border-[#e7e5e0] focus:border-[#4a7c2f] focus:shadow-[0_0_0_3px_rgba(74,124,47,0.15)]"}
            ${className}`}
          {...props}
        />
        {error && (
          <p className="text-[13px] text-[#e84c3b]" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-[13px] text-[#7d7870]">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
