"use client";

import { MapPin, Scale, Users, Thermometer, Clock, CheckCircle2, Phone, Mail } from "lucide-react";
import { SurplusOffer } from "@/lib/types";
import { KITCHENS } from "@/lib/store";
import { TODAY } from "@/lib/constants";

// Fixed demo "now" so urgency is meaningful in the demo
const DEMO_NOW_MS = new Date(`${TODAY}T13:00:00`).getTime();

function parsePickupMs(timeStr: string): number {
  return new Date(`${TODAY}T${timeStr}:00`).getTime();
}

function getUrgency(pickup_by: string) {
  const byMs = parsePickupMs(pickup_by);
  const minutesLeft = Math.round((byMs - DEMO_NOW_MS) / 60000);

  if (minutesLeft <= 0) {
    return {
      pct: 0,
      barColor: "#c73a2a",
      textColor: "#c73a2a",
      label: "Pickup window closed",
    };
  }

  const pct = Math.min(100, (minutesLeft / 360) * 100);
  const hrs = Math.floor(minutesLeft / 60);
  const mins = minutesLeft % 60;

  if (minutesLeft < 120) {
    const label =
      hrs > 0 ? `Pickup closes in ${hrs}h ${mins}m` : `Pickup closes in ${mins}m`;
    return { pct, barColor: "#c73a2a", textColor: "#c73a2a", label };
  }

  if (minutesLeft < 240) {
    const label = `Pickup closes in ${hrs}h${mins > 0 ? ` ${mins}m` : ""}`;
    return { pct, barColor: "#d97706", textColor: "#b45309", label };
  }

  return {
    pct,
    barColor: "#4a7c2f",
    textColor: "#4a7c2f",
    label: `Plenty of time · closes in ${hrs}h`,
  };
}

function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
}

const FOOD_TYPE_LABELS: Record<SurplusOffer["food_type"], string> = {
  hot: "Hot",
  cold: "Cold",
  produce: "Produce",
  bakery: "Bakery",
  other: "Other",
};

interface Props {
  offer: SurplusOffer;
  myOrgName: string;
  onClaim: (offer: SurplusOffer) => void;
  onViewInstructions: (offer: SurplusOffer) => void;
  distanceMi?: number;
}

