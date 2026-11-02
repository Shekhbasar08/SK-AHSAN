import { create } from "zustand";
import type { Role, User } from "@/types";
import { demoWorkerUser, currentUser } from "@/lib/mockData";
import { StorageKeys } from "./storage";

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<User>;
  register: (data: { name: string; email: string; password: string; phone: string; role: Role }) => Promise<User>;
  logout: () => void;
  updateProfile: (patch: Partial<User>) => void;
}

const DEMO_PASSWORD = "password123";

export const useAuthStore = create<AuthState>((set, get) => ({
  user: (() => {
    try {
      const raw = localStorage.getItem(StorageKeys.User);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  })(),
  token: localStorage.getItem(StorageKeys.Token),

  login: async (email, password) => {
    await new Promise((r) => setTimeout(r, 600));
    if (password !== DEMO_PASSWORD) throw new Error("Invalid email or password. Demo password: password123");
    const role: Role = email.startsWith("worker") ? "WORKER" : email.startsWith("admin") ? "ADMIN" : "CUSTOMER";
    const user: User =
      role === "WORKER"
        ? { ...demoWorkerUser, email }
        : role === "ADMIN"
          ? { ...currentUser, id: "a1", name: "Admin", email, role }
          : { ...currentUser, email };
    const token = `demo-jwt-${role.toLowerCase()}-${Date.now()}`;
    localStorage.setItem(StorageKeys.Token, token);
    localStorage.setItem(StorageKeys.User, JSON.stringify(user));
    set({ user, token });
    return user;
  },

  register: async (data) => {
    await new Promise((r) => setTimeout(r, 700));
    const role = data.role ?? "CUSTOMER";
    const user: User = {
      id: `${role[0].toLowerCase()}${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    const token = `demo-jwt-${role.toLowerCase()}-${Date.now()}`;
    localStorage.setItem(StorageKeys.Token, token);
    localStorage.setItem(StorageKeys.User, JSON.stringify(user));
    set({ user, token });
    return user;
  },

  logout: () => {
    localStorage.removeItem(StorageKeys.Token);
    localStorage.removeItem(StorageKeys.User);
    set({ user: null, token: null });
  },

  updateProfile: (patch) => {
    const user = get().user;
    if (!user) return;
    const next = { ...user, ...patch };
    localStorage.setItem(StorageKeys.User, JSON.stringify(next));
    set({ user: next });
  },
}));
