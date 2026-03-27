"use client";

import { useState } from "react";
import {
  Clock,
  Building,
  Phone,
  Mail,
  ChevronRight,
  Package,
  CheckCircle,
  Circle,
  Pencil,
  Trash2,
  History,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { SurplusOffer } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { SurplusDetailPanel } from "./SurplusDetailPanel";
import BroadcastModal from "./BroadcastModal";
import { useToast } from "@/components/ui/Toast";

function formatTime(t: string): string {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs !== 1 ? "s" : ""} ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function ActiveOfferRow({
  offer,
  onView,
  onEdit,
  onDelete,
}: {
  offer: SurplusOffer;
  onView: (o: SurplusOffer) => void;
  onEdit: (o: SurplusOffer) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-4 py-3.5 px-5 hover:bg-[#fafaf8] transition-colors group border-b border-[#f0eeea] last:border-b-0">
      <div className="w-8 h-8 rounded-full bg-[#f2f7ee] flex items-center justify-center flex-shrink-0">
        <Circle size={14} strokeWidth={1.5} className="text-[#4a7c2f]" aria-hidden />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-jakarta text-[13px] font-semibold text-[#1a1916] truncate">
          {offer.item}
        </p>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="font-jakarta text-[12px] text-[#7d7870]">
            {offer.qty} {offer.unit}
          </span>
          <span className="text-[#d4d1ca]">·</span>
          <div className="flex items-center gap-1 text-[#7d7870]">
            <Clock size={11} strokeWidth={1.5} aria-hidden />
            <span className="font-jakarta text-[12px]">
              {formatTime(offer.pickup_from)} to {formatTime(offer.pickup_by)}
            </span>
          </div>
          <span className="text-[#d4d1ca]">·</span>
          <span className="font-jakarta text-[12px] text-[#7d7870] truncate">
            {offer.kitchen_name}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Badge variant={offer.status}>
          {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
        </Badge>
        {offer.status === "available" && (
          <>
            <button
              onClick={() => onEdit(offer)}
              className="flex items-center justify-center w-[32px] h-[44px] text-[#7d7870] hover:text-[#1a1916] transition-colors"
              aria-label={`Edit ${offer.item}`}
            >
              <Pencil size={14} strokeWidth={1.5} aria-hidden />
            </button>
            <button
              onClick={() => onDelete(offer.id)}
              className="flex items-center justify-center w-[32px] h-[44px] text-[#7d7870] hover:text-[#c73a2a] transition-colors"
              aria-label={`Remove ${offer.item}`}
            >
              <Trash2 size={14} strokeWidth={1.5} aria-hidden />
            </button>
          </>
        )}
        <button
          onClick={() => onView(offer)}
          className="flex items-center gap-1 font-jakarta text-[12px] font-semibold text-[#4a7c2f] hover:text-[#3d6827] transition-colors min-h-[44px] px-1"
          aria-label={`View details for ${offer.item}`}
        >
          View details
          <ChevronRight size={14} strokeWidth={1.5} aria-hidden />
        </button>
      </div>
    </div>
  );
}

function ClaimedOfferRow({
  offer,
  onView,
  onComplete,
}: {
  offer: SurplusOffer;
  onView: (o: SurplusOffer) => void;
  onComplete: (id: string) => void;
}) {
  return (
    <div className="py-3.5 px-5 hover:bg-[#fafaf8] transition-colors border-b border-[#f0eeea] last:border-b-0">
      <div className="flex items-start gap-4">
        <div className="w-8 h-8 rounded-full bg-[#f2f7ee] flex items-center justify-center flex-shrink-0 mt-0.5">
          <CheckCircle size={14} strokeWidth={1.5} className="text-[#4a7c2f]" aria-hidden />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-jakarta text-[13px] font-semibold text-[#1a1916] truncate">
                {offer.item}
              </p>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="font-jakarta text-[12px] text-[#7d7870]">
                  {offer.qty} {offer.unit}
                </span>
                <span className="text-[#d4d1ca]">·</span>
                <div className="flex items-center gap-1 text-[#7d7870]">
                  <Clock size={11} strokeWidth={1.5} aria-hidden />
                  <span className="font-jakarta text-[12px]">
                    {formatTime(offer.pickup_from)} to {formatTime(offer.pickup_by)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => onComplete(offer.id)}
                className="flex items-center gap-1.5 px-3 h-[32px] rounded-[8px] border border-[#c9e0b6] bg-[#f5fbf0] font-jakarta text-[11px] font-semibold text-[#4a7c2f] hover:bg-[#eaf5e0] transition-colors"
                aria-label={`Mark ${offer.item} as completed`}
              >
                <CheckCircle size={11} strokeWidth={1.5} aria-hidden />
                Mark completed
              </button>
              <button
                onClick={() => onView(offer)}
                className="flex items-center gap-1 font-jakarta text-[12px] font-semibold text-[#4a7c2f] hover:text-[#3d6827] transition-colors min-h-[44px] flex-shrink-0"
                aria-label={`View details for ${offer.item}`}
              >
                View details
                <ChevronRight size={14} strokeWidth={1.5} aria-hidden />
              </button>
            </div>
          </div>

          {offer.claimed_by && (
            <div className="mt-2 flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <Building size={12} strokeWidth={1.5} className="text-[#4a7c2f] flex-shrink-0" aria-hidden />
                <span className="font-jakarta text-[12px] font-semibold text-[#1a1916]">
                  Claimed by {offer.claimed_by.org_name}
                </span>
                <span className="font-jakarta text-[11px] text-[#7d7870] ml-1">
                  · {timeAgo(offer.claimed_by.claimed_at)}
                </span>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-jakarta text-[12px] text-[#5c5851]">
                  {offer.claimed_by.contact_name}
                </span>
                <a
                  href={`tel:${offer.claimed_by.contact_phone}`}
                  className="flex items-center gap-1 font-jakarta text-[12px] text-[#4a7c2f] hover:underline"
                >
                  <Phone size={11} strokeWidth={1.5} aria-hidden />
                  {offer.claimed_by.contact_phone}
                </a>
                <a
                  href={`mailto:${offer.claimed_by.contact_email}`}
                  className="flex items-center gap-1 font-jakarta text-[12px] text-[#4a7c2f] hover:underline"
                >
                  <Mail size={11} strokeWidth={1.5} aria-hidden />
                  {offer.claimed_by.contact_email}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CompletedOfferRow({
  offer,
  onView,
}: {
  offer: SurplusOffer;
  onView: (o: SurplusOffer) => void;
}) {
  return (
    <div className="py-3 px-5 hover:bg-[#fafaf8] transition-colors border-b border-[#f0eeea] last:border-b-0">
      <div className="flex items-center gap-4">
        <div className="w-7 h-7 rounded-full bg-[#f4f3f0] flex items-center justify-center flex-shrink-0">
          <CheckCircle size={13} strokeWidth={1.5} className="text-[#b8b4ae]" aria-hidden />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-jakarta text-[13px] font-semibold text-[#5c5851] truncate">
            {offer.item}
          </p>
          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
            <span className="font-jakarta text-[12px] text-[#7d7870]">
              {offer.qty} {offer.unit}
            </span>
            {offer.claimed_by && (
              <>
                <span className="text-[#d4d1ca]">·</span>
                <span className="font-jakarta text-[12px] text-[#7d7870]">
                  {offer.claimed_by.org_name}
                </span>
              </>
            )}
            {offer.completed_at && (
              <>
                <span className="text-[#d4d1ca]">·</span>
                <span className="font-jakarta text-[12px] text-[#7d7870]">
                  {timeAgo(offer.completed_at)}
                </span>
              </>
            )}
          </div>
        </div>
        <button
          onClick={() => onView(offer)}
          className="flex items-center gap-1 font-jakarta text-[12px] font-semibold text-[#7d7870] hover:text-[#4a7c2f] transition-colors min-h-[44px] px-1 flex-shrink-0"
          aria-label={`View details for ${offer.item}`}
        >
          View
          <ChevronRight size={14} strokeWidth={1.5} aria-hidden />
        </button>
      </div>
    </div>
  );
}

export default function SurplusOfferList() {
  const surplusOffers = useStore((s) => s.surplusOffers);
  const deleteSurplusOffer = useStore((s) => s.deleteSurplusOffer);
  const completeSurplusOffer = useStore((s) => s.completeSurplusOffer);
  const { toast } = useToast();

  const [selectedOffer, setSelectedOffer] = useState<SurplusOffer | null>(null);
  const [editOffer, setEditOffer] = useState<SurplusOffer | undefined>(undefined);
  const [editOpen, setEditOpen] = useState(false);

  const activeOffers = surplusOffers.filter(
    (o) => o.status === "available" || o.status === "pending"
  );
  const claimedOffers = surplusOffers.filter((o) => o.status === "claimed");
  const completedOffers = surplusOffers.filter((o) => o.status === "completed");

  function handleEdit(offer: SurplusOffer) {
    setEditOffer(offer);
    setEditOpen(true);
  }

  function handleDelete(id: string) {
    deleteSurplusOffer(id);
    toast("Offer removed.", "success");
    if (selectedOffer?.id === id) setSelectedOffer(null);
  }

  function handleComplete(id: string) {
    completeSurplusOffer(id);
    toast("Offer marked as completed. Redistribution tallied.", "success");
    if (selectedOffer?.id === id) setSelectedOffer(null);
  }

  return (
    <>
      <div className="space-y-6">
        {/* Active */}
        <div className="bg-white border border-[#e7e5e0] rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#e7e5e0]">
            <p className="font-jakarta text-[11px] font-semibold uppercase tracking-wider text-[#7d7870]">
              Active Offers
            </p>
            <p className="font-fraunces text-[17px] font-[500] text-[#1a1916] mt-0.5">
              {activeOffers.length} available
            </p>
          </div>

          {activeOffers.length === 0 ? (
            <div className="px-5 py-10 flex flex-col items-center gap-2 text-center">
              <Package size={24} strokeWidth={1.5} className="text-[#d4d1ca]" aria-hidden />
              <p className="font-jakarta text-[14px] font-semibold text-[#7d7870]">No active offers</p>
              <p className="font-jakarta text-[12px] text-[#7d7870]">
                Broadcast an offer so food banks can see what&apos;s available.
              </p>
            </div>
          ) : (
            <div>
              {activeOffers.map((offer) => (
                <ActiveOfferRow
                  key={offer.id}
                  offer={offer}
                  onView={setSelectedOffer}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>

        {/* Claimed */}
        <div className="bg-white border border-[#e7e5e0] rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#e7e5e0]">
            <p className="font-jakarta text-[11px] font-semibold uppercase tracking-wider text-[#7d7870]">
              Claimed: Awaiting Completion
            </p>
            <p className="font-fraunces text-[17px] font-[500] text-[#1a1916] mt-0.5">
              {claimedOffers.length} pending pickup
            </p>
          </div>

          {claimedOffers.length === 0 ? (
            <div className="px-5 py-10 flex flex-col items-center gap-2 text-center">
              <CheckCircle size={24} strokeWidth={1.5} className="text-[#d4d1ca]" aria-hidden />
              <p className="font-jakarta text-[14px] font-semibold text-[#7d7870]">No claimed offers yet</p>
              <p className="font-jakarta text-[12px] text-[#7d7870]">
                When a food bank claims an offer it will appear here.
              </p>
            </div>
          ) : (
            <div>
              {claimedOffers.map((offer) => (
                <ClaimedOfferRow
                  key={offer.id}
                  offer={offer}
                  onView={setSelectedOffer}
                  onComplete={handleComplete}
                />
              ))}
            </div>
          )}
        </div>

        {/* Completed history */}
        <div className="bg-white border border-[#e7e5e0] rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#e7e5e0]">
            <div className="flex items-center gap-2">
              <History size={14} strokeWidth={1.5} className="text-[#7d7870]" aria-hidden />
              <p className="font-jakarta text-[11px] font-semibold uppercase tracking-wider text-[#7d7870]">
                Completed Redistributions
              </p>
            </div>
            <p className="font-fraunces text-[17px] font-[500] text-[#1a1916] mt-0.5">
              {completedOffers.length} completed
            </p>
          </div>

          {completedOffers.length === 0 ? (
            <div className="px-5 py-8 flex flex-col items-center gap-2 text-center">
              <History size={24} strokeWidth={1.5} className="text-[#d4d1ca]" aria-hidden />
              <p className="font-jakarta text-[14px] font-semibold text-[#7d7870]">No completed redistributions yet</p>
              <p className="font-jakarta text-[12px] text-[#7d7870]">
                Mark a claimed offer as completed once the food bank has picked it up.
              </p>
            </div>
          ) : (
            <div>
              {completedOffers.map((offer) => (
                <CompletedOfferRow key={offer.id} offer={offer} onView={setSelectedOffer} />
              ))}
            </div>
          )}
        </div>
      </div>

      <SurplusDetailPanel
        offer={selectedOffer}
        onClose={() => setSelectedOffer(null)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onComplete={handleComplete}
      />

      <BroadcastModal
        open={editOpen}
        onClose={() => { setEditOpen(false); setEditOffer(undefined); }}
        editOffer={editOffer}
      />
    </>
  );
}
