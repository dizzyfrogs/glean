"use client";

import { Package, Scale, CheckCircle } from "lucide-react";
import { useStore, FOOD_BANKS } from "@/lib/store";

export default function SummaryBar() {
  const surplusOffers = useStore((s) => s.surplusOffers);
  const currentUser = useStore((s) => s.currentUser);

  const myFoodBank = FOOD_BANKS.find((fb) => fb.id === currentUser?.foodbank_id);
  const myOrgName = myFoodBank?.name ?? "";

  const availableNow = surplusOffers.filter((o) => o.status === "available").length;

  const totalLbs = surplusOffers
    .filter((o) => !o.claimed_by)
    .reduce((sum, o) => sum + (o.unit === "lbs" ? o.qty : 0), 0);

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const myClaims = surplusOffers.filter(
    (o) =>
      o.claimed_by?.org_name === myOrgName &&
      new Date(o.claimed_by.claimed_at).getTime() >= weekAgo
  ).length;

  const metrics = [
    {
      Icon: Package,
      label: "Available now",
      value: availableNow,
      unit: availableNow === 1 ? "offer" : "offers",
      iconColor: "#4a7c2f",
      iconBg: "#f2f7ee",
    },
    {
      Icon: Scale,
      label: "Total food available",
      value: totalLbs.toFixed(0),
      unit: "lbs",
      iconColor: "#b45309",
      iconBg: "#fffbeb",
    },
    {
      Icon: CheckCircle,
      label: "Your claims this week",
      value: myClaims,
      unit: myClaims === 1 ? "pickup" : "pickups",
      iconColor: "#1d4ed8",
      iconBg: "#eff6ff",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {metrics.map(({ Icon, label, value, unit, iconColor, iconBg }) => (
        <div
          key={label}
          className="bg-white border border-[#e7e5e0] rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0"
              style={{ background: iconBg }}
            >
              <Icon size={16} strokeWidth={1.5} style={{ color: iconColor }} aria-hidden />
            </div>
            <p className="font-jakarta text-[11px] font-semibold uppercase tracking-wider text-[#7d7870]">
              {label}
            </p>
          </div>
          <p className="font-fraunces text-[28px] font-[500] text-[#1a1916] leading-none">
            {value}
            <span className="font-jakarta text-[13px] font-normal text-[#7d7870] ml-1.5">
              {unit}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}
