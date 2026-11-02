import { createBrowserRouter } from "react-router-dom";
import { PublicLayout, DashboardLayout } from "@/components/layout/Layout";
import { RequireAuth } from "./RequireAuth";
import { HomePage } from "@/pages/HomePage";
import { ServicesPage } from "@/pages/ServicesPage";
import { WorkersPage } from "@/pages/WorkersPage";
import { WorkerProfilePage } from "@/pages/WorkerProfilePage";
import { BookingPage } from "@/pages/BookingPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage";
import { CustomerDashboardPage } from "@/pages/CustomerDashboardPage";
import { WorkerDashboardPage } from "@/pages/WorkerDashboardPage";
import { AdminDashboardPage } from "@/pages/AdminDashboardPage";
import { BecomeWorkerPage } from "@/pages/BecomeWorkerPage";
import { AboutPage } from "@/pages/AboutPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/services", element: <ServicesPage /> },
      { path: "/workers", element: <WorkersPage /> },
      { path: "/workers/:id", element: <WorkerProfilePage /> },
      { path: "/become-worker", element: <BecomeWorkerPage /> },
      { path: "/about", element: <AboutPage /> },
      {
        element: <RequireAuth roles={["CUSTOMER", "WORKER", "ADMIN"]} />,
        children: [{ path: "/book/:workerId", element: <BookingPage /> }],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  {
    element: <RequireAuth roles={["CUSTOMER"]} />,
    children: [{ path: "/dashboard", element: <DashboardLayout /> }],
  },
  {
    element: <DashboardLayout />,
    children: [
      {
        element: <RequireAuth roles={["CUSTOMER"]} />,
        children: [{ path: "/dashboard", element: <CustomerDashboardPage /> }],
      },
      {
        element: <RequireAuth roles={["WORKER"]} />,
        children: [{ path: "/worker-dashboard", element: <WorkerDashboardPage /> }],
      },
      {
        element: <RequireAuth roles={["ADMIN"]} />,
        children: [{ path: "/admin", element: <AdminDashboardPage /> }],
      },
    ],
  },
]);
