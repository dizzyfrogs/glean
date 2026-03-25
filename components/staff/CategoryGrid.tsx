import { Leaf, Drumstick, Milk, UtensilsCrossed, Croissant, Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const CATEGORIES: { id: string; label: string; Icon: LucideIcon; color: string }[] = [
  { id: "produce", label: "Produce", Icon: Leaf, color: "#4a7c2f" },
  { id: "protein", label: "Protein", Icon: Drumstick, color: "#e84c3b" },
  { id: "dairy", label: "Dairy", Icon: Milk, color: "#3b82f6" },
  { id: "prepared", label: "Prepared", Icon: UtensilsCrossed, color: "#d97706" },
  { id: "bakery", label: "Bakery", Icon: Croissant, color: "#f59e0b" },
  { id: "other", label: "Other", Icon: Package, color: "#7d7870" },
];

interface CategoryGridProps {
  value: string;
  onChange: (id: string) => void;
  error?: string;
}

export function CategoryGrid({ value, onChange, error }: CategoryGridProps) {
  return (
    <div>
      <p className="text-[13px] font-semibold text-[#1a1916] mb-2 font-jakarta">Category</p>
      <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Waste category">
        {CATEGORIES.map(({ id, label, Icon, color }) => {
          const selected = value === id;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(id)}
              className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-[12px] min-h-[56px] transition-all duration-150 cursor-pointer outline-none
                focus-visible:ring-2 focus-visible:ring-[#4a7c2f] focus-visible:ring-offset-1
                ${
                  selected
                    ? "border-2 border-[#4a7c2f] bg-[#f2f7ee]"
                    : "border border-[#e7e5e0] bg-white hover:border-[#4a7c2f] hover:bg-[#f9fbf7]"
                }`}
            >
              <Icon
                size={18}
                strokeWidth={1.5}
                aria-hidden="true"
                style={{ color: selected ? color : "#7d7870" }}
              />
              <span
                className={`text-[12px] font-semibold font-jakarta ${
                  selected ? "text-[#2d5016]" : "text-[#5c5851]"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
      {error && (
        <p className="text-[13px] text-[#e84c3b] mt-1.5" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
