import { createFileRoute } from "@tanstack/react-router";
import AdminServiceCatalog from "@/pages/admin/accounts/AdminServiceCatalog";

export const Route = createFileRoute("/admin/accounts/service-catalog")({
  component: AdminServiceCatalog,
});
