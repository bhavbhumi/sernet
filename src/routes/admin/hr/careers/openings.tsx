import { createFileRoute } from "@tanstack/react-router";
import AdminJobOpenings from "@/pages/admin/careers/AdminJobOpenings";

export const Route = createFileRoute("/admin/hr/careers/openings")({
  component: AdminJobOpenings,
});
