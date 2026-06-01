import { useSyncExternalStore } from "react";
import { bloodRequests as seed } from "@/data/mock";

export type RequestStatus = "Pending" | "Approved" | "Rejected" | "Fulfilled";

export type StatusEvent = {
  status: RequestStatus;
  note?: string;
  at: string;
  by: string;
};

export type BloodRequest = {
  id: string;
  bloodGroup: string;
  units: number;
  hospital: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  patient: string;
  age: number;
  requiredDate?: string;
  contact?: string;
  notes?: string;
  status: RequestStatus;
  createdAt: string;
  history: StatusEvent[];
};

const STORAGE_KEY = "sengodai_blood_requests_v1";

const seeded: BloodRequest[] = seed.map((r, i) => ({
  id: r.id,
  bloodGroup: r.bloodGroup,
  units: r.units,
  hospital: r.hospital,
  priority: r.priority as BloodRequest["priority"],
  patient: r.patient,
  age: r.age,
  status: i === 0 ? "Approved" : i === 1 ? "Pending" : i === 2 ? "Fulfilled" : "Pending",
  createdAt: new Date(Date.now() - (i + 1) * 3600_000).toISOString(),
  history: [
    {
      status: "Pending",
      at: new Date(Date.now() - (i + 1) * 3600_000).toISOString(),
      by: "System",
      note: "Request submitted",
    },
  ],
}));

function load(): BloodRequest[] {
  if (typeof window === "undefined") return seeded;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seeded;
    return JSON.parse(raw) as BloodRequest[];
  } catch {
    return seeded;
  }
}

let state: BloodRequest[] = load();
const listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
  listeners.forEach((l) => l());
}

export const requestStore = {
  getAll: () => state,
  getById: (id: string) => state.find((r) => r.id === id),
  add: (req: Omit<BloodRequest, "id" | "status" | "createdAt" | "history">) => {
    const now = new Date().toISOString();
    const newReq: BloodRequest = {
      ...req,
      id: `req-${Date.now()}`,
      status: "Pending",
      createdAt: now,
      history: [{ status: "Pending", at: now, by: "Requester", note: "Request submitted" }],
    };
    state = [newReq, ...state];
    persist();
    return newReq;
  },
  updateStatus: (id: string, status: RequestStatus, note: string, by = "Admin") => {
    state = state.map((r) =>
      r.id === id
        ? {
            ...r,
            status,
            history: [...r.history, { status, note, at: new Date().toISOString(), by }],
          }
        : r,
    );
    persist();
  },
  reset: () => {
    state = seeded;
    persist();
  },
  subscribe: (cb: () => void) => {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
};

export function useRequests() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
    () => state,
  );
}
