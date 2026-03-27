"use client";

import { useState, useEffect } from "react";
import { RotateCw, Lightbulb, Scale, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

interface Recommendation {
  type: "portion" | "menu";
  title: string;
  text: string;
}

const CACHE_KEY = "glean-ai-recs";

interface CachedRecs {
  recommendations: Recommendation[];
  date: string; // YYYY-MM-DD, regen if day changes
}

function readCache(): Recommendation[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached: CachedRecs = JSON.parse(raw);
    const today = new Date().toISOString().split("T")[0];
    if (cached.date !== today) return null;
    return cached.recommendations;
  } catch {
    return null;
  }
}

function writeCache(recs: Recommendation[]) {
  try {
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem(CACHE_KEY, JSON.stringify({ recommendations: recs, date: today }));
  } catch {
    // not a big deal if it fails
  }
}

const TYPE_CONFIG = {
  portion: {
    label: "Portion Control",
    Icon: Scale,
  },
  menu: {
    label: "Menu Planning",
    Icon: Lightbulb,
  },
} as const;

export default function AIRecommendations() {
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load(isRefresh = false) {
    if (!isRefresh) {
      const cached = readCache();
      if (cached) {
        setRecs(cached);
        setLoading(false);
        return;
      }
    }
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/recommendations", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error ?? "Could not load recommendations.");
        setRecs([]);
      } else {
        const fetched = data.recommendations ?? [];
        setRecs(fetched);
        writeCache(fetched);
      }
    } catch {
      setError("Could not connect to the AI.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="bg-white border border-[#e7e5e0] rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-jakarta text-[11px] font-semibold uppercase tracking-wider text-[#7d7870]">
            AI
          </p>
          <p className="font-fraunces text-[17px] font-[500] text-[#1a1916] mt-0.5">
            Suggestions
          </p>
        </div>
        <button
          onClick={() => load(true)}
          disabled={loading || refreshing}
          className="flex items-center gap-1.5 px-3 h-[38px] rounded-[10px] border border-[#e7e5e0] font-jakarta text-[12px] font-semibold text-[#5c5851] hover:bg-[#f4f3f0] transition-colors disabled:opacity-50 min-h-[44px]"
          aria-label="Refresh recommendations"
        >
          <RotateCw
            size={14}
            strokeWidth={1.5}
            className={refreshing ? "animate-spin" : ""}
            aria-hidden
          />
          Refresh
        </button>
      </div>

      {error ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-[10px] border border-[#f5c6c2] bg-[#fef6f5]">
          <AlertCircle size={14} strokeWidth={1.5} className="text-[#c73a2a] flex-shrink-0" aria-hidden />
          <p className="font-jakarta text-[13px] text-[#c73a2a]">{error}</p>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="p-4 rounded-[10px] border border-[#e7e5e0] space-y-2">
              <Skeleton height={10} width="45%" />
              <Skeleton height={13} width="75%" />
              <Skeleton height={10} width="100%" />
              <Skeleton height={10} width="90%" />
              <Skeleton height={10} width="80%" />
            </div>
          ))}
        </div>
      ) : recs.length === 0 ? null : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {recs.map((rec, i) => {
            const cfg = TYPE_CONFIG[rec.type] ?? TYPE_CONFIG.menu;
            const { Icon, label } = cfg;
            return (
              <div
                key={i}
                className="p-4 rounded-[10px] border border-[#c9e0b6] bg-[#f5fbf0]"
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <Icon size={16} strokeWidth={1.5} className="text-[#4a7c2f]" aria-hidden />
                  <span className="font-jakarta text-[10px] font-semibold uppercase tracking-wider text-[#4a7c2f]">
                    {label}
                  </span>
                </div>
                <p className="font-jakarta text-[13px] font-semibold text-[#1a1916] mb-1.5 leading-snug">
                  {rec.title}
                </p>
                <p className="font-jakarta text-[12px] text-[#5c5851] leading-relaxed">
                  {rec.text}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
