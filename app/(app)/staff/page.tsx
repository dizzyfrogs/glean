"use client";

import { WasteLogForm } from "@/components/staff/WasteLogForm";
import { TodaysSidebar } from "@/components/staff/TodaysSidebar";

export default function StaffPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="font-fraunces text-[26px] font-[500] text-[#1a1916]">Log waste</h1>
        <p className="text-[14px] text-[#7d7870] mt-1">Record what didn&apos;t get used today</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="w-full lg:max-w-[580px] bg-white rounded-[14px] border border-[#e7e5e0] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-6">
          <WasteLogForm />
        </div>

        <div className="w-full lg:w-[300px] lg:flex-shrink-0">
          <TodaysSidebar />
        </div>
      </div>
    </div>
  );
}
