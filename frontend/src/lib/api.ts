import { StorageKeys } from "@/lib/storage";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    forgot: "/auth/forgot-password",
  },
  categories: "/categories",
  workers: "/workers",
  bookings: "/bookings",
  payments: "/payments",
  reviews: "/reviews",
  admin: "/admin",
};

export function authHeaders() {
  const token = localStorage.getItem(StorageKeys.Token);
  return token ? { Authorization: `Bearer ${token}` } : {};
}
