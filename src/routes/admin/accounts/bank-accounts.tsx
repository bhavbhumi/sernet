import { createFileRoute } from "@tanstack/react-router";
import AdminBankAccounts from "@/pages/admin/accounts/AdminBankAccounts";

export const Route = createFileRoute("/admin/accounts/bank-accounts")({
  component: AdminBankAccounts,
});
