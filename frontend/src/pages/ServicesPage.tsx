import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { categories, iconMap } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function ServicesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary-600">
        <ArrowLeft className="size-4" /> Back to home
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-slate-900">All Services</h1>
      <p className="mt-2 text-slate-500">Choose a category to see available professionals near you.</p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((c) => {
          const Icon = iconMap[c.icon] ?? ArrowLeft;
          return (
            <Link
              key={c.id}
              to={`/workers?category=${c.id}`}
              className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-card-hover"
            >
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white">
                <Icon className="size-6" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">{c.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{c.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-primary-600">From {formatCurrency(c.basePrice)}</span>
                <Button size="sm" variant="secondary">Browse</Button>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
