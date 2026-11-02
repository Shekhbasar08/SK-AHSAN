import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, BadgeCheck, Clock, Briefcase, Heart, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, StarRating, EmptyState } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "@/lib/appStore";
import { categories } from "@/lib/mockData";
import { formatCurrency, formatDate, TIME_SLOTS, daysFromNow } from "@/lib/utils";
import { cn } from "@/lib/utils";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function WorkerProfilePage() {
  const { id } = useParams();
  const worker = useAppStore((s) => s.workers.find((w) => w.id === id));
  const reviews = useAppStore((s) => s.reviews.filter((r) => r.workerId === id));
  const saved = useAppStore((s) => s.savedWorkerIds.includes(id ?? ""));
  const toggleSaved = useAppStore((s) => s.toggleSavedWorker);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  if (!worker) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState title="Worker not found" message="This profile may have been removed." />
        <div className="mt-4 text-center">
          <Button asChild><Link to="/workers">Browse workers</Link></Button>
        </div>
      </div>
    );
  }

  const category = categories.find((c) => c.id === worker.categoryId);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link to="/workers" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary-600">
        <ArrowLeft className="size-4" /> Back to workers
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          {/* Header card */}
          <Card>
            <CardContent className="p-6 pt-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <img src={worker.photoUrl} alt={worker.name} className="size-28 rounded-2xl object-cover" />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold text-slate-900">{worker.name}</h1>
                    {worker.verified && (
                      <Badge variant="success"><BadgeCheck className="mr-1 inline size-3.5" />Verified</Badge>
                    )}
                    <Badge>{category?.name}</Badge>
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                    <MapPin className="size-4" /> {worker.area}, {worker.city}
                  </p>
                  <div className="mt-2 flex items-center gap-4">
                    <StarRating rating={worker.rating} />
                    <span className="text-sm text-slate-400">({worker.reviewCount} reviews)</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{worker.bio}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {worker.skills.map((s) => <Badge key={s} variant="outline">{s}</Badge>)}
                  </div>
                </div>
                <button
                  onClick={() => toggleSaved(worker.id)}
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-full border transition-colors",
                    saved ? "border-red-200 bg-red-50 text-red-500" : "border-slate-200 text-slate-400 hover:text-red-400"
                  )}
                  aria-label="Save worker"
                >
                  <Heart className={cn("size-5", saved && "fill-red-500")} />
                </button>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4 rounded-xl bg-slate-50 p-4 text-center">
                <div>
                  <p className="text-xl font-bold text-slate-900">{worker.completedJobs}+</p>
                  <p className="text-xs text-slate-500">Jobs Done</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900">{worker.experienceYears} yrs</p>
                  <p className="text-xs text-slate-500">Experience</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900">{formatCurrency(worker.hourlyRate)}</p>
                  <p className="text-xs text-slate-500">Per Hour</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="portfolio" className="mt-8">
            <TabsList>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
            </TabsList>

            <TabsContent value="portfolio">
              <div className="grid gap-4 sm:grid-cols-3">
                {worker.portfolio.map((p, i) => (
                  <img key={i} src={p} alt={`Work sample ${i + 1}`} className="aspect-[4/3] w-full rounded-xl object-cover shadow-card" loading="lazy" />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              {reviews.length === 0 ? (
                <EmptyState title="No reviews yet" message="Be the first to review this professional." />
              ) : (
                <div className="space-y-4">
                  {reviews.map((r) => (
                    <Card key={r.id}>
                      <CardContent className="p-5 pt-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary-700">
                              {r.customerName.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{r.customerName}</p>
                              <StarRating rating={r.rating} showValue={false} />
                            </div>
                          </div>
                          <span className="text-xs text-slate-400">{formatDate(r.date)}</span>
                        </div>
                        <p className="mt-3 text-sm text-slate-600">{r.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="availability">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><CalendarDays className="size-5 text-primary-600" /> Weekly Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {DAY_LABELS.map((d) => {
                      const slots = worker.availability[d];
                      return (
                        <button
                          key={d}
                          disabled={!slots}
                          onClick={() => setSelectedDay(d)}
                          className={cn(
                            "rounded-xl border px-4 py-2 text-sm font-medium transition-colors",
                            slots ? "border-primary-200 bg-primary-50 text-primary-700 hover:bg-primary-100" : "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300",
                            selectedDay === d && "ring-2 ring-primary-500"
                          )}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                  {selectedDay && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(worker.availability[selectedDay] ?? []).map((s) => (
                        <Badge key={s} variant="info">{s}</Badge>
                      ))}
                    </div>
                  )}
                  {!selectedDay && <p className="mt-4 text-sm text-slate-500">Select a day to see available time slots.</p>}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Booking sidebar */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle>Service Charges</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Hourly rate</span>
                <span className="font-semibold">{formatCurrency(worker.hourlyRate)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Visit charge</span>
                <span className="font-semibold">{worker.visitCharge ? formatCurrency(worker.visitCharge) : "Free"}</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-700">
                <Clock className="size-4 shrink-0" />
                {worker.availableToday ? "Available for bookings today" : "Next slot available soon"}
              </div>
              <Button size="lg" className="w-full" asChild>
                <Link to={`/book/${worker.id}`}>Book Now</Link>
              </Button>
              <p className="text-center text-xs text-slate-400">
                <Briefcase className="mr-1 inline size-3" /> Free cancellation up to 2 hrs before
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
