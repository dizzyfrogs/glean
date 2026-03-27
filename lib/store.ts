"use client";

import { create } from "zustand";
import { WasteLog, SurplusOffer, Role, User } from "./types";
import { MOCK_WASTE_LOGS, MOCK_SURPLUS_OFFERS, KITCHENS, FOOD_BANKS } from "./mock-data";

interface GleanStore {
  // Auth / role
  currentRole: Role | null;
  currentUser: User | null;
  setRole: (role: Role) => void;
  clearRole: () => void;

  // Waste logs
  wasteLogs: WasteLog[];
  addWasteLog: (log: Omit<WasteLog, "id">) => void;
  updateWasteLog: (id: string, updates: Partial<WasteLog>) => void;
  deleteWasteLog: (id: string) => void;

  // Surplus offers
  surplusOffers: SurplusOffer[];
  addSurplusOffer: (offer: Omit<SurplusOffer, "id">) => void;
  updateSurplusOffer: (id: string, updates: Partial<SurplusOffer>) => void;
  claimSurplusOffer: (
    id: string,
    claimedBy: NonNullable<SurplusOffer["claimed_by"]>
  ) => void;
  completeSurplusOffer: (id: string) => void;
  deleteSurplusOffer: (id: string) => void;
}

const ROLE_USERS: Record<Role, User> = {
  staff: {
    name: "Jordan Kim",
    role: "staff",
    kitchen_id: "kitchen-a",
  },
  manager: {
    name: "Priya Nair",
    role: "manager",
    kitchen_id: "kitchen-a",
  },
  foodbank: {
    name: "Marcus Webb",
    role: "foodbank",
    foodbank_id: "fb-city",
  },
};

export const useStore = create<GleanStore>((set) => ({
  currentRole: null,
  currentUser: null,

  setRole: (role) =>
    set({ currentRole: role, currentUser: ROLE_USERS[role] }),

  clearRole: () => set({ currentRole: null, currentUser: null }),

  // Waste logs
  wasteLogs: MOCK_WASTE_LOGS,

  addWasteLog: (log) =>
    set((state) => ({
      wasteLogs: [
        { ...log, id: `wl-${Date.now()}` },
        ...state.wasteLogs,
      ],
    })),

  updateWasteLog: (id, updates) =>
    set((state) => ({
      wasteLogs: state.wasteLogs.map((l) =>
        l.id === id ? { ...l, ...updates } : l
      ),
    })),

  deleteWasteLog: (id) =>
    set((state) => ({
      wasteLogs: state.wasteLogs.filter((l) => l.id !== id),
    })),

  // Surplus offers
  surplusOffers: MOCK_SURPLUS_OFFERS,

  addSurplusOffer: (offer) =>
    set((state) => ({
      surplusOffers: [
        { ...offer, id: `so-${Date.now()}` },
        ...state.surplusOffers,
      ],
    })),

  updateSurplusOffer: (id, updates) =>
    set((state) => ({
      surplusOffers: state.surplusOffers.map((o) =>
        o.id === id ? { ...o, ...updates } : o
      ),
    })),

  claimSurplusOffer: (id, claimedBy) =>
    set((state) => ({
      surplusOffers: state.surplusOffers.map((o) =>
        o.id === id
          ? { ...o, status: "claimed", claimed_by: claimedBy }
          : o
      ),
    })),

  completeSurplusOffer: (id) =>
    set((state) => ({
      surplusOffers: state.surplusOffers.map((o) =>
        o.id === id
          ? { ...o, status: "completed", completed_at: new Date().toISOString() }
          : o
      ),
    })),

  deleteSurplusOffer: (id) =>
    set((state) => ({
      surplusOffers: state.surplusOffers.filter((o) => o.id !== id),
    })),
}));

export { KITCHENS, FOOD_BANKS };
