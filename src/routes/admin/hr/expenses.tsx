import { createFileRoute } from "@tanstack/react-router";
import AdminExpenseClaims from "@/pages/admin/hr/AdminExpenseClaims";

export const Route = createFileRoute("/admin/hr/expenses")({
  component: AdminExpenseClaims,
});
