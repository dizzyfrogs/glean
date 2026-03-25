"use client";

import { Heart } from "lucide-react";

export default function FoodBankPage() {
  return (
    <div className="min-h-screen bg-[#f4f3f0] flex items-center justify-center">
      <div className="text-center">
        <Heart size={40} strokeWidth={1.5} className="text-[#4a7c2f] mx-auto mb-4" aria-hidden="true" />
        <h1 className="font-fraunces text-[26px] font-[500] text-[#1a1916] mb-2">
          Food Bank
        </h1>
        <p className="text-[14px] text-[#7d7870]">Surplus feed, coming soon</p>
      </div>
    </div>
  );
}
