export type Role = "CUSTOMER" | "WORKER" | "ADMIN";

export type BookingStatus =
  | "PENDING"
  | "ACCEPTED"
  | "ON_THE_WAY"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "REJECTED";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  avatarUrl?: string;
  createdAt: string;
}

export interface WorkerProfile {
  id: string;
  userId: string;
  name: string;
  photoUrl: string;
  categoryId: string;
  skills: string[];
  experienceYears: number;
  hourlyRate: number;
  visitCharge: number;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  city: string;
  area: string;
  bio: string;
  verified: boolean;
  availableToday: boolean;
  portfolio: string[];
  availability: Record<string, string[]>; // day -> slots
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  basePrice: number;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  workerId: string;
  workerName: string;
  workerPhotoUrl: string;
  categoryId: string;
  categoryName: string;
  serviceName: string;
  address: string;
  city: string;
  date: string;
  timeSlot: string;
  notes: string;
  basePrice: number;
  serviceFee: number;
  total: number;
  status: BookingStatus;
  paymentMethod: "CARD" | "CASH";
  paymentStatus: "UNPAID" | "PAID";
  createdAt: string;
}

export interface Review {
  id: string;
  workerId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  customerName: string;
  workerName: string;
  amount: number;
  method: "CARD" | "CASH";
  status: "PAID" | "UNPAID" | "REFUNDED";
  date: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}
