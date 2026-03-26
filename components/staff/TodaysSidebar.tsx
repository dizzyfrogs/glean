"use client";

import { ClipboardList } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useStore } from "@/lib/store";
import { TODAY } from "@/lib/constants";

export function TodaysSidebar() {
  const wasteLogs = useStore((s) => s.wasteLogs);
  const currentUser = useStore((s) => s.currentUser);

  const isManager = currentUser?.role === "manager";
  const myLogs = wasteLogs.filter((l) => l.logged_by === currentUser?.name);
  const todayLogs = (isManager ? wasteLogs : myLogs).filter((l) => l.date === TODAY);

  const weekStart = new Date(TODAY + "T12:00:00");
  weekStart.setDate(weekStart.getDate() - 6);
  const weekLogs = myLogs.filter((l) => new Date(l.date + "T12:00:00") >= weekStart);
  const weekLbs = weekLogs.reduce((sum, l) => sum + l.qty_lbs, 0);

  return (
    <div className="flex flex-col gap-4">
      <Card padding="none">
        <div className="px-5 pt-5 pb-3 border-b border-[#e7e5e0]">
          <p className="text-[13px] font-semibold text-[#7d7870] uppercase tracking-wide font-jakarta">
            {isManager ? "Today's team entries" : "Today's entries"}
          </p>
        </div>

        {todayLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <ClipboardList
              size={28}
              strokeWidth={1.5}
              className="text-[#d4d1ca] mb-3"
              aria-hidden="true"
            />
            <p className="text-[14px] font-semibold text-[#5c5851]">No entries yet</p>
            <p className="text-[13px] text-[#7d7870] mt-1">Your logs will appear here</p>
          </div>
        ) : (
          <ul className="divide-y divide-[#f4f3f0]">
            {todayLogs.map((log) => (
              <li key={log.id} className="flex items-start gap-3 px-5 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-[#1a1916] truncate">{log.item}</p>
                  <p className="text-[12px] text-[#7d7870] mt-0.5">
                    {log.category} &middot; {log.qty_lbs} {log.unit}
                    {isManager && <span className="ml-1">&middot; {log.logged_by}</span>}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card padding="md" className="!bg-[#f2f7ee] !border-[#c4dfad]">
        <p className="text-[13px] font-semibold text-[#7d7870] uppercase tracking-wide font-jakarta mb-3">
          This week
        </p>
        <p className="font-fraunces text-[28px] font-[500] text-[#2d5016] leading-tight">
          {weekLbs.toFixed(1)} lbs
        </p>
        <p className="text-[13px] text-[#5c5851] font-jakarta mt-0.5">
          across {weekLogs.length} {weekLogs.length === 1 ? "entry" : "entries"}
        </p>
      </Card>
    </div>
  );
}
