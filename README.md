# KaamConnect — Home Services Booking Platform

A full-stack home services booking platform where customers book verified electricians, plumbers, carpenters, AC technicians, painters, cleaners, mechanics and appliance repair experts at their doorstep.

**Stack:** React 18 + TypeScript + Vite + Tailwind CSS · Spring Boot 3 + Spring Security + JWT · MySQL

---

## Project Structure

```
kaamconnect/
├── frontend/          # React + TS + Vite + Tailwind app (UI-first, mock-data driven)
├── backend/           # Spring Boot REST API with JWT + role-based access
├── database/          # MySQL schema.sql
├── docs/              # API documentation
└── .env.example       # Environment template
```

## Quick Start — Frontend (works standalone with demo data)

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

**Demo accounts (password: `password123`):**

- Customer: `customer@demo.com`
- Worker: `worker@demo.com`
- Admin: `admin@demo.com`

## Quick Start — Backend

1. Ensure MySQL is running, then create the schema:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
2. Copy `.env.example`, set `DB_USER` / `DB_PASSWORD`.
3. Run the API:
   ```bash
   cd backend
   ./mvnw spring-boot:run     # or: mvn spring-boot:run
   # → http://localhost:8080/api
   ```
   Seed data (categories + demo users) is created automatically on first boot.

## Quick Start — Frontend with real API

Set `VITE_API_URL=http://localhost:8080/api` in `frontend/.env`, then wire the auth/bookings calls in `src/lib/authStore.ts` / `src/lib/appStore.ts` to the Axios client in `src/lib/axios.ts` (endpoints are already defined in `src/lib/api.ts`). See `docs/api-documentation.md` for every endpoint.

## Key Features

- **Roles:** Customer, Worker, Admin with role-guarded routes & dashboards
- **Booking workflow:** Pending → Accepted → On the Way → In Progress → Completed (+ Cancel/Reschedule)
- **Filters:** category, location, price range, rating, availability, verified-only + sorting
- **Payments:** online (Card/UPI) or cash, payment history
- **Reviews:** verified only after completed bookings; ratings recompute live
- **Admin:** stats, user management, worker verification, bookings, payments, analytics
- **JWT + BCrypt** on the backend; demo-mode JWT simulation on the frontend
- Fully responsive, mobile-first UI

## Pages

| Route                                                       | Description                                                          |
| ----------------------------------------------------------- | -------------------------------------------------------------------- |
| `/`                                                         | Hero, search, categories, top workers, how-it-works, testimonials    |
| `/services`                                                 | All service categories                                               |
| `/workers`                                                  | Worker listing with filters & sorting                                |
| `/workers/:id`                                              | Profile, portfolio, reviews, availability, Book Now                  |
| `/book/:workerId`                                           | Checkout: date/slot picker, address, price breakdown                 |
| `/dashboard`                                                | Customer dashboard (bookings, tracking, payments, reviews, profile)  |
| `/worker-dashboard`                                         | Worker dashboard (requests, jobs, earnings, availability, pricing)   |
| `/admin`                                                    | Admin dashboard (analytics, users, verification, bookings, payments) |
| `/login`, `/register`, `/forgot-password`, `/become-worker` | Auth & onboarding                                                    |
