"use client";

import { useEffect } from "react";
import { X, Tag, Scale, User, Utensils, Calendar } from "lucide-react";
import { WasteLog } from "@/lib/types";
import { WASTE_CATEGORIES, COST_PER_LB } from "@/lib/constants";

interface Props {
  log: WasteLog | null;
  onClose: () => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function formatSlug(s: string): string {
  return s
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function getCategoryMeta(id: string) {
  return WASTE_CATEGORIES.find((c) => c.id === id) ?? { label: id, color: "#d4d1ca" };
}

export function WasteLogDetailPanel({ log, onClose }: Props) {
  const open = !!log;

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const cat = log ? getCategoryMeta(log.category) : { label: "", color: "#d4d1ca" };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-200 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-[440px] bg-white shadow-2xl flex flex-col transition-transform duration-[250ms] ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={log?.item ?? "Log details"}
      >
        {log && (
          <>
            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-[#e7e5e0]">
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: cat.color }}
                    aria-hidden
                  />
                  <span className="font-jakarta text-[11px] font-semibold uppercase tracking-wider text-[#7d7870]">
                    {cat.label}
                  </span>
                </div>
                <h2 className="font-fraunces text-[20px] font-[500] text-[#1a1916] leading-snug">
                  {log.item}
                </h2>
                <p className="font-jakarta text-[13px] text-[#7d7870] mt-0.5">Waste Log</p>
              </div>
              <button
                onClick={onClose}
                className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-[#f4f3f0] transition-colors flex-shrink-0 -mt-1.5 -mr-1.5"
                aria-label="Close panel"
              >
                <X size={16} strokeWidth={1.5} className="text-[#7d7870]" aria-hidden />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Amount + cost */}
              <div className="bg-[#f8f7f5] rounded-[12px] p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scale size={14} strokeWidth={1.5} className="text-[#4a7c2f]" aria-hidden />
                  <span className="font-fraunces text-[22px] font-[500] text-[#1a1916]">
                    {log.qty_lbs.toFixed(1)} lbs
                  </span>
                </div>
                <span className="font-jakarta text-[15px] font-semibold text-[#c73a2a]">
                  ${(log.qty_lbs * COST_PER_LB).toFixed(2)} est.
                </span>
              </div>

              {/* Photo */}
              {log.photo_url && (
                <div className="rounded-[12px] overflow-hidden border border-[#e7e5e0]" style={{ height: 180 }}>
                  <img src={log.photo_url} alt={log.item} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar size={14} strokeWidth={1.5} className="text-[#7d7870]" aria-hidden />
                    <span className="font-jakarta text-[12px] font-semibold text-[#1a1916]">Date</span>
                  </div>
                  <p className="font-jakarta text-[13px] text-[#5c5851]">{formatDate(log.date)}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Utensils size={14} strokeWidth={1.5} className="text-[#7d7870]" aria-hidden />
                    <span className="font-jakarta text-[12px] font-semibold text-[#1a1916]">Meal</span>
                  </div>
                  <p className="font-jakarta text-[13px] text-[#5c5851]">{formatSlug(log.meal)}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Tag size={14} strokeWidth={1.5} className="text-[#7d7870]" aria-hidden />
                    <span className="font-jakarta text-[12px] font-semibold text-[#1a1916]">Reason</span>
                  </div>
                  <p className="font-jakarta text-[13px] text-[#5c5851]">{formatSlug(log.reason)}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <User size={14} strokeWidth={1.5} className="text-[#7d7870]" aria-hidden />
                    <span className="font-jakarta text-[12px] font-semibold text-[#1a1916]">Logged by</span>
                  </div>
                  <p className="font-jakarta text-[13px] text-[#5c5851]">{log.logged_by}</p>
                </div>
              </div>

              {log.notes && (
                <div>
                  <p className="font-jakarta text-[12px] font-semibold text-[#1a1916] mb-1">Notes</p>
                  <p className="font-jakarta text-[13px] text-[#5c5851] leading-relaxed">{log.notes}</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
