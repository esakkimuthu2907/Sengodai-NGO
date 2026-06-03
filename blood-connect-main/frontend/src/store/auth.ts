import { useSyncExternalStore } from "react";
import api from "../lib/axios";

export type UserRole = "admin" | "volunteer" | "user";

export type User = {
  id: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bloodGroup: string;
  dob: string;
  gender: string;
  state: string;
  district: string;
  occupation: string;
  qualification: string;
  idDocument: string;
  workProfile: string;
  address: string;
  area: string;
  country: string;
  zipcode: string;
  title: string;
  available: boolean;
  status: 'Pending' | 'Approved' | 'Rejected';
  name?: string;
  createdAt: string;
};

export type AuthState = {
  currentUser: User | null;
  users: User[];
};

const STORAGE_KEY = "sengodai_auth_v1";

const defaultAdmin: User = {
  id: "admin-001",
  role: "admin",
  firstName: "Admin",
  lastName: "Sengodai",
  email: "admin@sengodai.org",
  phone: "9876543210",
  password: "admin123",
  bloodGroup: "O+",
  dob: "1990-01-01",
  gender: "Male",
  state: "Tamil Nadu",
  district: "Tirunelveli",
  occupation: "Administrator",
  qualification: "Post Graduate",
  idDocument: "Aadhaar",
  workProfile: "",
  address: "Sengodai Blood Foundation, Tirunelveli",
  area: "Main Road",
  country: "India",
  zipcode: "627001",
  title: "Mr",
  available: true,
  status: "Approved",
  createdAt: new Date().toISOString(),
};

function ensureNameFields(user: any): any {
  if (!user) return user;
  if (!user.firstName && user.name) {
    const parts = user.name.trim().split(" ");
    user.firstName = parts[0];
    user.lastName = parts.slice(1).join(" ");
  } else if (!user.name && user.firstName) {
    user.name = `${user.firstName} ${user.lastName || ""}`.trim();
  }
  return user;
}

function load(): AuthState {
  if (typeof window === "undefined") return { currentUser: null, users: [defaultAdmin] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { currentUser: null, users: [defaultAdmin] };
    const parsed = JSON.parse(raw) as AuthState;
    if (parsed.currentUser) {
      ensureNameFields(parsed.currentUser);
      parsed.currentUser.status = parsed.currentUser.status || "Pending";
    }
    if (parsed.users) {
      parsed.users.forEach(u => {
        ensureNameFields(u);
        u.status = u.status || "Pending";
      });
    }
    // Ensure admin always exists
    if (!parsed.users.find((u) => u.id === "admin-001")) {
      parsed.users.unshift(defaultAdmin);
    }
    return parsed;
  } catch {
    return { currentUser: null, users: [defaultAdmin] };
  }
}

let state: AuthState = load();
const listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore localStorage errors
  }
  listeners.forEach((l) => l());
}

