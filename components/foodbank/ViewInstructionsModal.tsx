"use client";

import { MapPin, Phone, Mail } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { KITCHENS } from "@/lib/store";
import { SurplusOffer } from "@/lib/types";

function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
}

interface Props {
  offer: SurplusOffer | null;
  onClose: () => void;
  myOrgName: string;
}

export default function ViewInstructionsModal({ offer, onClose, myOrgName }: Props) {
  if (!offer) return null;

  const kitchen = KITCHENS.find((k) => k.id === offer.kitchen_id);
  const hasPhoneInstructions =
    offer.pickup_instructions.toLowerCase().includes("call") ||
    offer.pickup_instructions.toLowerCase().includes("phone");

  const hasClaimed = offer.claimed_by?.org_name === myOrgName;

  return (
    <Modal open={!!offer} onClose={onClose} title="Pickup instructions" width="max-w-md">
      <div className="space-y-5">
        {/* Offer summary */}
        <div>
          <p className="font-fraunces text-[16px] font-[500] text-[#1a1916]">{offer.item}</p>
          <p className="font-jakarta text-[13px] text-[#7d7870] mt-0.5">
            {offer.kitchen_name} · Pickup {formatTime(offer.pickup_from)} to {formatTime(offer.pickup_by)}
          </p>
        </div>

        {/* Instructions box */}
        <div className="flex gap-3 p-4 rounded-[10px] border border-[#c9e0b6] bg-[#f5fbf0]">
          {hasPhoneInstructions ? (
            <Phone size={16} strokeWidth={1.5} className="text-[#4a7c2f] flex-shrink-0 mt-0.5" aria-hidden />
          ) : (
            <MapPin size={16} strokeWidth={1.5} className="text-[#4a7c2f] flex-shrink-0 mt-0.5" aria-hidden />
          )}
          <p className="font-jakarta text-[13px] text-[#1a1916] leading-relaxed">
            {offer.pickup_instructions}
          </p>
        </div>

        {/* Kitchen contact, only shown after claiming */}
        {hasClaimed && kitchen ? (
          <div className="space-y-2">
            <p className="font-jakarta text-[13px] font-semibold text-[#1a1916]">
              Kitchen contact
            </p>
            <p className="font-jakarta text-[13px] text-[#5c5851] font-semibold">
              {kitchen.contact_name}
            </p>
            <div className="flex flex-col gap-1.5">
              <a
                href={`tel:${kitchen.contact_phone}`}
                className="flex items-center gap-2 font-jakarta text-[13px] text-[#4a7c2f] hover:underline"
              >
                <Phone size={13} strokeWidth={1.5} aria-hidden />
                {kitchen.contact_phone}
              </a>
              <a
                href={`mailto:${kitchen.contact_email}`}
                className="flex items-center gap-2 font-jakarta text-[13px] text-[#4a7c2f] hover:underline"
              >
                <Mail size={13} strokeWidth={1.5} aria-hidden />
                {kitchen.contact_email}
              </a>
            </div>
          </div>
        ) : (
          !hasClaimed && (
            <div className="flex items-start gap-3 p-3.5 rounded-[10px] border border-[#e7e5e0] bg-[#f4f3f0]">
              <Mail size={14} strokeWidth={1.5} className="text-[#b8b4ae] flex-shrink-0 mt-0.5" aria-hidden />
              <p className="font-jakarta text-[12px] text-[#7d7870] leading-relaxed">
                Kitchen contact details are shared once you claim this pickup.
              </p>
            </div>
          )
        )}

        {/* Map placeholder */}
        <div className="rounded-[10px] border border-[#e7e5e0] bg-[#f4f3f0] h-[140px] flex flex-col items-center justify-center gap-2">
          <MapPin size={24} strokeWidth={1.5} className="text-[#b8b4ae]" aria-hidden />
          <p className="font-jakarta text-[12px] text-[#b8b4ae]">
            {kitchen?.location ?? offer.kitchen_name}
          </p>
        </div>
      </div>
    </Modal>
  );
}
