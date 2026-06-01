import { useSyncExternalStore } from "react";
import api from "../lib/axios";

export type Camp = {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  description: string;
  organizer: string;
  contactPhone: string;
  status: "upcoming" | "completed" | "cancelled";
};

const STORAGE_KEY = "sengodai_camps_v1";

async function fetchCamps() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await api.get('/camps');
    if (res.data.success) {
      const mapped = res.data.data.map((c: any) => ({
        id: c._id,
        name: c.name,
        date: new Date(c.date).toISOString().split('T')[0],
        time: "10:00 AM",
        location: c.location,
        description: c.description,
        organizer: c.organizer?.name || 'Admin',
        contactPhone: c.organizer?.phone || '0000000000',
        status: c.status?.toLowerCase() || 'upcoming',
      }));
      state = mapped;
      persist();
    }
  } catch (err: any) {
    if (err?.response?.status !== 401) {
      console.error("Failed to fetch camps", err);
    }
  }
}

function load(): Camp[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Camp[];
  } catch {
    return [];
  }
}

let state: Camp[] = load();
const listeners = new Set<() => void>();
let initialized = false;

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore localStorage errors
  }
  listeners.forEach((l) => l());
}

function initializeFetch() {
  if (!initialized && typeof window !== "undefined") {
    initialized = true;
    setTimeout(() => fetchCamps(), 1500);
  }
}

if (typeof window !== "undefined") {
  window.addEventListener('load', initializeFetch);
  if (document.readyState === 'complete') {
    initializeFetch();
  }
}

export const campStore = {
  getAll: () => state,
  getById: (id: string) => state.find((c) => c.id === id),

  add: async (camp: Omit<Camp, "id">) => {
    try {
      const res = await api.post('/camps', {
        name: camp.name,
        date: new Date(camp.date),
        location: camp.location,
        description: camp.description
      });
      if (res.data.success) {
        const newCamp: Camp = { ...camp, id: res.data.data._id };
        state = [newCamp, ...state];
        persist();
        return newCamp;
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  update: async (id: string, data: Partial<Camp>) => {
    try {
      const payload: any = {
        name: data.name,
        date: data.date ? new Date(data.date) : undefined,
        location: data.location,
        description: data.description,
        status: data.status
      };
      Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

      const res = await api.put(`/camps/${id}`, payload);
      if (res.data.success) {
        state = state.map((c) => (c.id === id ? { ...c, ...data } : c));
        persist();
      }
    } catch (e) {
      console.error("Failed to update camp", e);
    }
  },

  remove: async (id: string) => {
    try {
      const res = await api.delete(`/camps/${id}`);
      if (res.data.success) {
        state = state.filter((c) => c.id !== id);
        persist();
      }
    } catch (e) {
      console.error("Failed to delete camp", e);
    }
  },

  subscribe: (cb: () => void) => {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
};

export function useCamps() {
  return useSyncExternalStore(
    campStore.subscribe,
    () => state,
    () => state
  );
}
