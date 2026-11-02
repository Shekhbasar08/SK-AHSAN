import { useState } from "react";
import {
  Users, Briefcase, IndianRupee, Star, BadgeCheck, Trash2, Check, X, Search, TrendingUp, DollarSign, Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge, EmptyState, StarRating } from "@/components/ui/badge";
import { StatusBadge } from "@/features/bookings/components/StatusBadge";
import { useAppStore } from "@/lib/appStore";
import { categories, payments as seedPayments } from "@/lib/mockData";
import { formatCurrency, formatDate } from "@/lib/utils";

const demoUsers = [
  { id: "u1", name: "Ahsan Khan", email: "customer@demo.com", role: "CUSTOMER", joined: "2025-01-10" },
  { id: "u2", name: "Priyanka Desai", email: "priyanka@demo.com", role: "CUSTOMER", joined: "2025-03-04" },
  { id: "u3", name: "Arvind Swamy", email: "arvind@demo.com", role: "CUSTOMER", joined: "2025-05-21" },
  { id: "u4", name: "Ramesh Kumar", email: "worker@demo.com", role: "WORKER", joined: "2025-02-14" },
  { id: "u5", name: "Anita Sharma", email: "anita@demo.com", role: "WORKER", joined: "2025-04-02" },
  { id: "u6", name: "Imran Sheikh", email: "imran@demo.com", role: "WORKER", joined: "2025-06-18" },
];

