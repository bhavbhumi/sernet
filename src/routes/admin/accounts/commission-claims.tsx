import { createFileRoute } from "@tanstack/react-router";
import AdminCommissionClaims from "@/pages/admin/accounts/AdminCommissionClaims";

export const Route = createFileRoute("/admin/accounts/commission-claims")({
  component: AdminCommissionClaims,
});
