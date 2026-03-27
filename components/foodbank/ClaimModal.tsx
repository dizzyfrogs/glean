"use client";

import { useState } from "react";
import { MapPin, Phone, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useStore, FOOD_BANKS } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { SurplusOffer } from "@/lib/types";

function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
}

interface FormState {
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  notes: string;
}

interface Errors {
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
}

interface Props {
  offer: SurplusOffer | null;
  onClose: () => void;
}

export default function ClaimModal({ offer, onClose }: Props) {
  const currentUser = useStore((s) => s.currentUser);
  const claimSurplusOffer = useStore((s) => s.claimSurplusOffer);
  const { toast } = useToast();

  const myFoodBank = FOOD_BANKS.find((fb) => fb.id === currentUser?.foodbank_id);

  const [form, setForm] = useState<FormState>({
    contact_name: myFoodBank?.contact_name ?? "",
    contact_phone: myFoodBank?.contact_phone ?? "",
    contact_email: myFoodBank?.contact_email ?? "",
    notes: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  function field<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key in errors) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const errs: Errors = {};
    if (!form.contact_name.trim()) errs.contact_name = "Your name is required.";
    if (!form.contact_phone.trim()) errs.contact_phone = "Phone number is required.";
    if (!form.contact_email.trim()) errs.contact_email = "Email address is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleConfirm() {
    if (!offer || !validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));

    claimSurplusOffer(offer.id, {
      org_name: myFoodBank?.name ?? form.contact_name,
      contact_name: form.contact_name,
      contact_phone: form.contact_phone,
      contact_email: form.contact_email,
      claimed_at: new Date().toISOString(),
      ...(form.notes.trim() ? { note_to_kitchen: form.notes.trim() } : {}),
    });

    toast("Pickup claimed! The kitchen has been notified.", "success");
    setSubmitting(false);
    onClose();
  }

  function handleClose() {
    if (submitting) return;
    onClose();
  }

  if (!offer) return null;

  const hasPhoneInstructions =
    offer.pickup_instructions.toLowerCase().includes("call") ||
    offer.pickup_instructions.toLowerCase().includes("phone");

  return (
    <Modal open={!!offer} onClose={handleClose} title="Confirm pickup claim" width="max-w-lg">
      <div className="space-y-5">
        {/* Offer summary */}
        <div className="bg-[#f4f3f0] rounded-[10px] p-4 space-y-1">
          <p className="font-fraunces text-[16px] font-[500] text-[#1a1916]">{offer.item}</p>
          <p className="font-jakarta text-[13px] text-[#5c5851]">
            {offer.qty} {offer.unit}
            {offer.qty_portions != null ? ` · ${offer.qty_portions} portions` : ""}
          </p>
          <p className="font-jakarta text-[13px] text-[#5c5851]">
            {offer.kitchen_name} · Pickup {formatTime(offer.pickup_from)} to {formatTime(offer.pickup_by)}
          </p>
        </div>

        {/* Pickup instructions */}
        <div>
          <p className="font-jakarta text-[13px] font-semibold text-[#1a1916] mb-2">
            Pickup instructions
          </p>
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
        </div>

        {/* Kitchen contact, shown only after confirming */}
        <div className="flex items-start gap-3 p-3.5 rounded-[10px] border border-[#e7e5e0] bg-[#f4f3f0]">
          <MapPin size={14} strokeWidth={1.5} className="text-[#b8b4ae] flex-shrink-0 mt-0.5" aria-hidden />
          <p className="font-jakarta text-[12px] text-[#7d7870] leading-relaxed">
            Kitchen contact details will be shared once you confirm this claim.
          </p>
        </div>

        <hr className="border-[#e7e5e0]" />

        {/* Food bank contact fields */}
        <div>
          <p className="font-jakarta text-[13px] font-semibold text-[#1a1916] mb-3">
            Your contact details
          </p>
          <div className="space-y-4">
            <div>
              <label htmlFor="claim-name" className="block font-jakarta text-[13px] font-semibold text-[#1a1916] mb-1.5">
                Your name <span className="text-[#c73a2a]" aria-hidden>*</span>
              </label>
              <input
                id="claim-name"
                type="text"
                value={form.contact_name}
                onChange={(e) => field("contact_name", e.target.value)}
                className={`w-full h-[44px] px-3 rounded-[10px] border-[1.5px] font-jakarta text-[13px] text-[#1a1916] outline-none transition-all duration-150 ${
                  errors.contact_name
                    ? "border-[#c73a2a] focus:shadow-[0_0_0_3px_rgba(199,58,42,0.15)]"
                    : "border-[#e7e5e0] focus:border-[#4a7c2f] focus:shadow-[0_0_0_3px_rgba(74,124,47,0.15)]"
                }`}
                aria-describedby={errors.contact_name ? "claim-name-err" : undefined}
              />
              {errors.contact_name && (
                <p id="claim-name-err" className="mt-1 font-jakarta text-[12px] text-[#c73a2a]">
                  {errors.contact_name}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="claim-phone" className="block font-jakarta text-[13px] font-semibold text-[#1a1916] mb-1.5">
                  Your phone <span className="text-[#c73a2a]" aria-hidden>*</span>
                </label>
                <input
                  id="claim-phone"
                  type="tel"
                  value={form.contact_phone}
                  onChange={(e) => field("contact_phone", e.target.value)}
                  className={`w-full h-[44px] px-3 rounded-[10px] border-[1.5px] font-jakarta text-[13px] text-[#1a1916] outline-none transition-all duration-150 ${
                    errors.contact_phone
                      ? "border-[#c73a2a] focus:shadow-[0_0_0_3px_rgba(199,58,42,0.15)]"
                      : "border-[#e7e5e0] focus:border-[#4a7c2f] focus:shadow-[0_0_0_3px_rgba(74,124,47,0.15)]"
                  }`}
                  aria-describedby={errors.contact_phone ? "claim-phone-err" : undefined}
                />
                {errors.contact_phone && (
                  <p id="claim-phone-err" className="mt-1 font-jakarta text-[12px] text-[#c73a2a]">
                    {errors.contact_phone}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="claim-email" className="block font-jakarta text-[13px] font-semibold text-[#1a1916] mb-1.5">
                  Your email <span className="text-[#c73a2a]" aria-hidden>*</span>
                </label>
                <input
                  id="claim-email"
                  type="email"
                  value={form.contact_email}
                  onChange={(e) => field("contact_email", e.target.value)}
                  className={`w-full h-[44px] px-3 rounded-[10px] border-[1.5px] font-jakarta text-[13px] text-[#1a1916] outline-none transition-all duration-150 ${
                    errors.contact_email
                      ? "border-[#c73a2a] focus:shadow-[0_0_0_3px_rgba(199,58,42,0.15)]"
                      : "border-[#e7e5e0] focus:border-[#4a7c2f] focus:shadow-[0_0_0_3px_rgba(74,124,47,0.15)]"
                  }`}
                  aria-describedby={errors.contact_email ? "claim-email-err" : undefined}
                />
                {errors.contact_email && (
                  <p id="claim-email-err" className="mt-1 font-jakarta text-[12px] text-[#c73a2a]">
                    {errors.contact_email}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="claim-notes" className="block font-jakarta text-[13px] font-semibold text-[#1a1916] mb-1.5">
                Notes to kitchen
                <span className="font-normal text-[#7d7870] ml-1">(optional)</span>
              </label>
              <textarea
                id="claim-notes"
                value={form.notes}
                onChange={(e) => field("notes", e.target.value)}
                placeholder="Any notes for the kitchen?"
                rows={2}
                className="w-full px-3 py-2.5 rounded-[10px] border-[1.5px] border-[#e7e5e0] font-jakarta text-[13px] text-[#1a1916] placeholder:text-[#b8b4ae] outline-none focus:border-[#4a7c2f] focus:shadow-[0_0_0_3px_rgba(74,124,47,0.15)] transition-all duration-150 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={handleClose}
            disabled={submitting}
            className="flex-1 h-[48px] rounded-[10px] border border-[#e7e5e0] bg-white font-jakarta text-[14px] font-semibold text-[#5c5851] hover:bg-[#f4f3f0] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="flex-1 h-[48px] rounded-[10px] bg-[#4a7c2f] text-white font-jakarta text-[14px] font-semibold shadow-[0_2px_8px_rgba(74,124,47,0.3)] hover:bg-[#3d6827] hover:-translate-y-0.5 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 size={16} strokeWidth={1.5} className="animate-spin" aria-hidden />
                Confirming...
              </>
            ) : (
              "Confirm claim"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
