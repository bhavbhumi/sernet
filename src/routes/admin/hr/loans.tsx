import { createFileRoute } from "@tanstack/react-router";
import AdminLoans from "@/pages/admin/hr/AdminLoans";

export const Route = createFileRoute("/admin/hr/loans")({
  component: AdminLoans,
});
