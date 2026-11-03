import { createFileRoute } from "@tanstack/react-router";
import AdminTaxRates from "@/pages/admin/accounts/AdminTaxRates";

export const Route = createFileRoute("/admin/accounts/tax-rates")({
  component: AdminTaxRates,
});
