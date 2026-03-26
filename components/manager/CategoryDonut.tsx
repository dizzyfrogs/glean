"use client";

import { PieChart, Pie, Cell, Label, ResponsiveContainer, Tooltip } from "recharts";
import { useStore } from "@/lib/store";
import { WASTE_CATEGORIES, TODAY } from "@/lib/constants";

function offsetDate(base: string, days: number): string {
  const d = new Date(base + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export default function CategoryDonut() {
  const wasteLogs = useStore((s) => s.wasteLogs);
  const thisWeekStart = offsetDate(TODAY, -6);

  const thisWeekLogs = wasteLogs.filter((l) => l.date >= thisWeekStart && l.date <= TODAY);
  const totalLbs = thisWeekLogs.reduce((s, l) => s + l.qty_lbs, 0);

  const categoryData = WASTE_CATEGORIES.map((cat) => ({
    id: cat.id,
    name: cat.label,
    color: cat.color,
    lbs: thisWeekLogs.filter((l) => l.category === cat.id).reduce((s, l) => s + l.qty_lbs, 0),
  }))
    .filter((c) => c.lbs > 0)
    .sort((a, b) => b.lbs - a.lbs);

  return (
    <div className="bg-white border border-[#e7e5e0] rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 h-full">
      <p className="font-jakarta text-[11px] font-semibold uppercase tracking-wider text-[#7d7870]">
        Waste by Category
      </p>
      <p className="font-fraunces text-[17px] font-[500] text-[#1a1916] mt-0.5 mb-4">This Week</p>

      <div className="flex items-center gap-4">
        {/* Donut */}
        <div className="flex-shrink-0" style={{ width: 148, height: 148 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="lbs"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={62}
                strokeWidth={0}
              >
                {categoryData.map((entry) => (
                  <Cell key={entry.id} fill={entry.color} />
                ))}
                <Label
                  content={({ viewBox }) => {
                    const vb = viewBox as { cx?: number; cy?: number };
                    const cx = vb?.cx ?? 74;
                    const cy = vb?.cy ?? 74;
                    return (
                      <g>
                        <text
                          x={cx}
                          y={cy - 6}
                          textAnchor="middle"
                          fontSize={18}
                          fontWeight={500}
                          fill="#1a1916"
                          fontFamily="var(--font-fraunces)"
                        >
                          {totalLbs.toFixed(0)}
                        </text>
                        <text
                          x={cx}
                          y={cy + 12}
                          textAnchor="middle"
                          fontSize={10}
                          fill="#7d7870"
                          fontFamily="var(--font-jakarta)"
                        >
                          lbs this week
                        </text>
                      </g>
                    );
                  }}
                />
              </Pie>
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(1)} lbs`]}
                contentStyle={{
                  border: "1px solid #e7e5e0",
                  borderRadius: 10,
                  fontSize: 12,
                  fontFamily: "var(--font-jakarta)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex-1 min-w-0 space-y-2">
          {categoryData.map((cat) => {
            const pct = totalLbs > 0 ? (cat.lbs / totalLbs) * 100 : 0;
            return (
              <div key={cat.id} className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: cat.color }}
                  aria-hidden
                />
                <span className="font-jakarta text-[12px] text-[#1a1916] flex-1 truncate">
                  {cat.name}
                </span>
                <span className="font-jakarta text-[11px] text-[#7d7870] flex-shrink-0">
                  {pct.toFixed(0)}%
                </span>
                <span className="font-jakarta text-[11px] font-semibold text-[#1a1916] flex-shrink-0 w-14 text-right">
                  {cat.lbs.toFixed(1)} lbs
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
