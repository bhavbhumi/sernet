import { createFileRoute } from "@tanstack/react-router";
import AdminCRMContacts from "@/pages/admin/sales/AdminCRMContacts";

export const Route = createFileRoute("/admin/sales/crm/contacts")({
  component: AdminCRMContacts,
});
