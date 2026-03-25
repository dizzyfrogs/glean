import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "sm" | "md" | "lg" | "none";
}

export function Card({ padding = "md", className = "", children, ...props }: CardProps) {
  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-5",
    lg: "p-6",
  };

  return (
    <div
      className={`bg-white border border-[#e7e5e0] rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