export function AdminDashboardPage() {
  const bookings = useAppStore((s) => s.bookings);
  const workers = useAppStore((s) => s.workers);
  const updateWorker = useAppStore((s) => s.updateWorker);
  const updateBookingStatus = useAppStore((s) => s.updateBookingStatus);
  const [userQuery, setUserQuery] = useState("");
  const [users, setUsers] = useState(demoUsers);

  const revenue = seedPayments.filter((p) => p.status === "PAID").reduce((s, p) => s + p.amount, 0);
  const filteredUsers = users.filter(
    (u) => !userQuery || u.name.toLowerCase().includes(userQuery.toLowerCase()) || u.email.toLowerCase().includes(userQuery.toLowerCase())
  );

  const catCounts = categories.map((c) => ({
    name: c.name,
    count: bookings.filter((b) => b.categoryId === c.id).length + workers.filter((w) => w.categoryId === c.id).length,
  }));
  const maxCat = Math.max(...catCounts.map((c) => c.count), 1);

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
      <p className="mt-1 text-slate-500">Platform analytics and management.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Users", value: users.length + 42, icon: Users, color: "bg-primary-50 text-primary-600", trend: "+12% this month" },
          { label: "Active Workers", value: workers.length, icon: Briefcase, color: "bg-blue-50 text-blue-600", trend: "+3 verified" },
          { label: "Revenue (Paid)", value: formatCurrency(revenue), icon: IndianRupee, color: "bg-emerald-50 text-emerald-600", trend: "+8% this month" },
          { label: "Total Bookings", value: bookings.length, icon: Activity, color: "bg-amber-50 text-amber-600", trend: "+5 this week" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5 pt-5">
              <div className="flex items-center justify-between">
                <div className={`flex size-11 items-center justify-center rounded-xl ${s.color}`}><s.icon className="size-5" /></div>
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600"><TrendingUp className="size-3" />{s.trend}</span>
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="bookings" className="mt-8">
        <TabsList className="flex-wrap">
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="workers">Worker Verification</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings">
          <Card>
            <CardHeader><CardTitle>All Bookings</CardTitle><CardDescription>Monitor and manage bookings across the platform.</CardDescription></CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs uppercase text-slate-400">
                    <th className="pb-3">ID</th><th className="pb-3">Customer</th><th className="pb-3">Worker</th><th className="pb-3">Date</th><th className="pb-3">Total</th><th className="pb-3">Status</th><th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-b border-slate-50">
                      <td className="py-3 font-medium">{b.id}</td>
                      <td className="py-3">{b.customerName}</td>
                      <td className="py-3">{b.workerName}</td>
                      <td className="py-3">{formatDate(b.date)}</td>
                      <td className="py-3 font-semibold">{formatCurrency(b.total)}</td>
                      <td className="py-3"><StatusBadge status={b.status} /></td>
                      <td className="py-3">
                        <div className="flex gap-1">
                          {b.status !== "CANCELLED" && b.status !== "COMPLETED" && (
                            <>
                              <button title="Complete" onClick={() => updateBookingStatus(b.id, "COMPLETED")} className="rounded p-1.5 text-emerald-600 hover:bg-emerald-50"><Check className="size-4" /></button>
                              <button title="Cancel" onClick={() => updateBookingStatus(b.id, "CANCELLED")} className="rounded p-1.5 text-red-600 hover:bg-red-50"><X className="size-4" /></button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>All registered customers and workers.</CardDescription>
              <div className="relative mt-2 max-w-sm">
                <Search className="absolute left-3 top-3 size-4 text-slate-400" />
                <Input value={userQuery} onChange={(e) => setUserQuery(e.target.value)} placeholder="Search users..." className="pl-9" />
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs uppercase text-slate-400">
                    <th className="pb-3">Name</th><th className="pb-3">Email</th><th className="pb-3">Role</th><th className="pb-3">Joined</th><th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="border-b border-slate-50">
                      <td className="py-3 font-medium">{u.name}</td>
                      <td className="py-3">{u.email}</td>
                      <td className="py-3"><Badge variant={u.role === "WORKER" ? "info" : "default"}>{u.role}</Badge></td>
                      <td className="py-3">{formatDate(u.joined)}</td>
                      <td className="py-3">
                        <button title="Remove user" onClick={() => setUsers(users.filter((x) => x.id !== u.id))} className="rounded p-1.5 text-red-600 hover:bg-red-50">
                          <Trash2 className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && <p className="py-6 text-center text-sm text-slate-500">No users match your search.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workers">
          <div className="grid gap-4 sm:grid-cols-2">
            {workers.map((w) => (
              <Card key={w.id}>
                <CardContent className="flex items-start gap-4 p-5 pt-5">
                  <img src={w.photoUrl} alt="" className="size-14 rounded-full object-cover" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{w.name}</h3>
                      {w.verified ? <Badge variant="success"><BadgeCheck className="mr-1 inline size-3" />Verified</Badge> : <Badge variant="warning">Unverified</Badge>}
                    </div>
                    <p className="text-xs text-slate-500">{categories.find((c) => c.id === w.categoryId)?.name} · {w.area}, {w.city}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <StarRating rating={w.rating} />
                      <span className="text-xs text-slate-400">{w.completedJobs}+ jobs</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      {!w.verified ? (
                        <Button size="sm" onClick={() => updateWorker(w.id, { verified: true })}><BadgeCheck className="size-4" /> Verify</Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => updateWorker(w.id, { verified: false })}>Revoke</Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader><CardTitle>Payment Transactions</CardTitle></CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs uppercase text-slate-400">
                    <th className="pb-3">Payment</th><th className="pb-3">Booking</th><th className="pb-3">Customer</th><th className="pb-3">Worker</th><th className="pb-3">Method</th><th className="pb-3">Amount</th><th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {seedPayments.map((p) => (
                    <tr key={p.id} className="border-b border-slate-50">
                      <td className="py-3 font-medium">{p.id}</td>
                      <td className="py-3">{p.bookingId}</td>
                      <td className="py-3">{p.customerName}</td>
                      <td className="py-3">{p.workerName}</td>
                      <td className="py-3">{p.method}</td>
                      <td className="py-3 font-semibold">{formatCurrency(p.amount)}</td>
                      <td className="py-3"><Badge variant={p.status === "PAID" ? "success" : "warning"}>{p.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Star className="size-5 text-amber-500" /> Bookings by Category</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {catCounts.map((c) => (
                  <div key={c.name}>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">{c.name}</span>
                      <span className="font-semibold">{c.count}</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-slate-100">
                      <div className="h-2 rounded-full bg-primary-600" style={{ width: `${(c.count / maxCat) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><DollarSign className="size-5 text-emerald-600" /> Key Metrics</CardTitle></CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                {[
                  ["Avg. Booking Value", formatCurrency(Math.round(bookings.reduce((s, b) => s + b.total, 0) / (bookings.length || 1)))],
                  ["Completion Rate", `${Math.round((bookings.filter((b) => b.status === "COMPLETED").length / (bookings.length || 1)) * 100)}%`],
                  ["Verified Workers", `${workers.filter((w) => w.verified).length}/${workers.length}`],
                  ["Avg. Worker Rating", (workers.reduce((s, w) => s + w.rating, 0) / (workers.length || 1)).toFixed(2) + " ★"],
                ].map(([l, v]) => (
                  <div key={l} className="rounded-xl bg-slate-50 p-4 text-center">
                    <p className="text-xl font-bold text-slate-900">{v}</p>
                    <p className="text-xs text-slate-500">{l}</p>
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
