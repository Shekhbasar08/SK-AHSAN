import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CalendarDays, Clock, MapPin, Wallet, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Textarea, Select } from "@/components/ui/input";
import { Badge, EmptyState } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useAppStore } from "@/lib/appStore";
import { categories } from "@/lib/mockData";
import { cn, formatCurrency, TIME_SLOTS, daysFromNow } from "@/lib/utils";

export function BookingPage() {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const worker = useAppStore((s) => s.workers.find((w) => w.id === workerId));
  const createBooking = useAppStore((s) => s.createBooking);
  const updateBookingStatus = useAppStore((s) => s.updateBookingStatus);

  const [date, setDate] = useState(daysFromNow(1));
  const [slot, setSlot] = useState(TIME_SLOTS[1]);
  const [address, setAddress] = useState("B-402, Sunshine Apartments, Lokhandwala, Andheri West");
  const [city, setCity] = useState("Mumbai");
  const [notes, setNotes] = useState("");
  const [method, setMethod] = useState<"CARD" | "CASH">("CARD");
  const [hours, setHours] = useState(2);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState<{ id: string } | null>(null);
  const [error, setError] = useState("");

  const totals = useMemo(() => {
    if (!worker) return { base: 0, fee: 0, total: 0 };
    const base = worker.hourlyRate * hours + worker.visitCharge;
    const fee = 49;
    return { base, fee, total: base + fee };
  }, [worker, hours]);

  if (!worker) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState title="Worker not found" message="Cannot load booking." />
      </div>
    );
  }

  const category = categories.find((c) => c.id === worker.categoryId);
  const bookedSlots = useMemo(() => new Set(["09:00 AM - 11:00 AM"]), []);

  const onConfirm = async () => {
    if (!address.trim()) { setError("Please enter your service address."); return; }
    if (bookedSlots.has(slot)) { setError("That slot is already booked. Please pick another."); return; }
    setError("");
    setConfirming(true);
    await new Promise((r) => setTimeout(r, 1200));
    const b = createBooking({
      workerId: worker.id, workerName: worker.name, workerPhotoUrl: worker.photoUrl,
      categoryId: category!.id, categoryName: category!.name, serviceName: `${category!.name} — Home Visit`,
      address, city, date, timeSlot: slot, notes, basePrice: totals.base, serviceFee: totals.fee,
      total: totals.total, status: "PENDING", paymentMethod: method, paymentStatus: "UNPAID",
    });
    if (method === "CARD") updateBookingStatus(b.id, "PENDING");
    setConfirming(false);
    setConfirmed(b);
  };

  const minDate = daysFromNow(0);
  const maxDate = daysFromNow(30);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link to={`/workers/${worker.id}`} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary-600">
        <ArrowLeft className="size-4" /> Back to profile
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-slate-900">Book Your Service</h1>
      <p className="mt-1 text-slate-500">Confirm details and schedule your visit.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {/* Worker summary */}
          <Card>
            <CardContent className="flex items-center gap-4 p-5 pt-5">
              <img src={worker.photoUrl} alt="" className="size-14 rounded-full object-cover" />
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{worker.name}</h3>
                <p className="text-sm text-slate-500">{category?.name} · {worker.experienceYears} yrs experience</p>
              </div>
              <Badge variant="success">{formatCurrency(worker.hourlyRate)}/hr</Badge>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><CalendarDays className="size-5 text-primary-600" /> Select Date & Time</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={date} min={minDate} max={maxDate} onChange={(e) => setDate(e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label>Time Slot</Label>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {TIME_SLOTS.map((s) => (
                    <button
                      key={s}
                      disabled={bookedSlots.has(s)}
                      onClick={() => setSlot(s)}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-xs font-medium transition-colors sm:text-sm",
                        slot === s ? "border-primary-600 bg-primary-50 text-primary-700" : "border-slate-200 text-slate-600 hover:border-primary-300",
                        bookedSlots.has(s) && "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300 line-through"
                      )}
                    >
                      <Clock className="mr-1 inline size-3.5" /> {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="hours">Estimated Hours</Label>
                <Select id="hours" value={hours} onChange={(e) => setHours(+e.target.value)} className="mt-1.5">
                  {[1, 2, 3, 4, 5, 6].map((h) => <option key={h} value={h}>{h} hour{h > 1 ? "s" : ""}</option>)}
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="size-5 text-primary-600" /> Service Address</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Full Address</Label>
                <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Select id="city" value={city} onChange={(e) => setCity(e.target.value)} className="mt-1.5">
                  {["Mumbai", "Delhi", "Bengaluru", "Pune", "Hyderabad"].map((c) => <option key={c}>{c}</option>)}
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Notes for the worker (optional)</Label>
                <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Bring a ladder, gate code is 4021" className="mt-1.5" />
              </div>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Wallet className="size-5 text-primary-600" /> Payment Method</CardTitle></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {([
                { key: "CARD", title: "Pay Online", desc: "Card / UPI / Netbanking" },
                { key: "CASH", title: "Pay by Cash", desc: "Pay the worker after the job" },
              ] as const).map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMethod(m.key)}
                  className={cn(
                    "rounded-xl border-2 p-4 text-left transition-colors",
                    method === m.key ? "border-primary-600 bg-primary-50" : "border-slate-200 hover:border-slate-300"
                  )}
                >
                  <p className="font-semibold text-slate-900">{m.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{m.desc}</p>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Price breakdown */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardHeader><CardTitle>Price Breakdown</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">{category?.name} ({hours} hr × {formatCurrency(worker.hourlyRate)})</span>
                <span className="font-medium">{formatCurrency(worker.hourlyRate * hours)}</span>
              </div>
              {worker.visitCharge > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Visit charge</span>
                  <span className="font-medium">{formatCurrency(worker.visitCharge)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Platform fee</span>
                <span className="font-medium">{formatCurrency(totals.fee)}</span>
              </div>
              <div className="border-t border-slate-100 pt-3">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Total</span>
                  <span>{formatCurrency(totals.total)}</span>
                </div>
              </div>
              {error && <p className="text-xs text-red-600">{error}</p>}
              <Button size="lg" className="w-full" onClick={onConfirm} disabled={confirming}>
                {confirming ? "Confirming..." : "Confirm Booking"}
              </Button>
              <p className="text-center text-xs text-slate-400">Free cancellation up to 2 hours before your slot.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation dialog */}
      <Dialog open={!!confirmed} onOpenChange={(o) => !o && navigate("/dashboard")}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><CheckCircle2 className="size-6 text-emerald-500" /> Booking Confirmed!</DialogTitle>
            <DialogDescription>
              Your {category?.name} booking with {worker.name} on {date} ({slot}) is confirmed. Booking ID: <b>{confirmed?.id}</b>.
              You can track its status from your dashboard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => navigate("/")}>Go Home</Button>
            <Button onClick={() => navigate("/dashboard")}>View My Bookings</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
