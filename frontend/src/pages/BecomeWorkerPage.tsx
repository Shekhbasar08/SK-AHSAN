import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, ShieldCheck, IndianRupee, CalendarCheck } from "lucide-react";

const perks = [
  { icon: ShieldCheck, title: "Get Verified", desc: "Complete ID verification to earn the trust badge and more bookings." },
  { icon: CalendarCheck, title: "Set Your Schedule", desc: "Choose your working hours and accept only the jobs you want." },
  { icon: IndianRupee, title: "Earn More", desc: "Keep 85% of every job. Withdraw earnings anytime." },
  { icon: Briefcase, title: "Grow Your Business", desc: "Build ratings, showcase a portfolio and get repeat customers." },
];

export function BecomeWorkerPage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-primary-50 to-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Badge className="mb-4">Join 2,400+ professionals earning on KaamConnect</Badge>
          <h1 className="text-4xl font-extrabold text-slate-900">Become a KaamConnect Professional</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
            Turn your skills into steady income. Get bookings from customers near you, on your schedule.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button size="lg" asChild><Link to="/register">Register as Worker</Link></Button>
            <Button size="lg" variant="outline" asChild><Link to="/login">Login</Link></Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((p) => (
            <div key={p.title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary-600 text-white"><p.icon className="size-5" /></div>
              <h3 className="mt-4 font-semibold text-slate-900">{p.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-slate-900">How to get started</h2>
          <ol className="mt-8 space-y-4">
            {[
              "Register with your name, phone and skills.",
              "Submit ID proof for admin verification (usually within 24 hrs).",
              "Set your hourly rate, visit charge and availability slots.",
              "Start receiving booking requests and grow your ratings.",
            ].map((s, i) => (
              <li key={i} className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-card">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">{i + 1}</span>
                <p className="text-slate-700">{s}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
