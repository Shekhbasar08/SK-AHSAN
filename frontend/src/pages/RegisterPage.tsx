import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserPlus, AlertCircle, Briefcase, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useAuthStore } from "@/lib/authStore";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(10, "Enter a valid 10-digit phone").regex(/^[0-9+\s-]+$/, "Invalid phone"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormData = z.infer<typeof schema>;

export function RegisterPage() {
  const registerUser = useAuthStore((s) => s.register);
  const navigate = useNavigate();
  const [role, setRole] = useState<"CUSTOMER" | "WORKER">("CUSTOMER");
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError("");
    try {
      await registerUser({ ...data, role });
      navigate(role === "WORKER" ? "/worker-dashboard" : "/dashboard");
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Registration failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-lg rounded-2xl border border-slate-100 bg-white p-8 shadow-card">
        <Link to="/" className="flex items-center justify-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary-600 font-bold text-white">K</div>
          <span className="text-xl font-bold">KaamConnect</span>
        </Link>
        <h2 className="mt-6 text-center text-2xl font-bold text-slate-900">Create your account</h2>
        <p className="mt-1 text-center text-sm text-slate-500">Join as a customer or service professional</p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {([
            { key: "CUSTOMER", label: "I need services", icon: User },
            { key: "WORKER", label: "I provide services", icon: Briefcase },
          ] as const).map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => setRole(r.key)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-medium transition-colors",
                role === r.key ? "border-primary-600 bg-primary-50 text-primary-700" : "border-slate-200 text-slate-600 hover:border-slate-300"
              )}
            >
              <r.icon className="size-5" /> {r.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          {serverError && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="size-4 shrink-0" /> {serverError}
            </div>
          )}
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="Rahul Sharma" {...register("name")} />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" placeholder="+91 98765 43210" {...register("phone")} />
            {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Min. 6 characters" {...register("password")} />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            <UserPlus className="size-4" /> {isSubmitting ? "Creating account..." : `Sign Up as ${role === "CUSTOMER" ? "Customer" : "Worker"}`}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="font-semibold text-primary-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
