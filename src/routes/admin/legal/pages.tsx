import { createFileRoute } from "@tanstack/react-router";
import AdminLegal from "@/pages/admin/legal/AdminLegal";

export const Route = createFileRoute("/admin/legal/pages")({
  component: AdminLegal,
});
