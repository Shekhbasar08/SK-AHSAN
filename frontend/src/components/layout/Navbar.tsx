import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/authStore";
import { cn } from "@/lib/utils";

const navLinks = [
  { to: "/services", label: "Services" },
  { to: "/workers", label: "Find Workers" },
  { to: "/about", label: "How It Works" },
];

export function Navbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const dashboardPath =
    user?.role === "ADMIN" ? "/admin" : user?.role === "WORKER" ? "/worker-dashboard" : "/dashboard";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary-600 text-white font-bold">K</div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Kaam<span className="text-primary-600">Connect</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  "rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  isActive && "text-primary-700 bg-primary-50"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
          <NavLink
            to="/become-worker"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          >
            Become a Worker
          </NavLink>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50"
              >
                <div className="flex size-8 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                  {user.name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-slate-700">{user.name.split(" ")[0]}</span>
                <ChevronDown className="size-4 text-slate-400" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-100 bg-white py-1 shadow-card-hover">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate(dashboardPath);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <LayoutDashboard className="size-4" /> Dashboard
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="size-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 md:hidden">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
              {l.label}
            </Link>
          ))}
          <Link to="/become-worker" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Become a Worker
          </Link>
          {user ? (
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut className="size-4" /> Logout
            </button>
          ) : (
            <div className="mt-2 flex gap-2">
              <Button variant="outline" className="flex-1" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button className="flex-1" asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
