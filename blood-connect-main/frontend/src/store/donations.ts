import { useSyncExternalStore } from "react";

export type Donation = {
  id: string;
  donorId: string;
  donorName: string;
  campName: string;
  date: string;
  location: string;
  bloodGroup: string;
  units: number;
  status: "Completed" | "Scheduled" | "Cancelled";
};

const STORAGE_KEY = "sengodai_donations_v1";

const seeded: Donation[] = [
  { id: "don-1", donorId: "1", donorName: "Ramesh Kumar", campName: "Sengodai Mega Blood Camp #1", date: "14 Jan 2026", location: "Tirunelveli", bloodGroup: "B+", units: 1, status: "Completed" },
  { id: "don-2", donorId: "1", donorName: "Ramesh Kumar", campName: "Sengodai Mega Blood Camp #2", date: "13 Feb 2026", location: "Tirunelveli", bloodGroup: "B+", units: 1, status: "Completed" },
  { id: "don-3", donorId: "2", donorName: "Suresh R", campName: "Sengodai Mega Blood Camp #3", date: "12 Mar 2026", location: "Erode", bloodGroup: "B+", units: 1, status: "Completed" },
  { id: "don-4", donorId: "5", donorName: "Priya Sharma", campName: "Youth Blood Donation Drive", date: "11 Apr 2026", location: "Tirunelveli", bloodGroup: "A+", units: 1, status: "Completed" },
  { id: "don-5", donorId: "3", donorName: "Karthik N", campName: "World Blood Donor Day Camp", date: "10 May 2026", location: "Madurai", bloodGroup: "B+", units: 1, status: "Scheduled" },
];

function load(): Donation[] {
  if (typeof window === "undefined") return seeded;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seeded;
    return JSON.parse(raw) as Donation[];
  } catch {
    return seeded;
  }
}

let state: Donation[] = load();
const listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore localStorage errors
  }
  listeners.forEach((l) => l());
}

export const donationStore = {
  getAll: () => state,
  getById: (id: string) => state.find((d) => d.id === id),
  getByDonor: (donorId: string) => state.filter((d) => d.donorId === donorId),

  add: (donation: Omit<Donation, "id">) => {
    const newDon: Donation = { ...donation, id: `don-${Date.now()}` };
    state = [newDon, ...state];
    persist();
    return newDon;
  },

  update: (id: string, data: Partial<Donation>) => {
    state = state.map((d) => (d.id === id ? { ...d, ...data } : d));
    persist();
  },

  remove: (id: string) => {
    state = state.filter((d) => d.id !== id);
    persist();
  },

  subscribe: (cb: () => void) => {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
};

export function useDonations() {
  return useSyncExternalStore(
    donationStore.subscribe,
    () => state,
    () => state
  );
}
