import { useSyncExternalStore } from "react";
import { type Donor } from "@/data/mock";
import api from "../lib/axios";

export type { Donor } from "@/data/mock";

const STORAGE_KEY = "sengodai_donors_v1";

async function fetchDonors() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await api.get('/users');
    if (res.data.success) {
      const mapped = res.data.data
        .filter((u: any) => u.role !== 'admin' && u.status === 'Approved')
        .map((u: any) => ({
          id: u._id,
          name: u.name,
          bloodGroup: u.bloodGroup,
          distance: "Contact for location",
          available: u.isAvailableForDonation !== false,
          phone: u.phone,
          location: u.location,
          age: 30,
          gender: "Not specified",
          lastDonation: u.lastDonationDate ? new Date(u.lastDonationDate).toLocaleDateString() : "Never",
          weight: "Unknown",
          occupation: "Volunteer",
          email: u.email,
          address: u.location,
        }));
      state = mapped;
      persist();
    }
  } catch (err: any) {
    if (err?.response?.status !== 401) {
      console.error("Failed to fetch donors", err);
    }
  }
}

function load(): Donor[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Donor[];
  } catch {
    return [];
  }
}

let state: Donor[] = load();
const listeners = new Set<() => void>();
let initialized = false;

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
  listeners.forEach((l) => l());
}

function initializeFetch() {
  if (!initialized && typeof window !== "undefined") {
    initialized = true;
    setTimeout(() => fetchDonors(), 1500);
  }
}

if (typeof window !== "undefined") {
  window.addEventListener('load', initializeFetch);
  if (document.readyState === 'complete') {
    initializeFetch();
  }
}

export const donorStore = {
  getAll: () => state,
  getById: (id: string) => state.find((d) => d.id === id),

  add: (donor: Omit<Donor, "id">) => {
    const newDonor: Donor = { ...donor, id: `donor-${Date.now()}` };
    state = [newDonor, ...state];
    persist();
    return newDonor;
  },

  update: async (id: string, data: Partial<Donor>) => {
    try {
      const payload: any = {
        name: data.name,
        bloodGroup: data.bloodGroup,
        phone: data.phone,
        location: data.location,
        isAvailableForDonation: data.available,
      };
      Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

      const res = await api.put(`/users/${id}`, payload);
      if (res.data.success) {
        state = state.map((d) => (d.id === id ? { ...d, ...data } : d));
        persist();
      }
    } catch (e) {
      console.error("Failed to update donor", e);
    }
  },

  remove: async (id: string) => {
    try {
      const res = await api.delete(`/users/${id}`);
      if (res.data.success) {
        state = state.filter((d) => d.id !== id);
        persist();
      }
    } catch (e) {
      console.error("Failed to delete donor", e);
    }
  },

  subscribe: (cb: () => void) => {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
};

export function useDonors() {
  return useSyncExternalStore(
    donorStore.subscribe,
    () => state,
    () => state
  );
}
