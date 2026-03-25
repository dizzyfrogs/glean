"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { CategoryGrid } from "./CategoryGrid";
import { PhotoUpload } from "./PhotoUpload";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { UNITS, MEAL_TYPES, TODAY } from "@/lib/constants";

const STAGE_OPTIONS = [
  { id: "over-prepared", label: "Overproduction" },
  { id: "spoilage", label: "Spoilage" },
  { id: "plate-waste", label: "Plate waste" },
  { id: "trim-waste", label: "Prep trim" },
  { id: "expired", label: "Expired" },
];

interface FormErrors {
  category?: string;
  item?: string;
  qty?: string;
  reason?: string;
  meal?: string;
}

export function WasteLogForm() {
  const addWasteLog = useStore((s) => s.addWasteLog);
  const currentUser = useStore((s) => s.currentUser);
  const { toast } = useToast();

  const [category, setCategory] = useState("");
  const [item, setItem] = useState("");
  const [qty, setQty] = useState("");
  const [unit, setUnit] = useState("lbs");
  const [reason, setReason] = useState("");
  const [meal, setMeal] = useState("");
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function clearError(field: keyof FormErrors) {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const next: FormErrors = {};
    if (!category) next.category = "Please select a category";
    if (!item.trim()) next.item = "Item name is required";
    if (!qty || isNaN(Number(qty)) || Number(qty) <= 0) next.qty = "Enter a valid amount";
    if (!reason) next.reason = "Please select a stage";
    if (!meal) next.meal = "Please select a meal";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));

    addWasteLog({
      date: TODAY,
      item: item.trim(),
      category,
      qty_lbs: Number(qty),
      unit,
      meal,
      reason,
      logged_by: currentUser?.name ?? "Staff",
      notes: notes.trim() || undefined,
      photo_url: photo ?? undefined,
    });

    toast(`Entry logged. Thanks, ${currentUser?.name ?? ""}!`, "success");

    // keep category selected for fast repeat logging
    setItem("");
    setQty("");
    setUnit("lbs");
    setReason("");
    setMeal("");
    setNotes("");
    setPhoto(null);
    setErrors({});
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <CategoryGrid
        value={category}
        onChange={(id) => {
          setCategory(id);
          clearError("category");
        }}
        error={errors.category}
      />

      <Input
        label="Item"
        placeholder="e.g. Pasta primavera"
        value={item}
        onChange={(e) => {
          setItem(e.target.value);
          clearError("item");
        }}
        error={errors.item}
      />

      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            label="Amount"
            type="number"
            min="0"
            step="0.1"
            placeholder="0"
            value={qty}
            onChange={(e) => {
              setQty(e.target.value);
              clearError("qty");
            }}
            error={errors.qty}
          />
        </div>
        <div className="w-36">
          <Select
            label="Unit"
            options={[...UNITS]}
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          />
        </div>
      </div>

      <Select
        label="Stage"
        placeholder="Select stage"
        options={STAGE_OPTIONS}
        value={reason}
        onChange={(e) => {
          setReason(e.target.value);
          clearError("reason");
        }}
        error={errors.reason}
      />

      <Select
        label="Meal"
        placeholder="Select meal"
        options={[...MEAL_TYPES]}
        value={meal}
        onChange={(e) => {
          setMeal(e.target.value);
          clearError("meal");
        }}
        error={errors.meal}
      />

      <Textarea
        label="Notes (optional)"
        placeholder="Any context that's helpful"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
      />

      <PhotoUpload value={photo} onChange={setPhoto} />

      <Button type="submit" loading={submitting} size="lg" className="w-full mt-1">
        Log waste entry
        {!submitting && <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />}
      </Button>
    </form>
  );
}
