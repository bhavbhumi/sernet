import { createFileRoute } from "@tanstack/react-router";
import AdminPartnerPayouts from "@/pages/admin/accounts/AdminPartnerPayouts";

export const Route = createFileRoute("/admin/accounts/partner-payouts")({
  component: AdminPartnerPayouts,
});
