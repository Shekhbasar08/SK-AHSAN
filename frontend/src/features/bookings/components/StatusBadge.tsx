 import { X } from "lucide-react";

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    PENDING: { label: "Pending", className: "bg-amber-50 text-amber-700" },
    ACCEPTED: { label: "Accepted", className: "bg-blue-50 text-blue-700" },
    ON_THE_WAY: { label: "On the Way", className: "bg-indigo-50 text-indigo-700" },
    IN_PROGRESS: { label: "In Progress", className: "bg-violet-50 text-violet-700" },
    COMPLETED: { label: "Completed", className: "bg-emerald-50 text-emerald-700" },
    CANCELLED: { label: "Cancelled", className: "bg-slate-100 text-slate-500" },
    REJECTED: { label: "Rejected", className: "bg-red-50 text-red-700" },
  };
  const s = map[status] ?? { label: status, className: "bg-slate-100 text-slate-500" };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${s.className}`}>
      {s.label}
    </span>
  );
}

export { X };
