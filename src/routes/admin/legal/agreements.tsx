import { createFileRoute } from "@tanstack/react-router";
import AdminAgreements from "@/pages/admin/legal/AdminAgreements";

export const Route = createFileRoute("/admin/legal/agreements")({
  component: AdminAgreements,
});
