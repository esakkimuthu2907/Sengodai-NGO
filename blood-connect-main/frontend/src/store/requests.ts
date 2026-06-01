import { useSyncExternalStore } from "react";
import api from "../lib/axios";

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
  requester?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role?: string;
    bloodGroup?: string;
    location?: string;
  };
};

const STORAGE_KEY = "sengodai_blood_requests_v1";

async function fetchRequests() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await api.get('/requests');
    if (res.data.success) {
      const mapped = res.data.data.map((r: any) => ({
        id: r._id,
        bloodGroup: r.bloodGroup,
        units: r.units,
        hospital: r.hospitalName || 'Unknown',
        priority: r.urgency,
        patient: r.patientName,
        age: 30,
        status: r.status,
        createdAt: r.createdAt,
        history: [],
        requester: r.requesterId ? {
          id: r.requesterId._id || r.requesterId.id || '',
          name: r.requesterId.name || 'Anonymous',
          email: r.requesterId.email || '',
          phone: r.requesterId.phone || '',
          role: r.requesterId.role || 'volunteer',
          bloodGroup: r.requesterId.bloodGroup || '',
          location: r.requesterId.location || '',
        } : undefined,
      }));
      state = mapped;
      persist();
    }
  } catch (err: any) {
    if (err?.response?.status !== 401) {
      console.error("Failed to fetch requests", err);
    }
  }
}

function load(): BloodRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as BloodRequest[];
  } catch {
    return [];
  }
}

let state: BloodRequest[] = load();
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
    setTimeout(() => fetchRequests(), 1500);
  }
}

if (typeof window !== "undefined") {
  window.addEventListener('load', initializeFetch);
  if (document.readyState === 'complete') {
    initializeFetch();
  }
}

export const requestStore = {
  getAll: () => state,
  getById: (id: string) => state.find((r) => r.id === id),
  add: async (req: Omit<BloodRequest, "id" | "status" | "createdAt" | "history">) => {
    try {
      const payload = {
        patientName: req.patient,
        bloodGroup: req.bloodGroup,
        units: req.units,
        urgency: req.priority,
        hospitalName: req.hospital,
        location: 'Unknown', // add mapping
        contactName: 'Self',
        contactPhone: req.contact || '0000000000',
      };
      const res = await api.post('/requests', payload);
      if (res.data.success) {
        // Optimistic append
        const now = new Date().toISOString();
        let requesterInfo = undefined;
        try {
          const authRaw = localStorage.getItem("sengodai_auth_v1");
          if (authRaw) {
            const authObj = JSON.parse(authRaw);
            if (authObj && authObj.currentUser) {
              const u = authObj.currentUser;
              requesterInfo = {
                id: u.id || '',
                name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.name || 'Anonymous',
                email: u.email || '',
                phone: u.phone || '',
                role: u.role || 'volunteer',
                bloodGroup: u.bloodGroup || '',
                location: u.location || '',
              };
            }
          }
        } catch (err) {
          console.error(err);
        }

        const newReq: BloodRequest = {
          ...req,
          id: res.data.data._id,
          status: "Pending",
          createdAt: now,
          history: [{ status: "Pending", at: now, by: "Requester", note: "Request submitted" }],
          requester: requesterInfo,
        };
        state = [newReq, ...state];
        persist();
        setTimeout(() => fetchRequests(), 500); // trigger background sync
        return newReq;
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
  update: async (id: string, data: Partial<Omit<BloodRequest, "id" | "history" | "createdAt">>) => {
    try {
      const payload: any = {
        patientName: data.patient,
        bloodGroup: data.bloodGroup,
        units: data.units,
        urgency: data.priority,
        hospitalName: data.hospital,
        contactPhone: data.contact,
        notes: data.notes
      };
      Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

      const res = await api.put(`/requests/${id}`, payload);
      if (res.data.success) {
        state = state.map((r) => (r.id === id ? { ...r, ...data } : r));
        persist();
      }
    } catch (e) {
      console.error("Failed to update request", e);
    }
  },
  remove: async (id: string) => {
    try {
      const res = await api.delete(`/requests/${id}`);
      if (res.data.success) {
        state = state.filter((r) => r.id !== id);
        persist();
      }
    } catch (e) {
      console.error("Failed to delete request", e);
    }
  },
  updateStatus: async (id: string, status: RequestStatus, note: string, by = "Admin") => {
    try {
      const res = await api.put(`/requests/${id}`, { status });
      if (res.data.success) {
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
      }
    } catch (e) {
      console.error("Failed to update request status", e);
    }
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
