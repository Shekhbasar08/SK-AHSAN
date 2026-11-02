import { useState } from "react";
import {
  IndianRupee, CalendarClock, Briefcase, TrendingUp, Check, X, ArrowRightCircle,
  PlayCircle, CheckCircle2, Wallet, Star, Settings, Plus, Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge, EmptyState, StarRating } from "@/components/ui/badge";
import { StatusBadge } from "@/features/bookings/components/StatusBadge";
import { useAppStore } from "@/lib/appStore";
import { categories } from "@/lib/mockData";
import { formatCurrency, formatDate, TIME_SLOTS, cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/authStore";
import type { Booking, BookingStatus } from "@/types";

export function WorkerDashboardPage() {
  const user = useAuthStore((s) => s.user);
  // In demo, worker Ramesh (w1) is the logged-in worker
  const worker = useAppStore((s) => s.workers.find((w) => w.id === "w1"))!;
  const bookings = useAppStore((s) => s.bookings.filter((b) => b.workerId === "w1"));
  const reviews = useAppStore((s) => s.reviews.filter((r) => r.workerId === "w1"));
  const updateBookingStatus = useAppStore((s) => s.updateBookingStatus);
  const markPaid = useAppStore((s) => s.markBookingPaid);
  const updateWorker = useAppStore((s) => s.updateWorker);

  const [price, setPrice] = useState(worker.hourlyRate);
  const [bio, setBio] = useState(worker.bio);
  const [visitCharge, setVisitCharge] = useState(worker.visitCharge);
  const [slots, setSlots] = useState<string[]>(worker ? Object.values(worker.availability).flat() : []);
  const [profileSaved, setProfileSaved] = useState(false);

  const requests = bookings.filter((b) => b.status === "PENDING");
  const active = bookings.filter((b) => ["ACCEPTED", "ON_THE_WAY", "IN_PROGRESS"].includes(b.status));
  const completed = bookings.filter((b) => b.status === "COMPLETED");
  const earnings = completed.filter((b) => b.paymentStatus === "PAID").reduce((s, b) => s + Math.round(b.total * 0.85), 0);
  const pendingEarnings = completed.filter((b) => b.paymentStatus === "UNPAID").reduce((s, b) => s + Math.round(b.total * 0.85), 0);

  const nextAction = (b: Booking): { label: string; to: BookingStatus } | null => {
    switch (b.status) {
      case "ACCEPTED": return { label: "Start — On the Way", to: "ON_THE_WAY" };
      case "ON_THE_WAY": return { label: "Arrived — Start Work", to: "IN_PROGRESS" };
      case "IN_PROGRESS": return { label: "Mark Completed", to: "COMPLETED" };
      default: return null;
    }
  };

  const toggleSlot = (s: string) => setSlots((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Worker Dashboard</h1>
          <p className="mt-1 text-slate-500">{worker.name} · {categories.find((c) => c.id === worker.categoryId)?.name}</p>
        </div>
        <Badge variant={worker.verified ? "success" : "warning"}>
          {worker.verified ? "Verified Professional" : "Pending Verification"}
        </Badge>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Earnings", value: formatCurrency(earnings), icon: IndianRupee, color: "bg-emerald-50 text-emerald-600" },
          { label: "Pending Earnings", value: formatCurrency(pendingEarnings), icon: Wallet, color: "bg-amber-50 text-amber-600" },
          { label: "New Requests", value: requests.length, icon: CalendarClock, color: "bg-primary-50 text-primary-600" },
          { label: "Jobs Completed", value: completed.length, icon: Briefcase, color: "bg-blue-50 text-blue-600" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 p-5 pt-5">
              <div className={`flex size-11 items-center justify-center rounded-xl ${s.color}`}><s.icon className="size-5" /></div>
              <div>
                <p className="text-xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="requests" className="mt-8">
        <TabsList className="flex-wrap">
          <TabsTrigger value="requests">Requests ({requests.length})</TabsTrigger>
          <TabsTrigger value="jobs">Active Jobs ({active.length})</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="services">My Services</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="profile"><Settings className="size-4" /> Profile</TabsTrigger>
        </TabsList>

        {/* Requests */}
        <TabsContent value="requests">
          {requests.length === 0 ? (
            <EmptyState icon={<CalendarClock className="size-10" />} title="No new requests" message="New booking requests will show up here in real time." />
          ) : (
            <div className="space-y-4">
              { requests.map((b: Booking) => (
                <Card key={b.id}>
                  <CardContent className="p-5 pt-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <div className="flex size-11 items-center justify-center rounded-full bg-primary-50 font-semibold text-primary-700">{b.customerName.charAt(0)}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{b.customerName} · <StatusBadge status={b.status} /></h3>
                        <p className="text-sm text-slate-500">{b.serviceName} — {formatCurrency(b.total)}</p>
                        <p className="mt-0.5 text-xs text-slate-400">{formatDate(b.date)} · {b.timeSlot} · {b.address}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => updateBookingStatus(b.id, "ACCEPTED")}><Check className="size-4" /> Accept</Button>
                        <Button size="sm" variant="destructive" onClick={() => updateBookingStatus(b.id, "REJECTED")}><X className="size-4" /> Reject</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Active jobs */}
        <TabsContent value="jobs">
          {active.length === 0 ? (
            <EmptyState icon={<ArrowRightCircle className="size-10" />} title="No active jobs" message="Accepted jobs appear here so you can update status as you progress." />
          ) : (
            <div className="space-y-4">
              {active.map((b) => {
                const action = nextAction(b);
                return (
                  <Card key={b.id}>
                    <CardContent className="p-5 pt-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-slate-900">{b.customerName}</h3>
                            <StatusBadge status={b.status} />
                          </div>
                          <p className="text-sm text-slate-500">{b.serviceName} — {formatCurrency(b.total)}</p>
                          <p className="mt-0.5 text-xs text-slate-400">{formatDate(b.date)} · {b.timeSlot} · {b.address}</p>
                        </div>
                        {action && (
                          <Button size="sm" onClick={() => updateBookingStatus(b.id, action.to)}>
                            <PlayCircle className="size-4" /> {action.label}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Earnings */}
        <TabsContent value="earnings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><TrendingUp className="size-5 text-primary-600" /> Earnings Overview</CardTitle>
              <CardDescription>You keep 85% of each job value; 15% is platform commission.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                {[["Completed Jobs", completed.length], ["Earned", formatCurrency(earnings)], ["Avg. per Job", formatCurrency(completed.length ? Math.round(earnings / completed.length) : 0)]].map(([l, v]) => (
                  <div key={l as string} className="rounded-xl bg-slate-50 p-4 text-center">
                    <p className="text-xl font-bold text-slate-900">{v}</p>
                    <p className="text-xs text-slate-500">{l}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-left text-xs uppercase text-slate-400">
                      <th className="pb-3">Booking</th><th className="pb-3">Customer</th><th className="pb-3">Date</th><th className="pb-3">Gross</th><th className="pb-3">Your Cut (85%)</th><th className="pb-3">Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completed.map((b) => (
                      <tr key={b.id} className="border-b border-slate-50">
                        <td className="py-3 font-medium">{b.id}</td>
                        <td className="py-3">{b.customerName}</td>
                        <td className="py-3">{formatDate(b.date)}</td>
                        <td className="py-3">{formatCurrency(b.total)}</td>
                        <td className="py-3 font-semibold text-emerald-600">{formatCurrency(Math.round(b.total * 0.85))}</td>
                        <td className="py-3">
                          {b.paymentStatus === "PAID"
                            ? <Badge variant="success">Paid</Badge>
                            : <Button size="sm" variant="secondary" onClick={() => markPaid(b.id, "CASH")}>Collect Cash</Button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services / pricing */}
        <TabsContent value="services">
          <Card className="max-w-xl">
            <CardHeader>
              <CardTitle>My Service Pricing</CardTitle>
              <CardDescription>Set competitive rates for your services.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="w-price">Hourly Rate (₹)</Label>
                <Input id="w-price" type="number" value={price} onChange={(e) => setPrice(+e.target.value)} />
              </div>
              <div>
                <Label htmlFor="w-visit">Visit Charge (₹)</Label>
                <Input id="w-visit" type="number" value={visitCharge} onChange={(e) => setVisitCharge(+e.target.value)} />
              </div>
              <div>
                <Label htmlFor="w-bio">Service Description</Label>
                <textarea id="w-bio" value={bio} onChange={(e) => setBio(e.target.value)} className="min-h-[90px] w-full rounded-lg border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <Button onClick={() => { updateWorker(worker.id, { hourlyRate: price, visitCharge, bio }); setProfileSaved(true); setTimeout(() => setProfileSaved(false), 2500); }}>
                <Plus className="size-4" /> Save Pricing
              </Button>
              {profileSaved && <Badge variant="success">Pricing updated successfully</Badge>}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Availability */}
        <TabsContent value="availability">
          <Card className="max-w-xl">
            <CardHeader>
              <CardTitle>Manage Availability</CardTitle>
              <CardDescription>Select the time slots you are available for bookings.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {TIME_SLOTS.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleSlot(s)}
                    className={cn(
                      "rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                      slots.includes(s) ? "border-primary-600 bg-primary-50 text-primary-700" : "border-slate-200 text-slate-600 hover:border-primary-300"
                    )}
                  >
                    {slots.includes(s) && <CheckCircle2 className="mr-1 inline size-4" />} {s}
                  </button>
                ))}
              </div>
              <Button className="mt-5" onClick={() => {
                const map: Record<string, string[]> = {};
                map["Mon"] = slots; map["Tue"] = slots; map["Wed"] = slots;
                updateWorker(worker.id, { availability: map, availableToday: slots.length > 0 });
                alert("Availability saved!");
              }}>
                Save Availability
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile */}
        <TabsContent value="profile">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Professional Profile</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4">
                  <img src={worker.photoUrl} alt="" className="size-16 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-slate-900">{worker.name}</p>
                    <StarRating rating={worker.rating} />
                    <p className="text-xs text-slate-400">{worker.reviewCount} reviews · {worker.completedJobs}+ jobs</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {worker.skills.map((s) => <Badge key={s} variant="outline">{s}</Badge>)}
                </div>
                <p className="text-sm text-slate-500">{worker.area}, {worker.city}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Recent Reviews</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {reviews.slice(0, 4).map((r) => (
                  <div key={r.id} className="rounded-xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">{r.customerName}</p>
                      <StarRating rating={r.rating} />
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{r.comment}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
