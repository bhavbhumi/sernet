import { createFileRoute } from "@tanstack/react-router";
import AdminPaymentTerms from "@/pages/admin/accounts/AdminPaymentTerms";

export const Route = createFileRoute("/admin/accounts/payment-terms")({
  component: AdminPaymentTerms,
});
