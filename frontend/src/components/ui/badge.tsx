import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "success" | "warning" | "danger" | "info" | "outline" }) {
  const variants = {
    default: "bg-primary-50 text-primary-700",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-red-50 text-red-700",
    info: "bg-blue-50 text-blue-700",
    outline: "border border-slate-200 text-slate-600",
  };
  return (
    <span
      className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", variants[variant], className)}
      {...props}
    />
  );
}

export function StarRating({ rating, className, showValue = true }: { rating: number; className?: string; showValue?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <Star className="size-4 fill-amber-400 text-amber-400" />
      {showValue && <span className="text-sm font-medium text-slate-700">{rating.toFixed(1)}</span>}
    </span>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-12", className)}>
      <div className="size-8 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600" />
    </div>
  );
}

export function EmptyState({ title, message, icon }: { title: string; message: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
      {icon && <div className="mb-3 text-slate-300">{icon}</div>}
      <h3 className="font-semibold text-slate-700">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{message}</p>
    </div>
  );
}
