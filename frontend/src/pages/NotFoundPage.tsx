import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/badge";

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <EmptyState title="Page not found" message="The page you are looking for doesn't exist or has moved." />
      <Button className="mt-6" asChild><Link to="/">Go Home</Link></Button>
    </div>
  );
}
