import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, ShieldCheck, BadgeIndianRupee, CalendarCheck, Star, Quote, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge, StarRating } from "@/components/ui/badge";
import { categories, iconMap, workers, testimonials } from "@/lib/mockData";
import { WorkerCard } from "@/features/workers/components/WorkerCard";

const steps = [
  { icon: Search, title: "Choose a Service", desc: "Pick from 8+ home service categories with transparent pricing." },
  { icon: CalendarCheck, title: "Book a Time Slot", desc: "Select a verified professional, date and time that suits you." },
  { icon: ShieldCheck, title: "Get It Done", desc: "Track your worker live — On the Way, In Progress, Completed." },
  { icon: BadgeIndianRupee, title: "Pay & Review", desc: "Pay online or cash after the job and rate your experience." },
];

export function HomePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("Mumbai");
  const featured = workers.filter((w) => w.rating >= 4.7).slice(0, 4);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/workers?q=${encodeURIComponent(query)}&city=${encodeURIComponent(city)}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-white to-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <Badge className="mb-4">⚡ Trusted by 50,000+ homes</Badge>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              Find Trusted <span className="text-primary-600">Professionals</span> Near You
            </h1>
            <p className="mt-4 max-w-lg text-lg text-slate-600">
              Electricians, plumbers, carpenters, AC technicians and more — verified, rated and at your doorstep in minutes.
            </p>

            <form onSubmit={onSearch} className="mt-8 flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-card sm:flex-row">
              <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 px-3">
                <Search className="size-4 shrink-0 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search 'electrician', 'AC repair'..."
                  className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </div>
              <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 px-3">
                <MapPin className="size-4 shrink-0 text-slate-400" />
                <select value={city} onChange={(e) => setCity(e.target.value)} className="h-11 w-full bg-transparent text-sm outline-none">
                  {["Mumbai", "Delhi", "Bengaluru", "Pune", "Hyderabad"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <Button type="submit" size="lg" className="sm:w-auto">Search</Button>
            </form>

            <div className="mt-8 flex flex-wrap gap-6 text-sm">
              {[["4.9★", "Avg. rating"], ["8 min", "Avg. response"], ["2,400+", "Verified pros"]].map(([v, l]) => (
                <div key={l}>
                  <div className="text-xl font-bold text-slate-900">{v}</div>
                  <div className="text-slate-500">{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80" alt="Professional at work" className="rounded-3xl object-cover shadow-xl aspect-[4/3]" />
            <div className="absolute -bottom-5 -left-5 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-card-hover">
              <img src={workers[0].photoUrl} alt="" className="size-11 rounded-full" />
              <div>
                <p className="text-sm font-semibold">Ramesh arrived</p>
                <p className="text-xs text-slate-500">Electrician · On the Way → Arrived</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Popular Services</h2>
            <p className="mt-2 text-slate-500">Book skilled professionals across every home category.</p>
          </div>
          <Link to="/services" className="hidden items-center gap-1 text-sm font-semibold text-primary-600 hover:underline sm:flex">
            View all <ChevronRight className="size-4" />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => {
            const Icon = iconMap[c.icon] ?? Search;
            return (
              <Link
                key={c.id}
                to={`/workers?category=${c.id}`}
                className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-card-hover"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white">
                  <Icon className="size-6" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">{c.name}</h3>
                <p className="mt-1 text-xs text-slate-500">{c.description}</p>
                <p className="mt-3 text-sm font-semibold text-primary-600">From ₹{c.basePrice}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured workers */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Top-Rated Professionals</h2>
          <p className="mt-2 text-slate-500">Background-verified experts with consistently high ratings.</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((w) => <WorkerCard key={w.id} worker={w} />)}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">How It Works</h2>
        <p className="mx-auto mt-2 max-w-md text-center text-slate-500">From booking to payment in four simple steps.</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="relative rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
              <span className="absolute right-5 top-5 text-4xl font-extrabold text-slate-100">{i + 1}</span>
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary-600 text-white">
                <s.icon className="size-5" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-primary-900 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">What Our Customers Say</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.id} className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                <Quote className="size-8 text-primary-300" />
                <p className="mt-3 text-sm leading-relaxed text-white/90">{t.text}</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-white/20 font-semibold text-white">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-white/60">{t.role}</p>
                  </div>
                  <StarRating rating={t.rating} className="ml-auto" showValue={false} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Ready to get your home work done?</h2>
        <p className="mx-auto mt-2 max-w-md text-slate-500">Join thousands of happy customers booking trusted professionals every day.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button size="lg" asChild><Link to="/services">Book a Service</Link></Button>
          <Button size="lg" variant="outline" asChild><Link to="/become-worker">Become a Worker</Link></Button>
        </div>
      </section>
    </div>
  );
}
