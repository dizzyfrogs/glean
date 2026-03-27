"use client";

import { useState, useEffect } from "react";
import { Flame, Snowflake, Leaf, Croissant, Package, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { PhotoUpload } from "@/components/staff/PhotoUpload";
import { useStore, KITCHENS } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { SurplusOffer } from "@/lib/types";

const FOOD_TYPES = [
  { id: "hot" as const, label: "Hot", Icon: Flame },
  { id: "cold" as const, label: "Cold", Icon: Snowflake },
  { id: "produce" as const, label: "Produce", Icon: Leaf },
  { id: "bakery" as const, label: "Bakery", Icon: Croissant },
  { id: "other" as const, label: "Other", Icon: Package },
];

const UNITS = ["lbs", "kg", "portions", "trays", "gallons", "oz"];

type FoodType = "hot" | "cold" | "produce" | "bakery" | "other";

interface FormState {
  item: string;
  qty: string;
  unit: string;
  qty_portions: string;
  food_type: FoodType | "";
  photo_url: string | null;
  pickup_from: string;
  pickup_by: string;
  pickup_instructions: string;
  pickup_contact: string;
  contact_email: string;
  notes: string;
}

interface Errors {
  item?: string;
  qty?: string;
  food_type?: string;
  photo_url?: string;
  pickup_from?: string;
  pickup_by?: string;
}

const kitchen = KITCHENS[0];

const INITIAL: FormState = {
  item: "",
  qty: "",
  unit: "lbs",
  qty_portions: "",
  food_type: "",
  photo_url: null,
  pickup_from: "",
  pickup_by: "",
  pickup_instructions: kitchen.default_pickup_instructions,
  pickup_contact: kitchen.contact_phone,
  contact_email: kitchen.contact_email,
  notes: "",
};

interface Props {
  open: boolean;
  onClose: () => void;
  editOffer?: SurplusOffer;
}

export default function BroadcastModal({ open, onClose, editOffer }: Props) {
  const addSurplusOffer = useStore((s) => s.addSurplusOffer);
  const updateSurplusOffer = useStore((s) => s.updateSurplusOffer);
  const { toast } = useToast();

  const initialForm: FormState = editOffer
    ? {
        item: editOffer.item,
        qty: String(editOffer.qty),
        unit: editOffer.unit,
        qty_portions: editOffer.qty_portions != null ? String(editOffer.qty_portions) : "",
        food_type: editOffer.food_type,
        photo_url: editOffer.photo_url ?? null,
        pickup_from: editOffer.pickup_from,
        pickup_by: editOffer.pickup_by,
        pickup_instructions: editOffer.pickup_instructions,
        pickup_contact: editOffer.pickup_contact ?? "",
        contact_email: editOffer.pickup_contact ?? kitchen.contact_email,
        notes: editOffer.notes ?? "",
      }
    : INITIAL;

  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        editOffer
          ? {
              item: editOffer.item,
              qty: String(editOffer.qty),
              unit: editOffer.unit,
              qty_portions: editOffer.qty_portions != null ? String(editOffer.qty_portions) : "",
              food_type: editOffer.food_type,
              photo_url: editOffer.photo_url ?? null,
              pickup_from: editOffer.pickup_from,
              pickup_by: editOffer.pickup_by,
              pickup_instructions: editOffer.pickup_instructions,
              pickup_contact: editOffer.pickup_contact ?? "",
              contact_email: editOffer.pickup_contact ?? kitchen.contact_email,
              notes: editOffer.notes ?? "",
            }
          : INITIAL
      );
      setErrors({});
    }
  }, [open, editOffer]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key in errors) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const errs: Errors = {};
    if (!form.item.trim()) errs.item = "Item name is required.";
    const qtyNum = parseFloat(form.qty);
    if (!form.qty || isNaN(qtyNum) || qtyNum <= 0) errs.qty = "Enter a valid quantity.";
    if (!form.food_type) errs.food_type = "Select a food type.";
    if (!form.pickup_from) errs.pickup_from = "Pickup start time is required.";
    if (!form.pickup_by) errs.pickup_by = "Pickup end time is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));

    const payload = {
      item: form.item.trim(),
      qty: parseFloat(form.qty),
      unit: form.unit,
      qty_portions: form.qty_portions ? parseInt(form.qty_portions) : undefined,
      food_type: form.food_type as FoodType,
      photo_url: form.photo_url ?? undefined,
      pickup_instructions: form.pickup_instructions,
      pickup_contact: form.pickup_contact || undefined,
      pickup_from: form.pickup_from,
      pickup_by: form.pickup_by,
      notes: form.notes || undefined,
    };

    if (editOffer) {
      updateSurplusOffer(editOffer.id, payload);
      toast("Offer updated.", "success");
    } else {
      addSurplusOffer({
        ...payload,
        kitchen_name: kitchen.name,
        kitchen_id: kitchen.id,
        status: "available",
      });
      toast("Surplus offer broadcast to food banks.", "success");
    }

    setSubmitting(false);
    setForm(INITIAL);
    setErrors({});
    onClose();
  }

  function handleClose() {
    if (submitting) return;
    onClose();
    setForm(INITIAL);
    setErrors({});
  }

  return (
    <Modal open={open} onClose={handleClose} title={editOffer ? "Edit Offer" : "Broadcast Surplus"} width="max-w-xl">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Item name */}
        <div>
          <label htmlFor="bc-item" className="block font-jakarta text-[13px] font-semibold text-[#1a1916] mb-1.5">
            Item name <span className="text-[#c73a2a]" aria-hidden>*</span>
          </label>
          <input
            id="bc-item"
            type="text"
            value={form.item}
            onChange={(e) => set("item", e.target.value)}
            placeholder="e.g. Roasted chicken breast"
            className={`w-full h-[44px] px-3 rounded-[10px] border-[1.5px] font-jakarta text-[13px] text-[#1a1916] placeholder:text-[#b8b4ae] outline-none transition-all duration-150 ${
              errors.item
                ? "border-[#c73a2a] focus:shadow-[0_0_0_3px_rgba(199,58,42,0.15)]"
                : "border-[#e7e5e0] focus:border-[#4a7c2f] focus:shadow-[0_0_0_3px_rgba(74,124,47,0.15)]"
            }`}
            aria-describedby={errors.item ? "bc-item-err" : undefined}
          />
          {errors.item && (
            <p id="bc-item-err" className="mt-1 font-jakarta text-[12px] text-[#c73a2a]">
              {errors.item}
            </p>
          )}
        </div>

        {/* Qty + Unit */}
        <div>
          <label className="block font-jakarta text-[13px] font-semibold text-[#1a1916] mb-1.5">
            Quantity <span className="text-[#c73a2a]" aria-hidden>*</span>
          </label>
          <div className="flex gap-2">
            <input
              id="bc-qty"
              type="number"
              min="0.1"
              step="0.1"
              value={form.qty}
              onChange={(e) => set("qty", e.target.value)}
              placeholder="0"
              className={`flex-1 h-[44px] px-3 rounded-[10px] border-[1.5px] font-jakarta text-[13px] text-[#1a1916] placeholder:text-[#b8b4ae] outline-none transition-all duration-150 ${
                errors.qty
                  ? "border-[#c73a2a] focus:shadow-[0_0_0_3px_rgba(199,58,42,0.15)]"
                  : "border-[#e7e5e0] focus:border-[#4a7c2f] focus:shadow-[0_0_0_3px_rgba(74,124,47,0.15)]"
              }`}
              aria-label="Quantity amount"
            />
            <select
              value={form.unit}
              onChange={(e) => set("unit", e.target.value)}
              className="h-[44px] px-3 rounded-[10px] border-[1.5px] border-[#e7e5e0] font-jakarta text-[13px] text-[#1a1916] outline-none focus:border-[#4a7c2f] focus:shadow-[0_0_0_3px_rgba(74,124,47,0.15)] transition-all duration-150 bg-white"
              aria-label="Unit"
            >
              {UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
          {errors.qty && (
            <p className="mt-1 font-jakarta text-[12px] text-[#c73a2a]">{errors.qty}</p>
          )}
        </div>

        {/* Estimated portions */}
        <div>
          <label htmlFor="bc-portions" className="block font-jakarta text-[13px] font-semibold text-[#1a1916] mb-1.5">
            Estimated portions
            <span className="font-normal text-[#7d7870] ml-1">(optional)</span>
          </label>
          <input
            id="bc-portions"
            type="number"
            min="1"
            step="1"
            value={form.qty_portions}
            onChange={(e) => set("qty_portions", e.target.value)}
            placeholder="e.g. 36"
            className="w-full h-[44px] px-3 rounded-[10px] border-[1.5px] border-[#e7e5e0] font-jakarta text-[13px] text-[#1a1916] placeholder:text-[#b8b4ae] outline-none focus:border-[#4a7c2f] focus:shadow-[0_0_0_3px_rgba(74,124,47,0.15)] transition-all duration-150"
          />
        </div>

        {/* Food type */}
        <div>
          <p className="font-jakarta text-[13px] font-semibold text-[#1a1916] mb-1.5">
            Food type <span className="text-[#c73a2a]" aria-hidden>*</span>
          </p>
          <div className="flex gap-2 flex-wrap" role="group" aria-label="Food type">
            {FOOD_TYPES.map(({ id, label, Icon }) => {
              const selected = form.food_type === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => set("food_type", id)}
                  className={`flex items-center gap-1.5 px-3 h-[44px] rounded-[10px] border-[1.5px] font-jakarta text-[13px] font-semibold transition-all duration-150 ${
                    selected
                      ? "border-[#4a7c2f] bg-[#f2f7ee] text-[#4a7c2f]"
                      : "border-[#e7e5e0] bg-white text-[#5c5851] hover:border-[#c9d9be] hover:bg-[#f8faf5]"
                  }`}
                  aria-pressed={selected}
                >
                  <Icon size={14} strokeWidth={1.5} aria-hidden />
                  {label}
                </button>
              );
            })}
          </div>
          {errors.food_type && (
            <p className="mt-1 font-jakarta text-[12px] text-[#c73a2a]">{errors.food_type}</p>
          )}
        </div>

        {/* Photo */}
        <PhotoUpload
          value={form.photo_url}
          onChange={(url) => set("photo_url", url)}
          optional
          helperText="Helps food banks know what to expect"
        />

        {/* Pickup window */}
        <div>
          <p className="font-jakarta text-[13px] font-semibold text-[#1a1916] mb-1.5">
            Pickup window <span className="text-[#c73a2a]" aria-hidden>*</span>
          </p>
          <div className="flex gap-3">
            <div className="flex-1">
              <label htmlFor="bc-from" className="block font-jakarta text-[12px] text-[#7d7870] mb-1">
                From
              </label>
              <input
                id="bc-from"
                type="time"
                value={form.pickup_from}
                onChange={(e) => set("pickup_from", e.target.value)}
                className={`w-full h-[44px] px-3 rounded-[10px] border-[1.5px] font-jakarta text-[13px] text-[#1a1916] outline-none transition-all duration-150 ${
                  errors.pickup_from
                    ? "border-[#c73a2a] focus:shadow-[0_0_0_3px_rgba(199,58,42,0.15)]"
                    : "border-[#e7e5e0] focus:border-[#4a7c2f] focus:shadow-[0_0_0_3px_rgba(74,124,47,0.15)]"
                }`}
              />
              {errors.pickup_from && (
                <p className="mt-1 font-jakarta text-[12px] text-[#c73a2a]">{errors.pickup_from}</p>
              )}
            </div>
            <div className="flex-1">
              <label htmlFor="bc-by" className="block font-jakarta text-[12px] text-[#7d7870] mb-1">
                By
              </label>
              <input
                id="bc-by"
                type="time"
                value={form.pickup_by}
                onChange={(e) => set("pickup_by", e.target.value)}
                className={`w-full h-[44px] px-3 rounded-[10px] border-[1.5px] font-jakarta text-[13px] text-[#1a1916] outline-none transition-all duration-150 ${
                  errors.pickup_by
                    ? "border-[#c73a2a] focus:shadow-[0_0_0_3px_rgba(199,58,42,0.15)]"
                    : "border-[#e7e5e0] focus:border-[#4a7c2f] focus:shadow-[0_0_0_3px_rgba(74,124,47,0.15)]"
                }`}
              />
              {errors.pickup_by && (
                <p className="mt-1 font-jakarta text-[12px] text-[#c73a2a]">{errors.pickup_by}</p>
              )}
            </div>
          </div>
        </div>

        {/* Pickup instructions */}
        <div>
          <label htmlFor="bc-instructions" className="block font-jakarta text-[13px] font-semibold text-[#1a1916] mb-1.5">
            How should food banks collect this?
          </label>
          <p className="font-jakarta text-[12px] text-[#7d7870] mb-2">
            This is shown to food banks when they claim the offer.
          </p>
          <textarea
            id="bc-instructions"
            value={form.pickup_instructions}
            onChange={(e) => set("pickup_instructions", e.target.value)}
            rows={3}
            className="w-full px-3 py-2.5 rounded-[10px] border-[1.5px] border-[#e7e5e0] font-jakarta text-[13px] text-[#1a1916] placeholder:text-[#b8b4ae] outline-none focus:border-[#4a7c2f] focus:shadow-[0_0_0_3px_rgba(74,124,47,0.15)] transition-all duration-150 resize-none"
          />
        </div>

        {/* Contact */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="bc-phone" className="block font-jakarta text-[13px] font-semibold text-[#1a1916] mb-1.5">
              Contact phone
            </label>
            <input
              id="bc-phone"
              type="tel"
              value={form.pickup_contact}
              onChange={(e) => set("pickup_contact", e.target.value)}
              className="w-full h-[44px] px-3 rounded-[10px] border-[1.5px] border-[#e7e5e0] font-jakarta text-[13px] text-[#1a1916] placeholder:text-[#b8b4ae] outline-none focus:border-[#4a7c2f] focus:shadow-[0_0_0_3px_rgba(74,124,47,0.15)] transition-all duration-150"
            />
          </div>
          <div>
            <label htmlFor="bc-email" className="block font-jakarta text-[13px] font-semibold text-[#1a1916] mb-1.5">
              Contact email
            </label>
            <input
              id="bc-email"
              type="email"
              value={form.contact_email}
              onChange={(e) => set("contact_email", e.target.value)}
              className="w-full h-[44px] px-3 rounded-[10px] border-[1.5px] border-[#e7e5e0] font-jakarta text-[13px] text-[#1a1916] placeholder:text-[#b8b4ae] outline-none focus:border-[#4a7c2f] focus:shadow-[0_0_0_3px_rgba(74,124,47,0.15)] transition-all duration-150"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="bc-notes" className="block font-jakarta text-[13px] font-semibold text-[#1a1916] mb-1.5">
            Notes
            <span className="font-normal text-[#7d7870] ml-1">(optional)</span>
          </label>
          <textarea
            id="bc-notes"
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Allergens, storage tips, etc."
            rows={2}
            className="w-full px-3 py-2.5 rounded-[10px] border-[1.5px] border-[#e7e5e0] font-jakarta text-[13px] text-[#1a1916] placeholder:text-[#b8b4ae] outline-none focus:border-[#4a7c2f] focus:shadow-[0_0_0_3px_rgba(74,124,47,0.15)] transition-all duration-150 resize-none"
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full h-[48px] rounded-[10px] bg-[#4a7c2f] text-white font-jakarta text-[14px] font-semibold shadow-[0_2px_8px_rgba(74,124,47,0.3)] hover:bg-[#3d6827] hover:-translate-y-0.5 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 size={16} strokeWidth={1.5} className="animate-spin" aria-hidden />
                Broadcasting...
              </>
            ) : editOffer ? (
              "Save changes"
            ) : (
              "Broadcast surplus offer"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
