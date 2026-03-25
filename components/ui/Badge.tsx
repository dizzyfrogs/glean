interface BadgeProps {
  variant: "available" | "pending" | "claimed" | "logged" | "hot" | "cold" | "produce" | "bakery" | "other";
  children: React.ReactNode;
  className?: string;
}

const VARIANTS: Record<BadgeProps["variant"], string> = {
  available: "bg-[#f2f7ee] text-[#3d6827] border border-[#c4dfad]",
  pending: "bg-[#fffbeb] text-[#d97706] border border-[#fde68a]",
  claimed: "bg-[#f4f3f0] text-[#5c5851] border border-[#e7e5e0]",
  logged: "bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe]",
  hot: "bg-[#fff5f3] text-[#c73a2a] border border-[#ffc9be]",
  cold: "bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe]",
  produce: "bg-[#f2f7ee] text-[#3d6827] border border-[#c4dfad]",
  bakery: "bg-[#fffbeb] text-[#d97706] border border-[#fde68a]",
  other: "bg-[#f4f3f0] text-[#5c5851] border border-[#e7e5e0]",
};

export function Badge({ variant, children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[12px] font-semibold ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
