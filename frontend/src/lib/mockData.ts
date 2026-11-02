import { Zap, Droplets, Hammer, Wind, Paintbrush, Sparkles, Wrench, WashingMachine, Fan } from "lucide-react";
import type { Booking, Notification, Payment, Review, ServiceCategory, User, WorkerProfile } from "@/types";

export const currentUser: User = {
  id: "u1",
  name: "Ahsan Khan",
  email: "ahsan@demo.com",
  phone: "+91 98765 43210",
  role: "CUSTOMER",
  createdAt: "2025-01-10",
};

export const demoWorkerUser: User = {
  id: "w1u",
  name: "Ramesh Kumar",
  email: "ramesh@demo.com",
  phone: "+91 98200 11223",
  role: "WORKER",
  createdAt: "2025-02-14",
};

export const categories: ServiceCategory[] = [
  { id: "c1", name: "Electrician", description: "Wiring, fans, switches & repairs", icon: "zap", basePrice: 299 },
  { id: "c2", name: "Plumber", description: "Leaks, taps, pipes & fittings", icon: "droplets", basePrice: 349 },
  { id: "c3", name: "Carpenter", description: "Furniture, doors & fittings", icon: "hammer", basePrice: 399 },
  { id: "c4", name: "AC Technician", description: "AC service, gas refill & repair", icon: "wind", basePrice: 499 },
  { id: "c5", name: "Painter", description: "Wall painting & polishing", icon: "paintbrush", basePrice: 449 },
  { id: "c6", name: "Cleaner", description: "Deep home & kitchen cleaning", icon: "sparkles", basePrice: 499 },
  { id: "c7", name: "Mechanic", description: "Two & four wheeler repairs", icon: "wrench", basePrice: 399 },
  { id: "c8", name: "Appliance Repair", description: "Fridge, washing machine & more", icon: "washingmachine", basePrice: 349 },
];

export const iconMap: Record<string, typeof Zap> = {
  zap: Zap,
  droplets: Droplets,
  hammer: Hammer,
  wind: Wind,
  paintbrush: Paintbrush,
  sparkles: Sparkles,
  wrench: Wrench,
  washingmachine: WashingMachine,
  fan: Fan,
};

const slotsAM = ["09:00 AM - 11:00 AM", "11:00 AM - 01:00 PM"];
const slotsPM = ["03:00 PM - 05:00 PM", "05:00 PM - 07:00 PM"];

