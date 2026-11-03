import { createFileRoute } from "@tanstack/react-router";
import AdminPress from "@/pages/admin/AdminPress";

export const Route = createFileRoute("/admin/marketing/press")({
  component: AdminPress,
});
