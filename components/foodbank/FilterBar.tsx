"use client";

import { Grid3x3, CircleDot, Flame, Leaf, Croissant, CheckCircle } from "lucide-react";

export type FoodBankFilter = "all" | "available" | "hot" | "produce" | "bakery" | "my-claims";

const FILTERS: { id: FoodBankFilter; label: string; Icon: React.ElementType }[] = [
  { id: "all", label: "All offers", Icon: Grid3x3 },
  { id: "my-claims", label: "My claims", Icon: CheckCircle },
  { id: "available", label: "Available now", Icon: CircleDot },
  { id: "hot", label: "Hot food", Icon: Flame },
  { id: "produce", label: "Produce", Icon: Leaf },
  { id: "bakery", label: "Bakery", Icon: Croissant },
];

interface Props {
  active: FoodBankFilter;
  onChange: (filter: FoodBankFilter) => void;
}

export default function FilterBar({ active, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap mb-6" role="group" aria-label="Filter offers">
      {FILTERS.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex items-center gap-1.5 px-3 h-[44px] rounded-full border font-jakarta text-[13px] font-semibold transition-all duration-150 ${
              isActive
                ? "bg-[#4a7c2f] border-[#4a7c2f] text-white"
                : "bg-white border-[#e7e5e0] text-[#5c5851] hover:border-[#b3c9a0] hover:bg-[#f8faf5]"
            }`}
            aria-pressed={isActive}
          >
            <Icon size={16} strokeWidth={1.5} aria-hidden />
            {label}
          </button>
        );
      })}
    </div>
  );
}