export const authStore = {
  getState: () => state,
  getCurrentUser: () => state.currentUser,
  isLoggedIn: () => !!state.currentUser,
  isAdmin: () => state.currentUser?.role === "admin",

  login: async (
    credentials: string | { email?: string; phone?: string; password: string },
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const payload =
        typeof credentials === "string"
          ? { email: credentials, password }
          : credentials;
      const response = await api.post("/auth/login", payload);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      const mappedUser = { ...user, id: user._id || user.id, status: user.status || "Pending" };
      if (mappedUser.role === "admin") {
        mappedUser.status = "Approved";
      }
      ensureNameFields(mappedUser);
      state = { ...state, currentUser: mappedUser as User };
      persist();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || "Login failed" };
    }
  },

  signup: async (userData: any): Promise<{ success: boolean; error?: string }> => {
    try {
      // Map frontend fields to backend
      const payload = {
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        password: userData.password,
        role: userData.role || "volunteer",
        adminSecret: userData.adminSecret,
        bloodGroup: userData.bloodGroup,
        phone: userData.phone,
        location: `${userData.address || userData.city || ''} ${userData.state || ''}`.trim() || 'Unknown',
        address: userData.address,
        area: userData.area,
        country: userData.country,
        zipcode: userData.zipcode,
        dob: userData.dob,
        gender: userData.gender,
        occupation: userData.occupation,
        qualification: userData.qualification,
        idDocument: userData.idDocument,
        workProfile: userData.workProfile,
        title: userData.title
      };
      
      const response = await api.post("/auth/register", payload);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      const mappedUser = { ...user, id: user._id || user.id, status: user.status || "Pending" };
      if (mappedUser.role === "admin") {
        mappedUser.status = "Approved";
      }
      ensureNameFields(mappedUser);
      state = { ...state, currentUser: mappedUser as User };
      persist();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || "Signup failed" };
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    state = { ...state, currentUser: null };
    persist();
  },

  updateUser: async (id: string, data: Partial<User>) => {
    try {
      const payload = { ...data } as any;
      if (data.firstName || data.lastName) {
        payload.name = `${data.firstName || ""} ${data.lastName || ""}`.trim();
      }
      const res = await api.put(`/users/${id}`, payload);
      if (res.data.success) {
        const updatedUser = { ...res.data.data, id: res.data.data._id || res.data.data.id };
        ensureNameFields(updatedUser);
        state = {
          ...state,
          users: state.users.map((u) => (u.id === id ? updatedUser : u)),
          currentUser: state.currentUser?.id === id ? updatedUser : state.currentUser,
        };
        persist();
        return true;
      }
      return false;
    } catch (e) {
      console.error("Failed to update user", e);
      return false;
    }
  },

  fetchUsers: async () => {
    try {
      const res = await api.get("/users");
      if (res.data.success) {
        const mappedUsers = res.data.data.map((u: any) => {
          const mapped = { ...u, id: u._id || u.id, status: u.status || "Pending" };
          ensureNameFields(mapped);
          return mapped;
        });
        state = { ...state, users: mappedUsers };
        persist();
      }
    } catch (e) {
      console.error("Failed to fetch users", e);
    }
  },

  getAllUsers: () => state.users,

  refreshCurrentUser: async () => {
    try {
      const res = await api.get("/auth/me");
      if (res.data.success && res.data.data) {
        const user = res.data.data;
        const mappedUser = { ...user, id: user._id || user.id, status: user.status || "Pending" };
        if (mappedUser.role === "admin") {
          mappedUser.status = "Approved";
        }
        ensureNameFields(mappedUser);
        state = {
          ...state,
          currentUser: mappedUser as User,
          users: state.users.map((u) => (u.id === mappedUser.id ? mappedUser : u)),
        };
        persist();
      }
    } catch (e) {
      console.error("Failed to refresh current user", e);
    }
  },

  removeUser: async (id: string) => {
    if (id === "admin-001") return; // Can't delete default admin
    try {
      const res = await api.delete(`/users/${id}`);
      if (res.data.success) {
        state = {
          ...state,
          users: state.users.filter((u) => u.id !== id),
          currentUser: state.currentUser?.id === id ? null : state.currentUser,
        };
        persist();
      }
    } catch (e) {
      console.error("Failed to remove user", e);
    }
  },

  forgotPassword: async (email: string): Promise<{ success: boolean; error?: string; message?: string; data?: string; resetUrl?: string }> => {
    try {
      const res = await api.post('/auth/forgot-password', { email });
      return { success: true, message: res.data.message, data: res.data.data, resetUrl: res.data.resetUrl };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || "Failed to send reset email" };
    }
  },

  resetPassword: async (token: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await api.put(`/auth/reset-password/${token}`, { password });
      const { token: authToken, user } = res.data;
      localStorage.setItem("token", authToken);
      const mappedUser = { ...user, id: user._id || user.id, status: user.status || "Pending" };
      if (mappedUser.role === "admin") {
        mappedUser.status = "Approved";
      }
      ensureNameFields(mappedUser);
      state = { ...state, currentUser: mappedUser as User };
      persist();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || "Failed to reset password" };
    }
  },

  subscribe: (cb: () => void) => {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
};

export function useAuth() {
  return useSyncExternalStore(
    authStore.subscribe,
    () => state,
    () => state
  );
}
