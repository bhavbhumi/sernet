import { createFileRoute } from "@tanstack/react-router";
import AdminReviews from "@/pages/admin/engagement/AdminReviews";

export const Route = createFileRoute("/admin/marketing/engagement/reviews")({
  component: AdminReviews,
});