export const workers: WorkerProfile[] = [
  {
    id: "w1", userId: "w1u", name: "Ramesh Kumar", photoUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    categoryId: "c1", skills: ["Wiring", "Fan Repair", "Switch Boards", "Inverter Setup"],
    experienceYears: 8, hourlyRate: 350, visitCharge: 99, rating: 4.8, reviewCount: 214, completedJobs: 620,
    city: "Mumbai", area: "Andheri West", bio: "Licensed electrician with 8 years of residential and commercial experience. Same-day service guaranteed.",
    verified: true, availableToday: true,
    portfolio: ["https://picsum.photos/seed/elec1/400/300", "https://picsum.photos/seed/elec2/400/300", "https://picsum.photos/seed/elec3/400/300"],
    availability: { Mon: slotsAM, Tue: slotsPM, Wed: slotsAM, Thu: slotsPM, Fri: slotsAM, Sat: slotsPM },
  },
  {
    id: "w2", userId: "w2u", name: "Suresh Yadav", photoUrl: "https://randomuser.me/api/portraits/men/45.jpg",
    categoryId: "c2", skills: ["Leak Repair", "Tap Fitting", "Bathroom Plumbing"],
    experienceYears: 6, hourlyRate: 400, visitCharge: 120, rating: 4.6, reviewCount: 158, completedJobs: 431,
    city: "Mumbai", area: "Bandra", bio: "Expert plumber specializing in bathroom fittings and emergency leak repairs.",
    verified: true, availableToday: true,
    portfolio: ["https://picsum.photos/seed/plumb1/400/300", "https://picsum.photos/seed/plumb2/400/300"],
    availability: { Mon: slotsPM, Wed: slotsAM, Thu: slotsAM, Sat: slotsAM },
  },
  {
    id: "w3", userId: "w3u", name: "Anita Sharma", photoUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    categoryId: "c4", skills: ["AC Service", "Gas Refill", "Split AC Install"],
    experienceYears: 5, hourlyRate: 550, visitCharge: 150, rating: 4.9, reviewCount: 189, completedJobs: 512,
    city: "Mumbai", area: "Powai", bio: "Certified AC technician for all brands — split and window units. Deep cleaning and gas top-up.",
    verified: true, availableToday: false,
    portfolio: ["https://picsum.photos/seed/ac1/400/300", "https://picsum.photos/seed/ac2/400/300"],
    availability: { Tue: slotsAM, Wed: slotsPM, Fri: slotsAM, Sun: slotsPM },
  },
  {
    id: "w4", userId: "w4u", name: "Deepak Verma", photoUrl: "https://randomuser.me/api/portraits/men/67.jpg",
    categoryId: "c3", skills: ["Furniture Repair", "Door Fitting", "Modular Work"],
    experienceYears: 10, hourlyRate: 450, visitCharge: 100, rating: 4.7, reviewCount: 231, completedJobs: 700,
    city: "Mumbai", area: "Dadar", bio: "Master carpenter with modular furniture and wood polishing expertise.",
    verified: true, availableToday: true,
    portfolio: ["https://picsum.photos/seed/carp1/400/300", "https://picsum.photos/seed/carp2/400/300", "https://picsum.photos/seed/carp3/400/300"],
    availability: { Mon: slotsAM, Tue: slotsPM, Thu: slotsPM, Fri: slotsPM, Sat: slotsAM },
  },
  {
    id: "w5", userId: "w5u", name: "Priya Nair", photoUrl: "https://randomuser.me/api/portraits/women/68.jpg",
    categoryId: "c6", skills: ["Deep Cleaning", "Kitchen Cleaning", "Sofa Shampoo"],
    experienceYears: 4, hourlyRate: 500, visitCharge: 0, rating: 4.8, reviewCount: 176, completedJobs: 388,
    city: "Mumbai", area: "Malad", bio: "Professional home cleaner with trained team for full-home deep cleaning.",
    verified: true, availableToday: true,
    portfolio: ["https://picsum.photos/seed/clean1/400/300", "https://picsum.photos/seed/clean2/400/300"],
    availability: { Mon: slotsPM, Wed: slotsPM, Fri: slotsAM, Sat: slotsAM, Sun: slotsAM },
  },
  {
    id: "w6", userId: "w6u", name: "Imran Sheikh", photoUrl: "https://randomuser.me/api/portraits/men/12.jpg",
    categoryId: "c5", skills: ["Interior Painting", "Texture Finish", "Waterproofing"],
    experienceYears: 7, hourlyRate: 480, visitCharge: 0, rating: 4.5, reviewCount: 122, completedJobs: 340,
    city: "Mumbai", area: "Kurla", bio: "Painter for interiors and exteriors with premium Asian Paints finishes.",
    verified: false, availableToday: false,
    portfolio: ["https://picsum.photos/seed/paint1/400/300", "https://picsum.photos/seed/paint2/400/300"],
    availability: { Tue: slotsAM, Thu: slotsAM, Sun: slotsPM },
  },
  {
    id: "w7", userId: "w7u", name: "Vikram Singh", photoUrl: "https://randomuser.me/api/portraits/men/78.jpg",
    categoryId: "c8", skills: ["Fridge Repair", "Washing Machine", "Microwave"],
    experienceYears: 9, hourlyRate: 420, visitCharge: 130, rating: 4.7, reviewCount: 203, completedJobs: 655,
    city: "Mumbai", area: "Goregaon", bio: "Home appliance repair expert — all major brands serviced with genuine spares.",
    verified: true, availableToday: true,
    portfolio: ["https://picsum.photos/seed/rep1/400/300", "https://picsum.photos/seed/rep2/400/300"],
    availability: { Mon: slotsAM, Tue: slotsAM, Wed: slotsAM, Thu: slotsPM, Fri: slotsPM, Sat: slotsPM },
  },
  {
    id: "w8", userId: "w8u", name: "Sunita Devi", photoUrl: "https://randomuser.me/api/portraits/women/12.jpg",
    categoryId: "c1", skills: ["Wiring", "Light Fitting", "Chandelier Install"],
    experienceYears: 3, hourlyRate: 300, visitCharge: 80, rating: 4.4, reviewCount: 67, completedJobs: 145,
    city: "Mumbai", area: "Andheri East", bio: "Young electrician focused on safe home wiring and light fittings.",
    verified: true, availableToday: true,
    portfolio: ["https://picsum.photos/seed/elec4/400/300", "https://picsum.photos/seed/elec5/400/300"],
    availability: { Wed: slotsAM, Fri: slotsPM, Sat: slotsPM, Sun: slotsPM },
  },
];

