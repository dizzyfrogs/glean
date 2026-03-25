import { SelectHTMLAttributes, forwardRef } from "react";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  id: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  hint?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, placeholder, error, hint, id, className = "", ...props }, ref) => {
    const selectId = id ?? label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={selectId}
          className="text-[13px] font-semibold text-[#1a1916] font-jakarta"
        >
          {label}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`h-11 w-full appearance-none rounded-[10px] border-[1.5px] bg-white pl-3 pr-10 text-[14px] text-[#1a1916] outline-none transition-all duration-150 cursor-pointer
              ${error ? "border-[#e84c3b] focus:border-[#e84c3b] focus:shadow-[0_0_0_3px_rgba(232,76,59,0.15)]" : "border-[#e7e5e0] focus:border-[#4a7c2f] focus:shadow-[0_0_0_3px_rgba(74,124,47,0.15)]"}
              ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            strokeWidth={1.5}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7d7870] pointer-events-none"
            aria-hidden="true"
          />
        </div>
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

Select.displayName = "Select";
