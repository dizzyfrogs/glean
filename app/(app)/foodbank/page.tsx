"use client";

import { useState } from "react";
import { Package } from "lucide-react";
import { useStore, FOOD_BANKS, KITCHENS } from "@/lib/store";
import { SurplusOffer } from "@/lib/types";
import { TODAY } from "@/lib/constants";
import SummaryBar from "@/components/foodbank/SummaryBar";
import FilterBar, { FoodBankFilter } from "@/components/foodbank/FilterBar";
import OfferCard from "@/components/foodbank/OfferCard";
import ClaimModal from "@/components/foodbank/ClaimModal";
import ViewInstructionsModal from "@/components/foodbank/ViewInstructionsModal";

const formattedDate = new Date(TODAY + "T12:00:00").toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

const RADIUS_OPTIONS = [5, 10, 25, 50, 100] as const;
type Radius = (typeof RADIUS_OPTIONS)[number];

function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 3958.8; // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function FoodBankPage() {
  const surplusOffers = useStore((s) => s.surplusOffers);
  const currentUser = useStore((s) => s.currentUser);

  const [filter, setFilter] = useState<FoodBankFilter>("all");
  const [radius, setRadius] = useState<Radius>(25);
  const [claimOffer, setClaimOffer] = useState<SurplusOffer | null>(null);
  const [viewOffer, setViewOffer] = useState<SurplusOffer | null>(null);

  const myFoodBank = FOOD_BANKS.find((fb) => fb.id === currentUser?.foodbank_id);
  const myOrgName = myFoodBank?.name ?? "";

  // Exclude completed offers entirely from the food bank feed
  const visibleOffers = surplusOffers.filter((o) => o.status !== "completed");

  // Apply distance filter when food bank has coordinates
  const withinRadius = myFoodBank?.lat != null
    ? visibleOffers.filter((o) => {
        const kitchen = KITCHENS.find((k) => k.id === o.kitchen_id);
        if (!kitchen) return true;
        const dist = haversineDistance(
          myFoodBank.lat, myFoodBank.lng,
          kitchen.lat, kitchen.lng
        );
        return dist <= radius;
      })
    : visibleOffers;

  const filtered = withinRadius.filter((o) => {
    if (filter === "available") return o.status === "available";
    if (filter === "hot") return o.status === "available" && o.food_type === "hot";
    if (filter === "produce") return o.status === "available" && o.food_type === "produce";
    if (filter === "bakery") return o.status === "available" && o.food_type === "bakery";
    if (filter === "my-claims") return o.claimed_by?.org_name === myOrgName;
    return true; // "all"
  });

  // Available offers first, then claimed
  const sorted = [...filtered].sort((a, b) => {
    const aAvail = !a.claimed_by ? 0 : 1;
    const bAvail = !b.claimed_by ? 0 : 1;
    return aAvail - bAvail;
  });

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="font-fraunces text-[26px] font-[500] text-[#1a1916] leading-tight">
          Surplus Feed
        </h1>
        <p className="font-jakarta text-[13px] text-[#7d7870] mt-1">
          {myFoodBank?.name ?? "Food Bank"} · {formattedDate}
        </p>
      </div>

      <SummaryBar />
      <FilterBar active={filter} onChange={setFilter} />

      {/* Radius selector */}
      <div className="flex items-center gap-3 mb-6">
        <span className="font-jakarta text-[12px] font-semibold text-[#7d7870] flex-shrink-0">
          Within
        </span>
        <div className="flex items-center gap-1.5 flex-wrap" role="group" aria-label="Distance radius">
          {RADIUS_OPTIONS.map((r) => (
            <button
              key={r}
              onClick={() => setRadius(r)}
              className={`px-3 h-[44px] rounded-full border font-jakarta text-[12px] font-semibold transition-all duration-150 ${
                radius === r
                  ? "bg-[#4a7c2f] border-[#4a7c2f] text-white"
                  : "bg-white border-[#e7e5e0] text-[#5c5851] hover:border-[#b3c9a0] hover:bg-[#f8faf5]"
              }`}
              aria-pressed={radius === r}
            >
              {r} mi
            </button>
          ))}
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-12 h-12 rounded-full bg-[#f0eeea] flex items-center justify-center mb-4">
            <Package size={20} strokeWidth={1.5} className="text-[#b8b4ae]" aria-hidden />
          </div>
          <p className="font-fraunces text-[18px] font-[500] text-[#1a1916] mb-1">
            No offers here
          </p>
          <p className="font-jakarta text-[13px] text-[#7d7870]">
            {filter === "my-claims"
              ? "You haven't claimed any pickups yet."
              : `No offers within ${radius} miles. Try expanding the radius.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sorted.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              myOrgName={myOrgName}
              onClaim={setClaimOffer}
              onViewInstructions={setViewOffer}
              distanceMi={(() => {
                if (myFoodBank?.lat == null) return undefined;
                const kitchen = KITCHENS.find((k) => k.id === offer.kitchen_id);
                if (!kitchen) return undefined;
                return haversineDistance(myFoodBank.lat, myFoodBank.lng, kitchen.lat, kitchen.lng);
              })()}
            />
          ))}
        </div>
      )}

      <ClaimModal offer={claimOffer} onClose={() => setClaimOffer(null)} />
      <ViewInstructionsModal
        offer={viewOffer}
        onClose={() => setViewOffer(null)}
        myOrgName={myOrgName}
      />
    </div>
  );
}
