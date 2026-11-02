import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CalendarClock, History, Heart, Wallet, UserCog, CreditCard, XCircle, Star,
  TrendingUp, Clock, MapPin, CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge, EmptyState, StarRating } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { StatusBadge } from "@/features/bookings/components/StatusBadge";
import { WorkerCard } from "@/features/workers/components/WorkerCard";
import { useAppStore } from "@/lib/appStore";
import { useAuthStore } from "@/lib/authStore";
import { cn, formatCurrency, formatDate, todayISO, TIME_SLOTS } from "@/lib/utils";
import type { Booking, BookingStatus } from "@/types";

const statusFlow: Record<string, { next?: BookingStatus; label?: string }> = {
  PENDING: { next: "CANCELLED", label: "Cancel Booking" },
  ACCEPTED: { next: "CANCELLED", label: "Cancel Booking" },
  ON_THE_WAY: {},
  IN_PROGRESS: {},
  COMPLETED: {},
  CANCELLED: {},
  REJECTED: {},
};

export function CustomerDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const bookings = useAppStore((s) => s.bookings.filter((b) => b.customerId === "u1" || b.customerName === "You" || b.customerName === "Ahsan Khan"));
  const updateBookingStatus = useAppStore((s) => s.updateBookingStatus);
  const markPaid = useAppStore((s) => s.markBookingPaid);
  const updateBooking = useAppStore((s) => s.updateBooking);
  const savedWorkers = useAppStore((s) => s.workers.filter((w) => s.savedWorkerIds.includes(w.id)));
  const toggleSaved = useAppStore((s) => s.toggleSavedWorker);
  const addReview = useAppStore((s) => s.addReview);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const navigate = useNavigate();

  const [payOpen, setPayOpen] = useState<Booking | null>(null);
  const [reviewOpen, setReviewOpen] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [rescheduleOpen, setRescheduleOpen] = useState<Booking | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleSlot, setRescheduleSlot] = useState(TIME_SLOTS[0]);

  const profileForm = useForm({
    defaultValues: { name: user?.name ?? "", email: user?.email ?? "", phone: user?.phone ?? "" },
  });
  const onProfileSave = profileForm.handleSubmit((d) => {
    updateProfile(d);
    alert("Profile updated successfully!");
  });

  const today = todayISO();
  const upcoming = bookings.filter((b) => ["PENDING", "ACCEPTED", "ON_THE_WAY", "IN_PROGRESS"].includes(b.status) && b.date >= today);
  const past = bookings.filter((b) => !upcoming.includes(b));
  const totalSpend = bookings.filter((b) => b.paymentStatus === "PAID").reduce((s, b) => s + b.total, 0);

  const submitReview = () => {
    if (!reviewOpen) return;
    addReview({ workerId: reviewOpen.workerId, customerName: user?.name ?? "You", rating: reviewRating, comment: reviewText || "Good service." });
    setReviewOpen(null);
    setReviewText("");
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Dashboard</h1>
          <p className="mt-1 text-slate-500">Welcome back, {user?.name?.split(" ")[0]} 👋</p>
        </div>
        <Button asChild><Link to="/services">Book a New Service</Link></Button>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Upcoming Bookings", value: upcoming.length, icon: CalendarClock, color: "bg-primary-50 text-primary-600" },
          { label: "Total Bookings", value: bookings.length, icon: History, color: "bg-blue-50 text-blue-600" },
          { label: "Saved Workers", value: savedWorkers.length, icon: Heart, color: "bg-pink-50 text-pink-600" },
          { label: "Total Spend", value: formatCurrency(totalSpend), icon: Wallet, color: "bg-emerald-50 text-emerald-600" },
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

      <Tabs defaultValue="upcoming" className="mt-8">
        <TabsList className="flex-wrap">
          <TabsTrigger value="upcoming"><CalendarClock className="size-4" /> Upcoming</TabsTrigger>
          <TabsTrigger value="history"><History className="size-4" /> History</TabsTrigger>
          <TabsTrigger value="saved"><Heart className="size-4" /> Saved</TabsTrigger>
          <TabsTrigger value="payments"><CreditCard className="size-4" /> Payments</TabsTrigger>
          <TabsTrigger value="profile"><UserCog className="size-4" /> Profile</TabsTrigger>
        </TabsList>

        {/* Upcoming */}
        <TabsContent value="upcoming">
          {upcoming.length === 0 ? (
            <EmptyState icon={<CalendarClock className="size-10" />} title="No upcoming bookings" message="Book a service to see it tracked here." />
          ) : (
            <div className="space-y-4">
              {upcoming.map((b) => (
                <Card key={b.id}>
                  <CardContent className="p-5 pt-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <img src={b.workerPhotoUrl} alt="" className="size-12 rounded-full object-cover" />
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-slate-900">{b.workerName}</h3>
                          <StatusBadge status={b.status} />
                        </div>
                        <p className="mt-0.5 text-sm text-slate-500">{b.serviceName}</p>
                        <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                          <span className="flex items-center gap-1"><Clock className="size-3" /> {formatDate(b.date)} · {b.timeSlot}</span>
                          <span className="flex items-center gap-1"><MapPin className="size-3" /> {b.address}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">{formatCurrency(b.total)}</p>
                        <Badge variant={b.paymentStatus === "PAID" ? "success" : "warning"}>{b.paymentStatus}</Badge>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                      {b.status === "PENDING" && <Badge variant="info">Waiting for worker to accept</Badge>}
                      {["ACCEPTED", "ON_THE_WAY"].includes(b.status) && (
                        <Badge variant="success"><TrendingUp className="mr-1 inline size-3" /> Track: {b.status.replace("_", " ").toLowerCase()}</Badge>
                      )}
                      {b.paymentStatus === "UNPAID" && ["COMPLETED", "IN_PROGRESS"].includes(b.status) && (
                        <Button size="sm" onClick={() => setPayOpen(b)}><Wallet className="size-4" /> Pay Now</Button>
                      )}
                      {b.status === "COMPLETED" && (
                        <Button size="sm" variant="secondary" onClick={() => setReviewOpen(b)}><Star className="size-4" /> Rate Worker</Button>
                      )}
                      {["PENDING", "ACCEPTED"].includes(b.status) && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => { setRescheduleOpen(b); setRescheduleDate(b.date); setRescheduleSlot(b.timeSlot); }}>
                            Reschedule
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => { updateBookingStatus(b.id, "CANCELLED"); }}>
                            <XCircle className="size-4" /> Cancel
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="ghost" asChild><Link to={`/workers/${b.workerId}`}>View Worker</Link></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* History */}
        <TabsContent value="history">
          {past.length === 0 ? (
            <EmptyState icon={<History className="size-10" />} title="No past bookings" message="Your completed and cancelled bookings will appear here." />
          ) : (
            <div className="space-y-4">
              {past.map((b) => (
                <Card key={b.id}>
                  <CardContent className="flex flex-col gap-3 p-5 pt-5 sm:flex-row sm:items-center">
                    <img src={b.workerPhotoUrl} alt="" className="size-12 rounded-full object-cover" />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{b.workerName}</h3>
                        <StatusBadge status={b.status} />
                      </div>
                      <p className="text-sm text-slate-500">{b.serviceName} · {formatDate(b.date)}</p>
                    </div>
                    <p className="font-bold text-slate-900">{formatCurrency(b.total)}</p>
                    <Button size="sm" variant="outline" onClick={() => navigate(`/workers/${b.workerId}`)}>Book Again</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Saved */}
        <TabsContent value="saved">
          {savedWorkers.length === 0 ? (
            <EmptyState icon={<Heart className="size-10" />} title="No saved workers" message="Tap the heart icon on a worker profile to save them." />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {savedWorkers.map((w) => <WorkerCard key={w.id} worker={w} />)}
            </div>
          )}
        </TabsContent>

        {/* Payments */}
        <TabsContent value="payments">
          <Card>
            <CardHeader><CardTitle>Payment History</CardTitle><CardDescription>All transactions for your bookings.</CardDescription></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-left text-xs uppercase text-slate-400">
                      <th className="pb-3">Booking</th><th className="pb-3">Worker</th><th className="pb-3">Date</th><th className="pb-3">Method</th><th className="pb-3">Amount</th><th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id} className="border-b border-slate-50">
                        <td className="py-3 font-medium">{b.id}</td>
                        <td className="py-3">{b.workerName}</td>
                        <td className="py-3">{formatDate(b.date)}</td>
                        <td className="py-3">{b.paymentMethod}</td>
                        <td className="py-3 font-semibold">{formatCurrency(b.total)}</td>
                        <td className="py-3"><Badge variant={b.paymentStatus === "PAID" ? "success" : "warning"}>{b.paymentStatus}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile */}
        <TabsContent value="profile">
          <Card className="max-w-lg">
            <CardHeader><CardTitle>Profile Settings</CardTitle><CardDescription>Update your personal details.</CardDescription></CardHeader>
            <CardContent>
              <form onSubmit={onProfileSave} className="space-y-4">
                <div>
                  <Label htmlFor="p-name">Full Name</Label>
                  <Input id="p-name" {...profileForm.register("name")} />
                </div>
                <div>
                  <Label htmlFor="p-email">Email</Label>
                  <Input id="p-email" type="email" {...profileForm.register("email")} />
                </div>
                <div>
                  <Label htmlFor="p-phone">Phone</Label>
                  <Input id="p-phone" {...profileForm.register("phone")} />
                </div>
                <Button type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Pay dialog */}
      <Dialog open={!!payOpen} onOpenChange={(o) => !o && setPayOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pay for Booking {payOpen?.id}</DialogTitle>
            <DialogDescription>Amount payable: {payOpen ? formatCurrency(payOpen.total) : ""}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Button className="w-full" size="lg" onClick={() => { if (payOpen) { markPaid(payOpen.id, "CARD"); setPayOpen(null); } }}>
              <CreditCard className="size-4" /> Pay Online (Card/UPI)
            </Button>
            <Button variant="outline" className="w-full" size="lg" onClick={() => { if (payOpen) { markPaid(payOpen.id, "CASH"); setPayOpen(null); } }}>
              Pay by Cash
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Review dialog */}
      <Dialog open={!!reviewOpen} onOpenChange={(o) => !o && setReviewOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate {reviewOpen?.workerName}</DialogTitle>
            <DialogDescription>Your feedback helps other customers.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setReviewRating(n)} aria-label={`${n} star`}>
                <Star className={cn("size-8 transition-colors", n <= reviewRating ? "fill-amber-400 text-amber-400" : "text-slate-300")} />
              </button>
            ))}
          </div>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience..."
            className="mt-3 min-h-[90px] w-full rounded-lg border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewOpen(null)}>Cancel</Button>
            <Button onClick={submitReview}><CheckCircle2 className="size-4" /> Submit Review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule dialog */}
      <Dialog open={!!rescheduleOpen} onOpenChange={(o) => !o && setRescheduleOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Booking {rescheduleOpen?.id}</DialogTitle>
            <DialogDescription>Pick a new date and time slot.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>New Date</Label>
              <Input type="date" value={rescheduleDate} min={today} onChange={(e) => setRescheduleDate(e.target.value)} />
            </div>
            <div>
              <Label>New Slot</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {TIME_SLOTS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setRescheduleSlot(s)}
                    className={cn("rounded-lg border px-3 py-2 text-xs", rescheduleSlot === s ? "border-primary-600 bg-primary-50 text-primary-700" : "border-slate-200")}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleOpen(null)}>Cancel</Button>
            <Button onClick={() => {
              if (rescheduleOpen) updateBooking(rescheduleOpen.id, { date: rescheduleDate, timeSlot: rescheduleSlot });
              setRescheduleOpen(null);
            }}>Confirm Reschedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
