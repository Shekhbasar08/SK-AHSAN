import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MailCheck, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

const schema = z.object({ email: z.string().email("Enter a valid email") });
type FormData = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-card">
        <Link to="/" className="flex items-center justify-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary-600 font-bold text-white">K</div>
          <span className="text-xl font-bold">KaamConnect</span>
        </Link>

        {sent ? (
          <div className="mt-8 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <MailCheck className="size-7" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-slate-900">Check your email</h2>
            <p className="mt-2 text-sm text-slate-500">We've sent a password reset link to your email address.</p>
            <Button className="mt-6 w-full" asChild><Link to="/login">Back to Login</Link></Button>
          </div>
        ) : (
          <>
            <h2 className="mt-6 text-center text-2xl font-bold text-slate-900">Forgot password?</h2>
            <p className="mt-1 text-center text-sm text-slate-500">Enter your email and we'll send you a reset link.</p>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                <KeyRound className="size-4" /> {isSubmitting ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-500">
              Remembered it? <Link to="/login" className="font-semibold text-primary-600 hover:underline">Login</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
