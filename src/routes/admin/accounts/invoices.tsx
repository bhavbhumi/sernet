import { createFileRoute } from "@tanstack/react-router";
import AdminInvoices from "@/pages/admin/accounts/AdminInvoices";

export const Route = createFileRoute("/admin/accounts/invoices")({
  component: AdminInvoices,
});
