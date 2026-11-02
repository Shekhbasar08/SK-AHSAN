import { create } from "zustand";
import type { Booking, BookingStatus, Review, WorkerProfile } from "@/types";
import { bookings as seedBookings, workers as seedWorkers, reviews as seedReviews } from "./mockData";

interface AppState {
  bookings: Booking[];
  workers: WorkerProfile[];
  reviews: Review[];
  savedWorkerIds: string[];
  createBooking: (b: Omit<Booking, "id" | "createdAt" | "customerName" | "customerId">) => Booking;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  updateBooking: (id: string, patch: Partial<Booking>) => void;
  markBookingPaid: (id: string, method: Booking["paymentMethod"]) => void;
  addReview: (r: Omit<Review, "id" | "date">) => void;
  toggleSavedWorker: (workerId: string) => void;
  updateWorker: (id: string, patch: Partial<WorkerProfile>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  bookings: seedBookings,
  workers: seedWorkers,
  reviews: seedReviews,
  savedWorkerIds: ["w3", "w5"],

  createBooking: (b) => {
    const booking: Booking = {
      ...b,
      id: `BK${Math.floor(Math.random() * 900) + 100}`,
      customerId: "u1",
      customerName: "You",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    set((s) => ({ bookings: [booking, ...s.bookings] }));
    return booking;
  },

  updateBookingStatus: (id, status) =>
    set((s) => ({
      bookings: s.bookings.map((b) => (b.id === id ? { ...b, status } : b)),
    })),

  updateBooking: (id, patch) =>
    set((s) => ({ bookings: s.bookings.map((b) => (b.id === id ? { ...b, ...patch } : b)) })),

  markBookingPaid: (id, method) =>
    set((s) => ({
      bookings: s.bookings.map((b) => (b.id === id ? { ...b, paymentStatus: "PAID", paymentMethod: method } : b)),
    })),

  addReview: (r) =>
    set((s) => ({
      reviews: [{ ...r, id: `r${Date.now()}`, date: new Date().toISOString().slice(0, 10) }, ...s.reviews],
      workers: s.workers.map((w) =>
        w.id === r.workerId
          ? {
            ...w,
            reviewCount: w.reviewCount + 1,
            rating: Math.round(((w.rating * w.reviewCount + r.rating) / (w.reviewCount + 1)) * 10) / 10,
          }
          : w
      ),
    })),

  toggleSavedWorker: (workerId) =>
    set((s) => ({
      savedWorkerIds: s.savedWorkerIds.includes(workerId)
        ? s.savedWorkerIds.filter((id) => id !== workerId)
        : [...s.savedWorkerIds, workerId],
    })),

  updateWorker: (id, patch) =>
    set((s) => ({ workers: s.workers.map((w) => (w.id === id ? { ...w, ...patch } : w)) })),
}));
