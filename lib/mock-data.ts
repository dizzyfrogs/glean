import { WasteLog, SurplusOffer, Kitchen, FoodBank } from "./types";

// all dates are relative to (2026-03-25)
function daysAgo(n: number): string {
  const d = new Date("2026-03-25");
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

export const KITCHENS: Kitchen[] = [
  {
    id: "kitchen-a",
    name: "Main Dining Kitchen",
    location: "Dining Hall A, Ground Floor",
    contact_name: "Priya Nair",
    contact_phone: "(555) 201-4892",
    contact_email: "priya.nair@university.edu",
    default_pickup_instructions: "Please call 15 minutes before pickup",
    lat: 37.872,
    lng: -122.260,
  },
  {
    id: "kitchen-b",
    name: "Campus Center Kitchen",
    location: "Campus Center, Level B1",
    contact_name: "Chef Daniels",
    contact_phone: "(555) 201-3371",
    contact_email: "kitchen@campuscenter.edu",
    default_pickup_instructions:
      "Walk to the rear loading dock and ask for Priya",
    lat: 37.874,
    lng: -122.261,
  },
];

export const FOOD_BANKS: FoodBank[] = [
  {
    id: "fb-city",
    name: "City Food Bank",
    contact_name: "Marcus Webb",
    contact_phone: "(555) 847-2201",
    contact_email: "marcus.webb@cityfoodbank.org",
    distance_mi: 1.4,
    lat: 37.865,
    lng: -122.252,
  },
  {
    id: "fb-community",
    name: "Eastside Community Pantry",
    contact_name: "Sandra Torres",
    contact_phone: "(555) 634-9910",
    contact_email: "sandra@eastsidepantry.org",
    distance_mi: 3.2,
    lat: 37.900,
    lng: -122.300,
  },
];

// 30 days of logs with some obvious patterns baked in:
// protein over-prepped on Tuesdays, salad bar spikes Thu-Fri, bakery every day
function buildWasteLogs(): WasteLog[] {
  const logs: WasteLog[] = [];
  let id = 1;

  for (let day = 29; day >= 0; day--) {
    const date = daysAgo(day);
    const jsDate = new Date(date);
    const dow = jsDate.getDay(); // 0=Sun, 2=Tue, 4=Thu, 5=Fri

    // Bakery waste every day
    logs.push({
      id: `wl-${id++}`,
      date,
      item: "Assorted dinner rolls",
      category: "bakery",
      qty_lbs: Math.round((2.5 + Math.random() * 2) * 10) / 10,
      unit: "lbs",
      meal: "dinner",
      reason: "over-prepared",
      logged_by: "Jordan Kim",
      notes: "Rolls go stale fast, ordered same qty as last week",
    });

    // Protein spikes on Tuesdays (dow=2)
    if (dow === 2) {
      logs.push({
        id: `wl-${id++}`,
        date,
        item: "Roasted chicken breast",
        category: "protein",
        qty_lbs: Math.round((14 + Math.random() * 8) * 10) / 10,
        unit: "lbs",
        meal: "lunch",
        reason: "over-prepared",
        logged_by: "Jordan Kim",
        notes: "Tuesday lunch always runs low turnout",
      });
      logs.push({
        id: `wl-${id++}`,
        date,
        item: "Ground beef patties",
        category: "protein",
        qty_lbs: Math.round((8 + Math.random() * 4) * 10) / 10,
        unit: "lbs",
        meal: "dinner",
        reason: "over-prepared",
        logged_by: "Jordan Kim",
      });
    }

    // Salad bar spikes Thu-Fri (dow=4,5)
    if (dow === 4 || dow === 5) {
      logs.push({
        id: `wl-${id++}`,
        date,
        item: "Mixed greens & romaine",
        category: "salad-bar",
        qty_lbs: Math.round((6 + Math.random() * 5) * 10) / 10,
        unit: "lbs",
        meal: "lunch",
        reason: "spoilage",
        logged_by: "Jordan Kim",
        notes: "Thu-Fri lower dining hall traffic",
      });
      logs.push({
        id: `wl-${id++}`,
        date,
        item: "Sliced vegetables (cucumber, peppers)",
        category: "salad-bar",
        qty_lbs: Math.round((3.5 + Math.random() * 2.5) * 10) / 10,
        unit: "lbs",
        meal: "lunch",
        reason: "spoilage",
        logged_by: "Jordan Kim",
      });
    }

    // Misc produce waste mid-week
    if (dow === 1 || dow === 3) {
      logs.push({
        id: `wl-${id++}`,
        date,
        item: "Broccoli florets",
        category: "produce",
        qty_lbs: Math.round((2 + Math.random() * 3) * 10) / 10,
        unit: "lbs",
        meal: "dinner",
        reason: "trim-waste",
        logged_by: "Jordan Kim",
      });
    }

    // Occasional dairy / grain waste
    if (day % 5 === 0) {
      logs.push({
        id: `wl-${id++}`,
        date,
        item: "Cooked white rice",
        category: "grains",
        qty_lbs: Math.round((5 + Math.random() * 4) * 10) / 10,
        unit: "lbs",
        meal: "dinner",
        reason: "over-prepared",
        logged_by: "Jordan Kim",
      });
    }
    if (day % 7 === 0) {
      logs.push({
        id: `wl-${id++}`,
        date,
        item: "Whole milk",
        category: "dairy",
        qty_lbs: Math.round((3 + Math.random() * 2) * 10) / 10,
        unit: "lbs",
        meal: "breakfast",
        reason: "spoilage",
        logged_by: "Jordan Kim",
        notes: "Near expiry, didn't open new carton in time",
      });
    }
  }

  return logs;
}

export const MOCK_WASTE_LOGS: WasteLog[] = buildWasteLogs();

export const MOCK_SURPLUS_OFFERS: SurplusOffer[] = [
  {
    id: "so-001",
    kitchen_name: "Main Dining Kitchen",
    kitchen_id: "kitchen-a",
    item: "Roasted chicken breast",
    qty: 18,
    unit: "lbs",
    qty_portions: 36,
    food_type: "hot",
    pickup_instructions: "Please call 15 minutes before pickup",
    pickup_contact: "(555) 201-4892",
    pickup_from: "14:00",
    pickup_by: "16:30",
    notes: "Lightly seasoned, no allergens beyond possible cross-contact",
    status: "available",
  },
  {
    id: "so-002",
    kitchen_name: "Main Dining Kitchen",
    kitchen_id: "kitchen-a",
    item: "Mixed green salad (undressed)",
    qty: 12,
    unit: "lbs",
    food_type: "cold",
    pickup_instructions: "Please call 15 minutes before pickup",
    pickup_from: "13:30",
    pickup_by: "15:00",
    status: "available",
  },
  {
    id: "so-003",
    kitchen_name: "Campus Center Kitchen",
    kitchen_id: "kitchen-b",
    item: "Assorted dinner rolls",
    qty: 8,
    unit: "lbs",
    qty_portions: 64,
    food_type: "bakery",
    pickup_instructions: "Walk to the rear loading dock and ask for Priya",
    pickup_from: "15:00",
    pickup_by: "17:00",
    notes: "Plain and seeded varieties, baked this morning",
    status: "claimed",
    claimed_by: {
      org_name: "City Food Bank",
      contact_name: "Marcus Webb",
      contact_phone: "(555) 847-2201",
      contact_email: "marcus.webb@cityfoodbank.org",
      claimed_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    },
  },
  {
    id: "so-004",
    kitchen_name: "Main Dining Kitchen",
    kitchen_id: "kitchen-a",
    item: "Fresh fruit tray (apples, oranges, bananas)",
    qty: 22,
    unit: "lbs",
    food_type: "produce",
    pickup_instructions: "Please call 15 minutes before pickup",
    pickup_contact: "(555) 201-4892",
    pickup_from: "11:00",
    pickup_by: "13:00",
    notes: "Whole fruit, no cutting. Good for another 3-4 days.",
    status: "claimed",
    claimed_by: {
      org_name: "Eastside Community Pantry",
      contact_name: "Sandra Torres",
      contact_phone: "(555) 634-9910",
      contact_email: "sandra@eastsidepantry.org",
      claimed_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    },
  },
  {
    id: "so-005",
    kitchen_name: "Campus Center Kitchen",
    kitchen_id: "kitchen-b",
    item: "Pasta with marinara sauce",
    qty: 14,
    unit: "lbs",
    qty_portions: 18,
    food_type: "hot",
    pickup_instructions: "Walk to the rear loading dock and ask for Priya",
    pickup_from: "13:00",
    pickup_by: "14:30",
    notes: "Contains gluten. Vegetarian.",
    status: "claimed",
    claimed_by: {
      org_name: "City Food Bank",
      contact_name: "Marcus Webb",
      contact_phone: "(555) 847-2201",
      contact_email: "marcus.webb@cityfoodbank.org",
      claimed_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
  },
];
