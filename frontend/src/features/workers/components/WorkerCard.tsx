import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { WorkerProfile } from "@/types";

export function WorkerCard({ worker }: { worker: WorkerProfile }) {
  return (
    <div className="group flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
      <div className="flex items-start gap-4">
        <img
          src={worker.photoUrl}
          alt={worker.name}
          className="size-16 rounded-full object-cover ring-2 ring-primary-50"
          loading="lazy"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold text-slate-900">{worker.name}</h3>
            {worker.verified && <Badge variant="success">Verified</Badge>}
          </div>
          <div className="mt-1 flex items-center gap-3">
            <StarRating rating={worker.rating} />
            <span className="text-xs text-slate-400">({worker.reviewCount})</span>
          </div>
          <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
            <MapPin className="size-3.5" /> {worker.area}, {worker.city}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {worker.skills.slice(0, 3).map((s) => (
          <Badge key={s} variant="outline">{s}</Badge>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="flex items-center gap-1 text-slate-500">
          <Clock className="size-4" /> {worker.experienceYears} yrs exp
        </span>
        <span className="font-semibold text-slate-900">
          {formatCurrency(worker.hourlyRate)} <span className="text-xs font-normal text-slate-400">/hr</span>
        </span>
      </div>

      <div className="mt-5 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link to={`/workers/${worker.id}`}>View Profile</Link>
        </Button>
        <Button size="sm" className="flex-1" asChild>
          <Link to={`/book/${worker.id}`}>Book Now</Link>
        </Button>
      </div>
    </div>
  );
}
