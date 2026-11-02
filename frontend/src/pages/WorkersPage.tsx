import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input, Select, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/badge";
import { WorkerCard } from "@/features/workers/components/WorkerCard";
import { categories } from "@/lib/mockData";
import { useAppStore } from "@/lib/appStore";

const CITIES = ["All", "Mumbai"];

export function WorkersPage() {
  const [params, setParams] = useSearchParams();
  const workers = useAppStore((s) => s.workers);

  const [q, setQ] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState(params.get("category") ?? "all");
  const [city, setCity] = useState(params.get("city") ?? "All");
  const [maxPrice, setMaxPrice] = useState(600);
  const [minRating, setMinRating] = useState(0);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState("rating");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = workers.filter((w) => {
      const matchesQ =
        !q ||
        w.name.toLowerCase().includes(q.toLowerCase()) ||
        w.skills.some((s) => s.toLowerCase().includes(q.toLowerCase()));
      const matchesCat = category === "all" || w.categoryId === category;
      const matchesCity = city === "All" || w.city === city;
      return matchesQ && matchesCat && matchesCity && w.hourlyRate <= maxPrice && w.rating >= minRating &&
        (!availableOnly || w.availableToday) && (!verifiedOnly || w.verified);
    });
    list = [...list].sort((a, b) =>
      sort === "price_asc" ? a.hourlyRate - b.hourlyRate
        : sort === "price_desc" ? b.hourlyRate - a.hourlyRate
          : sort === "experience" ? b.experienceYears - a.experienceYears
            : b.rating - a.rating
    );
    return list;
  }, [workers, q, category, city, maxPrice, minRating, availableOnly, verifiedOnly, sort]);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    next.set(key, value);
    setParams(next, { replace: true });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Find Professionals</h1>
          <p className="mt-1 text-slate-500">{filtered.length} workers available</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setParam("q", q);
          }}
          className="flex w-full max-w-md gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 size-4 text-slate-400" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or skill..." className="pl-9" />
          </div>
          <Button type="submit">Search</Button>
          <Button type="button" variant="outline" onClick={() => setShowFilters((v) => !v)} className="lg:hidden">
            <SlidersHorizontal className="size-4" />
          </Button>
        </form>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Filters */}
        <aside className={`${showFilters ? "block" : "hidden"} space-y-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-card lg:block lg:self-start`}>
          <div>
            <Label>Category</Label>
            <Select value={category} onChange={(e) => { setCategory(e.target.value); setParam("category", e.target.value); }} className="mt-1.5">
              <option value="all">All Categories</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </div>
          <div>
            <Label>Location</Label>
            <Select value={city} onChange={(e) => { setCity(e.target.value); setParam("city", e.target.value); }} className="mt-1.5">
              {CITIES.map((c) => <option key={c}>{c}</option>)}
            </Select>
          </div>
          <div>
            <Label>Max Price: ₹{maxPrice}/hr</Label>
            <input type="range" min={200} max={600} step={50} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="mt-2 w-full accent-primary-600" />
          </div>
          <div>
            <Label>Minimum Rating</Label>
            <Select value={minRating} onChange={(e) => setMinRating(+e.target.value)} className="mt-1.5">
              <option value={0}>Any rating</option>
              <option value={4}>4.0+ ★</option>
              <option value={4.5}>4.5+ ★</option>
              <option value={4.8}>4.8+ ★</option>
            </Select>
          </div>
          <div className="space-y-2 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={availableOnly} onChange={(e) => setAvailableOnly(e.target.checked)} className="accent-primary-600" /> Available today
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} className="accent-primary-600" /> Verified only
            </label>
          </div>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => { setCategory("all"); setCity("All"); setMaxPrice(600); setMinRating(0); setAvailableOnly(false); setVerifiedOnly(false); setQ(""); }}
          >
            Reset Filters
          </Button>
        </aside>

        {/* Results */}
        <div>
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-slate-500">Showing {filtered.length} results</p>
            <div className="flex items-center gap-2">
              <Label className="text-xs">Sort by</Label>
              <Select value={sort} onChange={(e) => setSort(e.target.value)} className="h-9 w-44 text-xs">
                <option value="rating">Highest Rating</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="experience">Most Experienced</option>
              </Select>
            </div>
          </div>
          {filtered.length === 0 ? (
            <EmptyState title="No workers found" message="Try adjusting your filters or search for a different skill." />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((w) => <WorkerCard key={w.id} worker={w} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
