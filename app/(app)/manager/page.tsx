"use client";

import { useState } from "react";
import { Plus, BarChart2, ArrowLeftRight, ClipboardList } from "lucide-react";
import { useStore } from "@/lib/store";
import MetricsRow from "@/components/manager/MetricsRow";
import WasteChart from "@/components/manager/WasteChart";
import CategoryDonut from "@/components/manager/CategoryDonut";
import AIRecommendations from "@/components/manager/AIRecommendations";
import SurplusOfferList from "@/components/manager/SurplusOfferList";
import WasteLogsTable from "@/components/manager/WasteLogsTable";
import BroadcastModal from "@/components/manager/BroadcastModal";
import { WasteLogForm } from "@/components/staff/WasteLogForm";
import { TodaysSidebar } from "@/components/staff/TodaysSidebar";
import { TODAY } from "@/lib/constants";

type Tab = "overview" | "surplus" | "log";

const formattedDate = new Date(TODAY + "T12:00:00").toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

const TABS: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", Icon: BarChart2 },
  { id: "surplus", label: "Surplus & Redistribution", Icon: ArrowLeftRight },
  { id: "log", label: "Log Waste", Icon: ClipboardList },
];

export default function ManagerPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const surplusOffers = useStore((s) => s.surplusOffers);
  const newClaimsCount = surplusOffers.filter((o) => o.status === "claimed" || o.status === "pending").length;

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
      {/* Page header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="font-fraunces text-[26px] font-[500] text-[#1a1916] leading-tight">
            Kitchen Dashboard
          </h1>
          <p className="font-jakarta text-[13px] text-[#7d7870] mt-1">
            Main Dining Kitchen · {formattedDate}
          </p>
        </div>
        <button
          onClick={() => setBroadcastOpen(true)}
          className="flex items-center gap-2 px-4 h-[44px] rounded-[10px] bg-[#4a7c2f] text-white font-jakarta text-[13px] font-semibold shadow-[0_2px_8px_rgba(74,124,47,0.3)] hover:bg-[#3d6827] hover:-translate-y-0.5 transition-all duration-150 flex-shrink-0"
          aria-label="Broadcast surplus offer"
        >
          <Plus size={16} strokeWidth={1.5} aria-hidden />
          Broadcast surplus
        </button>
      </div>

      {/* Metrics row — always visible */}
      <MetricsRow />

      {/* Tab bar */}
      <div className="mt-6 mb-6 overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <div className="flex items-center gap-1 bg-[#f0eeea] rounded-[12px] p-1 w-max">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`relative flex items-center gap-2 px-4 h-[44px] rounded-[9px] font-jakarta text-[13px] font-semibold transition-all duration-150 whitespace-nowrap ${
              tab === id
                ? "bg-white text-[#1a1916] shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                : "text-[#7d7870] hover:text-[#1a1916]"
            }`}
            aria-pressed={tab === id}
          >
            <Icon size={16} strokeWidth={1.5} aria-hidden />
            {label}
            {id === "surplus" && newClaimsCount > 0 && (
              <span className="ml-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#4a7c2f] text-white font-jakarta text-[10px] font-bold flex items-center justify-center leading-none" aria-label={`${newClaimsCount} new claims`}>
                {newClaimsCount}
              </span>
            )}
          </button>
        ))}
        </div>
      </div>

      {/* Overview */}
      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <WasteChart />
            </div>
            <div>
              <CategoryDonut />
            </div>
          </div>
          <AIRecommendations />
          <WasteLogsTable />
        </div>
      )}

      {/* Surplus & Redistribution */}
      {tab === "surplus" && (
        <div>
          <SurplusOfferList />
        </div>
      )}

      {/* Log Waste */}
      {tab === "log" && (
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="w-full lg:max-w-[580px] bg-white rounded-[14px] border border-[#e7e5e0] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-6">
            <WasteLogForm />
          </div>
          <div className="w-full lg:flex-1 lg:max-w-[340px]">
            <TodaysSidebar />
          </div>
        </div>
      )}

      <BroadcastModal open={broadcastOpen} onClose={() => setBroadcastOpen(false)} />
    </div>
  );
}
