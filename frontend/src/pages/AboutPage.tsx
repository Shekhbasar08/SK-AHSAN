import { Link } from "react-router-dom";
import { Search, ShieldCheck, CalendarCheck, BadgeIndianRupee, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary-600">
        <ArrowLeft className="size-4" /> Back to home
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-slate-900">How KaamConnect Works</h1>
      <p className="mt-3 text-slate-600">
        KaamConnect connects homeowners with verified local professionals — electricians, plumbers, carpenters, AC technicians,
        painters, cleaners, mechanics and appliance repair experts. Every booking follows a transparent workflow:
      </p>
      <ol className="mt-8 space-y-4">
        {[
          ["Choose your service", "Browse categories with transparent, upfront pricing — no hidden charges."],
          ["Pick a professional", "Compare ratings, experience, prices and availability before booking."],
          ["Schedule the visit", "Choose a date and time slot that works for you, with your address attached."],
          ["Track in real time", "Follow the status: Pending → Accepted → On the Way → In Progress → Completed."],
          ["Pay & review", "Pay online or in cash after the job, then rate your professional."],
        ].map(([t, d], i) => (
          <li key={i} className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">{i + 1}</span>
            <div>
              <h3 className="font-semibold text-slate-900">{t}</h3>
              <p className="mt-0.5 text-sm text-slate-500">{d}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {[
          { icon: ShieldCheck, t: "Verified Professionals", d: "Every worker is ID-verified by our admin team before taking bookings." },
          { icon: CalendarCheck, t: "No Double Booking", d: "Slot-based calendars ensure your professional shows up on time." },
          { icon: BadgeIndianRupee, t: "Transparent Pricing", d: "See hourly rates, visit charges and platform fees before you confirm." },
        ].map((f) => (
          <div key={f.t} className="rounded-2xl bg-primary-50 p-6 text-center">
            <f.icon className="mx-auto size-8 text-primary-600" />
            <h3 className="mt-3 font-semibold text-slate-900">{f.t}</h3>
            <p className="mt-1 text-sm text-slate-600">{f.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Badge>Need help?</Badge>
        <p className="mt-3 text-slate-600">Our support team is available 8 AM – 10 PM at support@kaamconnect.in or call 1800-KAAM-HELP.</p>
        <Button className="mt-6" asChild><Link to="/services">Explore Services</Link></Button>
      </div>
    </div>
  );
}