export default function OfferCard({ offer, myOrgName, onClaim, onViewInstructions, distanceMi }: Props) {
  const isClaimed = !!offer.claimed_by;
  const isMyClm = isClaimed && offer.claimed_by?.org_name === myOrgName;
  const urgency = getUrgency(offer.pickup_by);
  const kitchen = isMyClm ? KITCHENS.find((k) => k.id === offer.kitchen_id) : null;

  return (
    <div
      className={`bg-white border border-[#e7e5e0] rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col transition-opacity duration-200 ${
        isClaimed && !isMyClm ? "opacity-60" : ""
      }`}
    >
      {/* only shown when there's a photo */}
      {offer.photo_url && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={offer.photo_url}
            alt={offer.item}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        {/* Status + food type badges */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {isClaimed ? (
            <span
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-jakarta text-[11px] font-semibold ${
                isMyClm
                  ? "bg-[#f2f7ee] text-[#4a7c2f]"
                  : "bg-[#f4f3f0] text-[#7d7870]"
              }`}
            >
              <CheckCircle2 size={14} strokeWidth={1.5} aria-hidden />
              {isMyClm ? "Claimed by you" : "Claimed"}
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-[#f2f7ee] text-[#4a7c2f] font-jakarta text-[11px] font-semibold">
              Available
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full bg-[#f4f3f0] text-[#5c5851] font-jakarta text-[11px] font-semibold capitalize">
            {FOOD_TYPE_LABELS[offer.food_type]}
          </span>
        </div>

        {/* Item name */}
        <h3 className="font-fraunces text-[18px] font-[500] text-[#1a1916] leading-snug mb-1">
          {offer.item}
        </h3>

        {/* Kitchen */}
        <div className="flex items-center gap-1.5 mb-4">
          <MapPin size={16} strokeWidth={1.5} className="text-[#7d7870] flex-shrink-0" aria-hidden />
          <span className="font-jakarta text-[12px] text-[#7d7870]">{offer.kitchen_name}</span>
          {distanceMi != null && (
            <>
              <span className="text-[#d4d0cb] font-jakarta text-[12px]">·</span>
              <span className="font-jakarta text-[12px] text-[#b8b4ae]">
                {distanceMi < 0.1 ? "<0.1" : distanceMi.toFixed(1)} mi
              </span>
            </>
          )}
        </div>

        {/* Details row */}
        <div className="flex items-center gap-4 flex-wrap mb-4">
          <span
            className="flex items-center gap-1.5"
            aria-label={`${offer.qty} ${offer.unit}`}
          >
            <Scale size={16} strokeWidth={1.5} className="text-[#7d7870]" aria-hidden />
            <span className="font-jakarta text-[13px] text-[#5c5851]">
              {offer.qty} {offer.unit}
            </span>
          </span>
          {offer.qty_portions != null && (
            <span
              className="flex items-center gap-1.5"
              aria-label={`${offer.qty_portions} portions`}
            >
              <Users size={16} strokeWidth={1.5} className="text-[#7d7870]" aria-hidden />
              <span className="font-jakarta text-[13px] text-[#5c5851]">
                {offer.qty_portions} portions
              </span>
            </span>
          )}
          <span
            className="flex items-center gap-1.5"
            aria-label={`Food type: ${FOOD_TYPE_LABELS[offer.food_type]}`}
          >
            <Thermometer size={16} strokeWidth={1.5} className="text-[#7d7870]" aria-hidden />
            <span className="font-jakarta text-[13px] text-[#5c5851]">
              {FOOD_TYPE_LABELS[offer.food_type]}
            </span>
          </span>
          <span
            className="flex items-center gap-1.5"
            aria-label={`Pickup ${formatTime(offer.pickup_from)} to ${formatTime(offer.pickup_by)}`}
          >
            <Clock size={16} strokeWidth={1.5} className="text-[#7d7870]" aria-hidden />
            <span className="font-jakarta text-[13px] text-[#5c5851]">
              {formatTime(offer.pickup_from)} to {formatTime(offer.pickup_by)}
            </span>
          </span>
        </div>

        {/* Notes */}
        {offer.notes && (
          <p className="font-jakarta text-[13px] text-[#7d7870] mb-4 leading-relaxed">
            {offer.notes}
          </p>
        )}

        {/* Kitchen contact, shown inline for claimed offers */}
        {isMyClm && kitchen && (
          <div className="flex flex-col gap-1.5 p-3.5 rounded-[10px] border border-[#c9e0b6] bg-[#f5fbf0] mb-4">
            <p className="font-jakarta text-[11px] font-semibold uppercase tracking-wider text-[#4a7c2f]">
              Kitchen contact
            </p>
            <p className="font-jakarta text-[13px] font-semibold text-[#1a1916]">
              {kitchen.contact_name}
            </p>
            <a
              href={`tel:${kitchen.contact_phone}`}
              className="flex items-center gap-1.5 font-jakarta text-[13px] text-[#4a7c2f] hover:underline"
              aria-label={`Call ${kitchen.contact_name}`}
            >
              <Phone size={16} strokeWidth={1.5} aria-hidden />
              {kitchen.contact_phone}
            </a>
            <a
              href={`mailto:${kitchen.contact_email}`}
              className="flex items-center gap-1.5 font-jakarta text-[13px] text-[#4a7c2f] hover:underline"
              aria-label={`Email ${kitchen.contact_name}`}
            >
              <Mail size={16} strokeWidth={1.5} aria-hidden />
              {kitchen.contact_email}
            </a>
          </div>
        )}

        {/* skip for claimed offers */}
        {!isClaimed && (
          <div className="mb-4">
            <div className="h-1.5 bg-[#f0eeea] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${urgency.pct}%`, backgroundColor: urgency.barColor }}
              />
            </div>
            <p
              className="font-jakarta text-[11px] mt-1.5"
              style={{ color: urgency.textColor }}
            >
              {urgency.label}
            </p>
          </div>
        )}

        <div className="flex-1" />

        {/* Action row */}
        <div className="flex gap-2 mt-2">
          {isMyClm ? (
            <button
              onClick={() => onViewInstructions(offer)}
              className="flex-1 h-[44px] rounded-[10px] border border-[#4a7c2f] bg-white font-jakarta text-[13px] font-semibold text-[#4a7c2f] hover:bg-[#f5fbf0] transition-colors"
              aria-label={`View pickup details for ${offer.item}`}
            >
              View pickup details
            </button>
          ) : isClaimed ? (
            <button
              disabled
              className="flex-1 h-[44px] rounded-[10px] bg-[#f0eeea] font-jakarta text-[13px] font-semibold text-[#b8b4ae] cursor-not-allowed"
            >
              Claimed
            </button>
          ) : (
            <>
              <button
                onClick={() => onClaim(offer)}
                className="flex-1 h-[44px] rounded-[10px] bg-[#4a7c2f] text-white font-jakarta text-[13px] font-semibold shadow-[0_2px_8px_rgba(74,124,47,0.3)] hover:bg-[#3d6827] hover:-translate-y-0.5 transition-all duration-150"
                aria-label={`Claim pickup for ${offer.item}`}
              >
                Claim pickup
              </button>
              <button
                onClick={() => onViewInstructions(offer)}
                className="h-[44px] px-4 rounded-[10px] border border-[#e7e5e0] bg-white font-jakarta text-[13px] font-semibold text-[#5c5851] hover:bg-[#f4f3f0] transition-colors"
                aria-label={`View pickup instructions for ${offer.item}`}
              >
                Instructions
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
