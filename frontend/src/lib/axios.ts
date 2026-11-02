import axios from "axios";
import { API_BASE_URL, authHeaders } from "./api";
import { StorageKeys } from "./storage";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = authHeaders().Authorization;
  if (token) config.headers.set("Authorization", token);
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem(StorageKeys.Token);
      localStorage.removeItem(StorageKeys.User);
    }
    return Promise.reject(err);
  }
);
