import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LogIn, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useAuthStore } from "@/lib/authStore";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormData = z.infer<typeof schema>;

export function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError("");
    try {
      const user = await login(data.email, data.password);
      navigate(user.role === "ADMIN" ? "/admin" : user.role === "WORKER" ? "/worker-dashboard" : "/dashboard");
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden flex-1 flex-col justify-center bg-primary-900 p-12 lg:flex">
        <div className="max-w-md">
          <h1 className="text-3xl font-bold text-white">Welcome back to KaamConnect</h1>
          <p className="mt-4 text-white/70">India's trusted home services platform. Track bookings, manage payments and reconnect with verified professionals.</p>
          <div className="mt-10 space-y-3 text-sm text-white/80">
            <p>👨‍👩‍👧 Customer demo: <b>customer@demo.com</b></p>
            <p>🔧 Worker demo: <b>worker@demo.com</b></p>
            <p>🛡️ Admin demo: <b>admin@demo.com</b></p>
            <p>🔑 Password for all: <b>password123</b></p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center justify-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary-600 font-bold text-white">K</div>
            <span className="text-xl font-bold">KaamConnect</span>
          </Link>
          <h2 className="mt-8 text-center text-2xl font-bold text-slate-900">Login to your account</h2>
          <p className="mt-1 text-center text-sm text-slate-500">Enter your credentials to continue</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            {serverError && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="size-4 shrink-0" /> {serverError}
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
            </div>
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:underline">Forgot password?</Link>
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              <LogIn className="size-4" /> {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            New to KaamConnect? <Link to="/register" className="font-semibold text-primary-600 hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
