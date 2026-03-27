export interface WasteLog {
  id: string;
  date: string; // ISO date string
  item: string;
  category: string;
  qty_lbs: number;
  unit: string;
  meal: string;
  reason: string;
  logged_by: string;
  notes?: string;
  photo_url?: string;
}

export interface SurplusOffer {
  id: string;
  kitchen_name: string;
  kitchen_id: string;
  item: string;
  qty: number;
  unit: string;
  qty_portions?: number;
  food_type: "hot" | "cold" | "produce" | "bakery" | "other";
  photo_url?: string;
  pickup_instructions: string;
  pickup_contact?: string;
  pickup_from: string; // "14:00"
  pickup_by: string;   // "16:00"
  notes?: string;
  status: "available" | "pending" | "claimed" | "completed";
  completed_at?: string;
  claimed_by?: {
    org_name: string;
    contact_name: string;
    contact_phone: string;
    contact_email: string;
    claimed_at: string;
    note_to_kitchen?: string;
  };
}

export interface Kitchen {
  id: string;
  name: string;
  location: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  default_pickup_instructions: string;
  lat: number;
  lng: number;
}

export interface FoodBank {
  id: string;
  name: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  distance_mi: number;
  lat: number;
  lng: number;
}

export type Role = "staff" | "manager" | "foodbank";

export interface User {
  name: string;
  role: Role;
  kitchen_id?: string;
  foodbank_id?: string;
}
