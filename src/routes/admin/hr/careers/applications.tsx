import { createFileRoute } from "@tanstack/react-router";
import AdminApplications from "@/pages/admin/careers/AdminApplications";

export const Route = createFileRoute("/admin/hr/careers/applications")({
  component: AdminApplications,
});
