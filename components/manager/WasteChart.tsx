"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useStore } from "@/lib/store";
import { TODAY } from "@/lib/constants";

function offsetDate(base: string, days: number): string {
  const d = new Date(base + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function formatLabel(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Deterministic fraction 0–1 from a date string (for demo redistribution)
function seededFrac(iso: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < iso.length; i++) {
    h ^= iso.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return (h % 1000) / 1000;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#e7e5e0] rounded-[10px] shadow-[0_4px_16px_rgba(0,0,0,0.10)] p-3 font-jakarta">
      <p className="text-[12px] font-semibold text-[#1a1916] mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-[12px]">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <span className="text-[#7d7870] capitalize">{p.name}:</span>
          <span className="font-semibold text-[#1a1916]">{p.value.toFixed(1)} lbs</span>
        </div>
      ))}
    </div>
  );
}

export default function WasteChart() {
  const wasteLogs = useStore((s) => s.wasteLogs);

  const data = Array.from({ length: 14 }, (_, i) => {
    const iso = offsetDate(TODAY, i - 13);
    const waste = wasteLogs
      .filter((l) => l.date === iso)
      .reduce((s, l) => s + l.qty_lbs, 0);
    const frac = seededFrac(iso);
    const redistributed = waste > 0 ? Math.round(waste * (0.15 + frac * 0.25) * 10) / 10 : 0;
    return {
      date: formatLabel(iso),
      waste: Math.round(waste * 10) / 10,
      redistributed,
    };
  });

  return (
    <div className="bg-white border border-[#e7e5e0] rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-jakarta text-[11px] font-semibold uppercase tracking-wider text-[#7d7870]">
            Waste Trends
          </p>
          <p className="font-fraunces text-[17px] font-[500] text-[#1a1916] mt-0.5">Last 14 Days</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-[3px] bg-[#4a7c2f]" aria-hidden />
            <span className="font-jakarta text-[11px] text-[#7d7870]">Waste</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-[3px] bg-[#f59e0b]" aria-hidden />
            <span className="font-jakarta text-[11px] text-[#7d7870]">Redistributed</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barGap={2} barCategoryGap="30%" margin={{ top: 4, right: 4, bottom: 0, left: -8 }}>
          <CartesianGrid strokeDasharray="0" stroke="#f0eeea" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fontFamily: "var(--font-jakarta)", fill: "#7d7870" }}
            axisLine={false}
            tickLine={false}
            interval={1}
          />
          <YAxis
            tick={{ fontSize: 10, fontFamily: "var(--font-jakarta)", fill: "#7d7870" }}
            axisLine={false}
            tickLine={false}
            width={28}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f4f3f0", radius: 4 }} />
          <Bar dataKey="waste" name="waste" fill="#4a7c2f" radius={[3, 3, 0, 0]} maxBarSize={18} />
          <Bar dataKey="redistributed" name="redistributed" fill="#f59e0b" radius={[3, 3, 0, 0]} maxBarSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
