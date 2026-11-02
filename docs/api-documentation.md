# KaamConnect — API Documentation

Base URL: `http://localhost:8080/api`
Auth: `Authorization: Bearer <JWT>` header on all protected endpoints.

---

## Auth (`/api/auth`)

| Method | Endpoint                | Body                                     | Response                                      |
| ------ | ----------------------- | ---------------------------------------- | --------------------------------------------- |
| POST   | `/auth/register`        | `{ name, email, password, phone, role }` | `201 { token, id, name, email, phone, role }` |
| POST   | `/auth/login`           | `{ email, password }`                    | `200 { token, id, name, email, phone, role }` |
| POST   | `/auth/forgot-password` | `{ email }`                              | `204`                                         |

Roles: `CUSTOMER`, `WORKER`, `ADMIN`.

---

## Categories (`/api/categories`)

| Method | Endpoint           | Auth   |
| ------ | ------------------ | ------ |
| GET    | `/categories`      | Public |
| GET    | `/categories/{id}` | Public |
| POST   | `/categories`      | Admin  |
| DELETE | `/categories/{id}` | Admin  |

---

## Workers (`/api/workers`)

| Method | Endpoint                             | Notes                           |
| ------ | ------------------------------------ | ------------------------------- |
| GET    | `/workers?categoryId=&city=`         | Public search & filter          |
| GET    | `/workers/{id}`                      | Public profile                  |
| POST   | `/workers?userId=`                   | Create worker profile           |
| PUT    | `/workers/{id}`                      | Update pricing/bio/availability |
| PUT    | `/workers/{id}/verify?verified=true` | Admin only                      |

---

## Bookings (`/api/bookings`)

| Method | Endpoint                    | Notes                                                                                                               |
| ------ | --------------------------- | ------------------------------------------------------------------------------------------------------------------- | -------- | ---------- | ----------- | --------- | --------- | ----------- |
| POST   | `/bookings`                 | Create booking `{ workerId, date, timeSlot, address, city, notes, hours }`. Rejects double-booking of worker slots. |
| GET    | `/bookings/my`              | Customer's bookings                                                                                                 |
| GET    | `/bookings/worker`          | Worker's assigned bookings                                                                                          |
| PUT    | `/bookings/{id}/status`     | `{ status: PENDING                                                                                                  | ACCEPTED | ON_THE_WAY | IN_PROGRESS | COMPLETED | CANCELLED | REJECTED }` |
| PUT    | `/bookings/{id}/reschedule` | `{ date, timeSlot }`                                                                                                |

Booking flow: `PENDING → ACCEPTED → ON_THE_WAY → IN_PROGRESS → COMPLETED` (also `CANCELLED`, `REJECTED`).

---

## Payments (`/api/payments`)

| Method | Endpoint                    | Notes           |
| ------ | --------------------------- | --------------- | --- | -------------------- |
| POST   | `/payments/{bookingId}/pay` | `{ method: CARD | UPI | CASH }` — marks paid |
| GET    | `/payments`                 | Payment history |

---

## Reviews (`/api/reviews`)

| Method | Endpoint                     | Notes                                                                  |
| ------ | ---------------------------- | ---------------------------------------------------------------------- |
| GET    | `/reviews/worker/{workerId}` | Public list of reviews                                                 |
| POST   | `/reviews`                   | `{ workerId, rating (1–5), comment }` — only after a completed booking |

---

## Notifications (`/api/notifications`)

| Method | Endpoint         | Notes                                       |
| ------ | ---------------- | ------------------------------------------- |
| GET    | `/notifications` | Current user's notifications (newest first) |

---

## Admin (`/api/admin`) — ADMIN role only

| Method | Endpoint                                                      | Notes                                     |
| ------ | ------------------------------------------------------------- | ----------------------------------------- |
| GET    | `/admin/stats`                                                | Totals: users, workers, bookings, revenue |
| GET    | `/admin/users` / DELETE `/admin/users/{id}`                   | User management                           |
| GET    | `/admin/workers` / PUT `/admin/workers/{id}/verify?verified=` | Worker verification                       |
| GET    | `/admin/bookings`, `/admin/payments`                          | Oversight                                 |

---

## Error Format

```json
{
  "timestamp": "...",
  "status": 400,
  "message": "...",
  "errors": { "field": "msg" }
}
```
