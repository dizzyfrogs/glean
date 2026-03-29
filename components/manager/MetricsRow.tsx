"use client";

import { TrendingUp, TrendingDown, Leaf, Package, DollarSign } from "lucide-react";
import { useStore } from "@/lib/store";
import { COST_PER_LB, CO2_MULTIPLIER, TODAY } from "@/lib/constants";

function offsetDate(base: string, days: number): string {
  const d = new Date(base + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export default function MetricsRow() {
  const wasteLogs = useStore((s) => s.wasteLogs);
  const surplusOffers = useStore((s) => s.surplusOffers);

  const thisWeekStart = offsetDate(TODAY, -6);
  const lastWeekStart = offsetDate(TODAY, -13);
  const lastWeekEnd = offsetDate(TODAY, -7);

  const thisWeekLogs = wasteLogs.filter((l) => l.date >= thisWeekStart && l.date <= TODAY);
  const lastWeekLogs = wasteLogs.filter((l) => l.date >= lastWeekStart && l.date <= lastWeekEnd);

  const thisWeekLbs = thisWeekLogs.reduce((s, l) => s + l.qty_lbs, 0);
  const lastWeekLbs = lastWeekLogs.reduce((s, l) => s + l.qty_lbs, 0);
  const pctChange = lastWeekLbs === 0 ? 0 : ((thisWeekLbs - lastWeekLbs) / lastWeekLbs) * 100;
  const isUp = pctChange >= 0;

  const cost = thisWeekLbs * COST_PER_LB;
  const co2 = thisWeekLbs * CO2_MULTIPLIER;

  const redistributedLbs = surplusOffers
    .filter(
      (o) =>
        (o.status === "claimed" || o.status === "completed") &&
        o.claimed_by &&
        o.claimed_by.claimed_at >= thisWeekStart
    )
    .reduce((s, o) => s + o.qty, 0);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Waste */}
      <div className="bg-white border border-[#e7e5e0] rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5">
        <p className="font-jakarta text-[11px] font-semibold uppercase tracking-wider text-[#7d7870] mb-3">
          Total Waste This Week
        </p>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-baseline gap-1">
            <span className="font-fraunces text-[28px] font-[500] leading-none text-[#1a1916]">
              {thisWeekLbs.toFixed(1)}
            </span>
            <span className="font-jakarta text-[13px] text-[#7d7870]">lbs</span>
          </div>
          {isUp
            ? <TrendingUp size={16} strokeWidth={1.5} className="text-[#c73a2a] flex-shrink-0" aria-hidden />
            : <TrendingDown size={16} strokeWidth={1.5} className="text-[#4a7c2f] flex-shrink-0" aria-hidden />}
        </div>
        <p className={`font-jakarta text-[12px] font-semibold ${isUp ? "text-[#c73a2a]" : "text-[#4a7c2f]"}`}>
          {isUp ? "+" : ""}{pctChange.toFixed(1)}% vs last week
        </p>
      </div>

      {/* Estimated Cost */}
      <div className="bg-white border border-[#e7e5e0] rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5">
        <p className="font-jakarta text-[11px] font-semibold uppercase tracking-wider text-[#7d7870] mb-3">
          Estimated Food Cost
        </p>
        <div className="flex items-end justify-between gap-2">
          <span className="font-fraunces text-[28px] font-[500] leading-none text-[#c73a2a]">
            ${cost.toFixed(0)}
          </span>
          <div className="w-8 h-8 rounded-full bg-[#fef2f2] flex items-center justify-center flex-shrink-0">
            <DollarSign size={16} strokeWidth={1.5} className="text-[#c73a2a]" aria-hidden />
          </div>
        </div>
        <p className="font-jakarta text-[11px] text-[#7d7870] mt-2">${COST_PER_LB.toFixed(2)} per lb</p>
      </div>

      {/* CO₂ */}
      <div className="bg-white border border-[#e7e5e0] rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5">
        <p className="font-jakarta text-[11px] font-semibold uppercase tracking-wider text-[#7d7870] mb-3">
          CO₂ Equivalent
        </p>
        <div className="flex items-end justify-between gap-2">
          <div className="flex items-baseline gap-1">
            <span className="font-fraunces text-[28px] font-[500] leading-none text-[#1a1916]">
              {co2.toFixed(1)}
            </span>
            <span className="font-jakarta text-[13px] text-[#7d7870]">lbs</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#f2f7ee] flex items-center justify-center flex-shrink-0">
            <Leaf size={16} strokeWidth={1.5} className="text-[#4a7c2f]" aria-hidden />
          </div>
        </div>
        <p className="font-jakarta text-[11px] text-[#7d7870] mt-2">{CO2_MULTIPLIER}× waste weight</p>
      </div>

      {/* Redistributed */}
      <div className="bg-white border border-[#e7e5e0] rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5">
        <p className="font-jakarta text-[11px] font-semibold uppercase tracking-wider text-[#7d7870] mb-3">
          Redistributed This Week
        </p>
        <div className="flex items-end justify-between gap-2">
          <div className="flex items-baseline gap-1">
            <span className="font-fraunces text-[28px] font-[500] leading-none text-[#4a7c2f]">
              {redistributedLbs}
            </span>
            <span className="font-jakarta text-[13px] text-[#7d7870]">lbs</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#f2f7ee] flex items-center justify-center flex-shrink-0">
            <Package size={16} strokeWidth={1.5} className="text-[#4a7c2f]" aria-hidden />
          </div>
        </div>
        <p className="font-jakarta text-[11px] text-[#7d7870] mt-2">via surplus offers</p>
      </div>
    </div>
  );
}
