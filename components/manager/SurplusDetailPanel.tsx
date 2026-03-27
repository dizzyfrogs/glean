"use client";

import { useEffect } from "react";
import {
  X,
  Clock,
  Building,
  Phone,
  Mail,
  MapPin,
  Flame,
  Snowflake,
  Leaf,
  Croissant,
  Package,
  CheckCircle,
  Pencil,
  Trash2,
  MessageSquare,
} from "lucide-react";
import { SurplusOffer } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";

interface Props {
  offer: SurplusOffer | null;
  onClose: () => void;
  onEdit?: (offer: SurplusOffer) => void;
  onDelete?: (id: string) => void;
  onComplete?: (id: string) => void;
}

const FOOD_TYPE_ICONS = {
  hot: Flame,
  cold: Snowflake,
  produce: Leaf,
  bakery: Croissant,
  other: Package,
};

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

export function SurplusDetailPanel({ offer, onClose, onEdit, onDelete, onComplete }: Props) {
  const open = !!offer;

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

  const FoodIcon = offer ? FOOD_TYPE_ICONS[offer.food_type] ?? Package : Package;

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
        aria-label={offer?.item ?? "Offer details"}
      >
        {offer && (
          <>
            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-[#e7e5e0]">
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-1">
                  <FoodIcon size={16} strokeWidth={1.5} className="text-[#4a7c2f] flex-shrink-0" aria-hidden />
                  <span className="font-jakarta text-[11px] font-semibold uppercase tracking-wider text-[#7d7870]">
                    {offer.food_type}
                  </span>
                </div>
                <h2 className="font-fraunces text-[20px] font-[500] text-[#1a1916] leading-snug">
                  {offer.item}
                </h2>
                <p className="font-jakarta text-[13px] text-[#7d7870] mt-0.5">{offer.kitchen_name}</p>
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
              {/* Status + qty */}
              <div className="flex items-center justify-between">
                <Badge variant={offer.status}>
                  {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                </Badge>
                <span className="font-fraunces text-[22px] font-[500] text-[#1a1916]">
                  {offer.qty} {offer.unit}
                  {offer.qty_portions && (
                    <span className="font-jakarta text-[13px] font-normal text-[#7d7870] ml-1.5">
                      · {offer.qty_portions} portions
                    </span>
                  )}
                </span>
              </div>

              {/* Photo */}
              {offer.photo_url && (
                <div className="rounded-[12px] overflow-hidden border border-[#e7e5e0]" style={{ height: 180 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={offer.photo_url} alt={offer.item} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Pickup window */}
              <div className="bg-[#f8f7f5] rounded-[12px] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={14} strokeWidth={1.5} className="text-[#4a7c2f]" aria-hidden />
                  <span className="font-jakarta text-[12px] font-semibold text-[#1a1916]">Pickup Window</span>
                </div>
                <p className="font-fraunces text-[18px] font-[500] text-[#1a1916]">
                  {formatTime(offer.pickup_from)} to {formatTime(offer.pickup_by)}
                </p>
              </div>

              {/* Pickup instructions */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <MapPin size={14} strokeWidth={1.5} className="text-[#7d7870]" aria-hidden />
                  <span className="font-jakarta text-[12px] font-semibold text-[#1a1916]">
                    Pickup Instructions
                  </span>
                </div>
                <p className="font-jakarta text-[13px] text-[#5c5851] leading-relaxed">
                  {offer.pickup_instructions}
                </p>
              </div>

              {/* Notes */}
              {offer.notes && (
                <div>
                  <p className="font-jakarta text-[12px] font-semibold text-[#1a1916] mb-1">Notes</p>
                  <p className="font-jakarta text-[13px] text-[#5c5851] leading-relaxed">{offer.notes}</p>
                </div>
              )}

              {/* Claimed by */}
              {offer.claimed_by && (
                <div className="border border-[#c9e0b6] bg-[#f5fbf0] rounded-[12px] p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle size={14} strokeWidth={1.5} className="text-[#4a7c2f]" aria-hidden />
                    <span className="font-jakarta text-[12px] font-semibold text-[#4a7c2f] uppercase tracking-wider">
                      Claimed
                    </span>
                    <span className="font-jakarta text-[11px] text-[#7d7870] ml-auto">
                      {timeAgo(offer.claimed_by.claimed_at)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Building size={14} strokeWidth={1.5} className="text-[#4a7c2f]" aria-hidden />
                    <span className="font-jakarta text-[14px] font-semibold text-[#1a1916]">
                      {offer.claimed_by.org_name}
                    </span>
                  </div>
                  <p className="font-jakarta text-[13px] text-[#5c5851] mb-3">
                    {offer.claimed_by.contact_name}
                  </p>
                  <div className="space-y-1.5">
                    <a
                      href={`tel:${offer.claimed_by.contact_phone}`}
                      className="flex items-center gap-2 font-jakarta text-[13px] text-[#4a7c2f] hover:underline"
                    >
                      <Phone size={16} strokeWidth={1.5} aria-hidden />
                      {offer.claimed_by.contact_phone}
                    </a>
                    <a
                      href={`mailto:${offer.claimed_by.contact_email}`}
                      className="flex items-center gap-2 font-jakarta text-[13px] text-[#4a7c2f] hover:underline"
                    >
                      <Mail size={16} strokeWidth={1.5} aria-hidden />
                      {offer.claimed_by.contact_email}
                    </a>
                  </div>
                  {offer.claimed_by.note_to_kitchen && (
                    <div className="mt-3 pt-3 border-t border-[#c9e0b6]">
                      <div className="flex items-center gap-1.5 mb-1">
                        <MessageSquare size={16} strokeWidth={1.5} className="text-[#4a7c2f]" aria-hidden />
                        <span className="font-jakarta text-[11px] font-semibold text-[#4a7c2f] uppercase tracking-wider">
                          Note from food bank
                        </span>
                      </div>
                      <p className="font-jakarta text-[13px] text-[#1a1916] leading-relaxed">
                        {offer.claimed_by.note_to_kitchen}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Contact info */}
              {offer.pickup_contact && !offer.claimed_by && (
                <div>
                  <p className="font-jakarta text-[12px] font-semibold text-[#1a1916] mb-1.5">Contact</p>
                  <a
                    href={`tel:${offer.pickup_contact}`}
                    className="flex items-center gap-2 font-jakarta text-[13px] text-[#4a7c2f] hover:underline"
                  >
                    <Phone size={16} strokeWidth={1.5} aria-hidden />
                    {offer.pickup_contact}
                  </a>
                </div>
              )}
            </div>

            {/* Footer actions */}
            {offer.status === "available" && (onEdit || onDelete) && (
              <div className="px-6 py-4 border-t border-[#e7e5e0] flex gap-3">
                {onEdit && (
                  <button
                    onClick={() => { onEdit(offer); onClose(); }}
                    className="flex-1 flex items-center justify-center gap-2 h-[44px] rounded-[10px] border border-[#e7e5e0] bg-white font-jakarta text-[13px] font-semibold text-[#5c5851] hover:bg-[#f4f3f0] transition-colors"
                  >
                    <Pencil size={14} strokeWidth={1.5} aria-hidden />
                    Edit offer
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => { onDelete(offer.id); onClose(); }}
                    className="flex items-center justify-center gap-2 h-[44px] px-4 rounded-[10px] border border-[#f4d0cc] bg-[#fef8f7] font-jakarta text-[13px] font-semibold text-[#c73a2a] hover:bg-[#fdecea] transition-colors"
                    aria-label="Remove offer"
                  >
                    <Trash2 size={14} strokeWidth={1.5} aria-hidden />
                    Remove
                  </button>
                )}
              </div>
            )}
            {offer.status === "claimed" && (
              <div className="px-6 py-4 border-t border-[#e7e5e0] flex gap-3">
                {offer.claimed_by && (
                  <a
                    href={`mailto:${offer.claimed_by.contact_email}`}
                    className="flex-1 flex items-center justify-center gap-2 h-[44px] rounded-[10px] border border-[#e7e5e0] bg-white font-jakarta text-[13px] font-semibold text-[#5c5851] hover:bg-[#f4f3f0] transition-colors"
                  >
                    <Mail size={14} strokeWidth={1.5} aria-hidden />
                    Get in touch
                  </a>
                )}
                {onComplete && (
                  <button
                    onClick={() => { onComplete(offer.id); onClose(); }}
                    className="flex-1 flex items-center justify-center gap-2 h-[44px] rounded-[10px] bg-[#4a7c2f] text-white font-jakarta text-[13px] font-semibold shadow-[0_2px_8px_rgba(74,124,47,0.3)] hover:bg-[#3d6827] transition-all hover:-translate-y-0.5"
                  >
                    <CheckCircle size={14} strokeWidth={1.5} aria-hidden />
                    Mark completed
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
