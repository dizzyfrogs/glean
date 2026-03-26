"use client";

import { useState } from "react";
import { Download, ChevronDown, ChevronUp } from "lucide-react";
import { useStore } from "@/lib/store";
import { WASTE_CATEGORIES, COST_PER_LB } from "@/lib/constants";

function formatTime(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatMeal(meal: string): string {
  return meal
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function getCategoryMeta(id: string) {
  return WASTE_CATEGORIES.find((c) => c.id === id) ?? { label: id, color: "#d4d1ca" };
}

function exportCSV(logs: ReturnType<typeof useStore.getState>["wasteLogs"]) {
  const headers = ["Item", "Category", "Amount (lbs)", "Est. Cost ($)", "Logged By", "Meal", "Date", "Reason"];
  const rows = logs.map((log) => [
    log.item,
    getCategoryMeta(log.category).label,
    log.qty_lbs.toFixed(1),
    (log.qty_lbs * COST_PER_LB).toFixed(2),
    log.logged_by,
    formatMeal(log.meal),
    log.date,
    log.reason,
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "waste-logs.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const PAGE_SIZE = 20;

export default function WasteLogsTable() {
  const wasteLogs = useStore((s) => s.wasteLogs);
  const [showAll, setShowAll] = useState(false);
  const recentLogs = showAll ? wasteLogs : wasteLogs.slice(0, PAGE_SIZE);
  const hasMore = wasteLogs.length > PAGE_SIZE;

  return (
    <div className="bg-white border border-[#e7e5e0] rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#e7e5e0]">
        <div>
          <p className="font-jakarta text-[11px] font-semibold uppercase tracking-wider text-[#7d7870]">
            Waste Logs
          </p>
          <p className="font-fraunces text-[17px] font-[500] text-[#1a1916] mt-0.5">
            Recent Entries
          </p>
        </div>
        <button
          onClick={() => exportCSV(wasteLogs)}
          className="flex items-center gap-1.5 px-3 h-[38px] min-h-[44px] rounded-[10px] border border-[#e7e5e0] font-jakarta text-[12px] font-semibold text-[#5c5851] hover:bg-[#f4f3f0] transition-colors"
          aria-label="Export waste logs as CSV"
        >
          <Download size={14} strokeWidth={1.5} aria-hidden />
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#f8f7f5] border-b border-[#e7e5e0]">
              {["Item", "Category", "Amount", "Est. Cost", "Logged By", "Meal", "Date"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left font-jakarta text-[11px] font-semibold uppercase tracking-wider text-[#7d7870] whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentLogs.map((log, idx) => {
              const cat = getCategoryMeta(log.category);
              return (
                <tr
                  key={log.id}
                  className={`border-b border-[#f0eeea] hover:bg-[#fafaf8] transition-colors ${
                    idx === recentLogs.length - 1 ? "border-b-0" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-jakarta text-[13px] font-semibold text-[#1a1916] max-w-[180px]">
                    <span className="truncate block">{log.item}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: cat.color }}
                        aria-hidden
                      />
                      <span className="font-jakarta text-[12px] text-[#5c5851] whitespace-nowrap">
                        {cat.label}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-jakarta text-[13px] text-[#1a1916] whitespace-nowrap">
                    {log.qty_lbs.toFixed(1)} lbs
                  </td>
                  <td className="px-4 py-3 font-jakarta text-[13px] text-[#c73a2a] whitespace-nowrap">
                    ${(log.qty_lbs * COST_PER_LB).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 font-jakarta text-[12px] text-[#5c5851] whitespace-nowrap">
                    {log.logged_by}
                  </td>
                  <td className="px-4 py-3 font-jakarta text-[12px] text-[#5c5851] whitespace-nowrap">
                    {formatMeal(log.meal)}
                  </td>
                  <td className="px-4 py-3 font-jakarta text-[12px] text-[#7d7870] whitespace-nowrap">
                    {formatTime(log.date)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {recentLogs.length === 0 && (
        <div className="px-5 py-12 text-center">
          <p className="font-jakarta text-[14px] text-[#7d7870]">No waste logs yet.</p>
        </div>
      )}

      {hasMore && (
        <div className="border-t border-[#f0eeea]">
          <button
            onClick={() => setShowAll((v) => !v)}
            className="w-full flex items-center justify-center gap-1.5 py-3 font-jakarta text-[13px] font-semibold text-[#5c5851] hover:bg-[#fafaf8] transition-colors min-h-[44px]"
          >
            {showAll ? (
              <>
                <ChevronUp size={14} strokeWidth={1.5} aria-hidden />
                Show less
              </>
            ) : (
              <>
                <ChevronDown size={14} strokeWidth={1.5} aria-hidden />
                Show all {wasteLogs.length} entries
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
