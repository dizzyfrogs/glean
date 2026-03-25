export const WASTE_CATEGORIES = [
  { id: "protein", label: "Protein", icon: "Drumstick", color: "#e84c3b" },
  { id: "produce", label: "Produce", icon: "Leaf", color: "#4a7c2f" },
  { id: "grains", label: "Grains & Starches", icon: "Wheat", color: "#d97706" },
  { id: "dairy", label: "Dairy", icon: "Milk", color: "#60a5fa" },
  { id: "bakery", label: "Bakery", icon: "Cookie", color: "#f59e0b" },
  { id: "salad-bar", label: "Salad Bar", icon: "Salad", color: "#7aaf52" },
  { id: "beverages", label: "Beverages", icon: "Coffee", color: "#5c5851" },
  { id: "desserts", label: "Desserts", icon: "IceCream", color: "#ffa08f" },
  { id: "other", label: "Other", icon: "Package", color: "#d4d1ca" },
] as const;

export const UNITS = [
  { id: "lbs", label: "Pounds (lbs)" },
  { id: "kg", label: "Kilograms (kg)" },
  { id: "portions", label: "Portions" },
  { id: "trays", label: "Trays" },
  { id: "gallons", label: "Gallons" },
  { id: "oz", label: "Ounces (oz)" },
] as const;

export const MEAL_TYPES = [
  { id: "breakfast", label: "Breakfast" },
  { id: "lunch", label: "Lunch" },
  { id: "dinner", label: "Dinner" },
  { id: "brunch", label: "Brunch" },
  { id: "late-night", label: "Late Night" },
  { id: "catering", label: "Catering / Event" },
] as const;

export const WASTE_REASONS = [
  { id: "over-prepared", label: "Over-prepared" },
  { id: "spoilage", label: "Spoilage / Expired" },
  { id: "plate-waste", label: "Plate Waste" },
  { id: "trim-waste", label: "Trim / Prep Waste" },
  { id: "contamination", label: "Contamination" },
  { id: "event-cancelled", label: "Event Cancelled" },
  { id: "equipment-failure", label: "Equipment Failure" },
  { id: "menu-change", label: "Menu Change" },
  { id: "other", label: "Other" },
] as const;

export const COST_PER_LB = 3.0;
export const CO2_MULTIPLIER = 1.5; // lbs CO2 per lb food waste