const seedReviews: [string, string, number, string, string][] = [
  ["w1", "Mohit Agarwal", 5, "Fixed my short circuit in 20 minutes. Very professional and polite.", "2025-10-20"],
  ["w1", "Kavita Rao", 5, "Best electrician in Andheri. Neat wiring work, fair price.", "2025-10-05"],
  ["w1", "Sandeep Menon", 4, "Arrived slightly late but quality of work was excellent.", "2025-09-28"],
  ["w1", "Farah Ahmed", 5, "Installed 6 fans and a chandelier. Spotless work.", "2025-09-15"],
  ["w2", "Rahul Jain", 5, "Fixed the leaking tap quickly. Charged exactly as quoted.", "2025-10-18"],
  ["w2", "Neha Kapoor", 4, "Good work on bathroom fittings.", "2025-10-01"],
  ["w3", "Arjun Mehta", 5, "AC deep cleaning was superb. Cooling is like new.", "2025-10-22"],
  ["w3", "Divya Iyer", 5, "Very knowledgeable about gas refills. Highly recommend.", "2025-10-11"],
  ["w4", "Sanjay Gupta", 5, "Repaired my antique wardrobe beautifully.", "2025-10-14"],
  ["w5", "Tanvi Shah", 5, "Full home deep cleaning was thorough and on time.", "2025-10-19"],
  ["w5", "Rohan Pillai", 4, "Team was professional. Sofa shampoo results were great.", "2025-09-30"],
  ["w7", "Meera Joshi", 5, "Fixed my washing machine drum the same day.", "2025-10-16"],
];

export const reviews: Review[] = seedReviews.map(([wId, customerName, rating, comment, date], i) => ({
  id: `r${i + 1}`, workerId: wId, customerName, rating, comment, date,
}));

export const reviewsForWorker = (workerId: string) => reviews.filter((r) => r.workerId === workerId);

let bookingSeq = 100;
const mkBooking = (b: Omit<Partial<Booking>, "workerId"> & { workerId: string; date: string }): Booking => {
  const wId = b.workerId ?? "w1";
  const w = workers.find((x) => x.id === wId)!;
  const cat = categories.find((c) => c.id === w.categoryId)!;
  bookingSeq += 1;
  const out: Booking = {
    id: `BK${bookingSeq}`,
    customerId: "u1",
    customerName: "Ahsan Khan",
    workerName: w.name,
    workerPhotoUrl: w.photoUrl,
    categoryId: cat.id,
    categoryName: cat.name,
    serviceName: `${cat.name} — Home Visit`,
    address: "B-402, Sunshine Apartments, Lokhandwala, Andheri West",
    city: "Mumbai",
    timeSlot: "11:00 AM - 01:00 PM",
    notes: "",
    basePrice: w.hourlyRate * 2,
    serviceFee: 49,
    total: w.hourlyRate * 2 + 49,
    status: "COMPLETED",
    paymentMethod: "CARD",
    paymentStatus: "PAID",
    createdAt: b.date,
    ...b,
  };
  return out as Booking;
};

export const bookings: Booking[] = [
  mkBooking({ workerId: "w1", date: "2026-11-02", status: "PENDING", paymentStatus: "UNPAID" }),
  mkBooking({ workerId: "w3", date: "2026-11-05", status: "ACCEPTED", paymentStatus: "UNPAID" }),
  mkBooking({ workerId: "w5", date: "2026-10-28", status: "IN_PROGRESS", paymentStatus: "UNPAID" }),
  mkBooking({ workerId: "w2", date: "2026-10-15", status: "COMPLETED" }),
  mkBooking({ workerId: "w7", date: "2026-09-22", status: "COMPLETED" }),
  mkBooking({ workerId: "w4", date: "2026-08-30", status: "CANCELLED" }),
  mkBooking({ workerId: "w1", date: "2026-08-12", status: "COMPLETED" }),
];

export const payments: Payment[] = bookings
  .filter((b) => b.status === "COMPLETED")
  .map((b, i) => ({
    id: `PAY${i + 1}`,
    bookingId: b.id,
    customerName: b.customerName,
    workerName: b.workerName,
    amount: b.total,
    method: b.paymentMethod,
    status: b.paymentStatus === "PAID" ? "PAID" : "UNPAID",
    date: b.date,
  }));

export const notifications: Notification[] = [
  { id: "n1", title: "Booking Accepted", message: "Ramesh Kumar accepted your Electrician booking for Nov 02.", date: "2026-11-01", read: false },
  { id: "n2", title: "Payment Successful", message: "₹749 paid for booking BK103.", date: "2026-10-15", read: true },
  { id: "n3", title: "Rate your experience", message: "How was Suresh Yadav's plumbing service?", date: "2026-10-15", read: true },
];

export const testimonials = [
  { id: "t1", name: "Priyanka Desai", role: "Homeowner, Andheri", rating: 5, text: "KaamConnect sent a verified electrician within an hour. The booking flow and transparent pricing are fantastic." },
  { id: "t2", name: "Arvind Swamy", role: "Apartment Owner, Powai", rating: 5, text: "Booked an AC service on Sunday evening and it was done Monday morning. Tracking the 'On the Way' status is brilliant." },
  { id: "t3", name: "Sneha Kulkarni", role: "Working Professional, Bandra", rating: 4, text: "No more calling ten numbers for a plumber. Everything — booking, payment, review — happens in one place." },
];
