import { createFileRoute } from "@tanstack/react-router";
import AdminPolls from "@/pages/admin/engagement/AdminPolls";

export const Route = createFileRoute("/admin/marketing/engagement/polls")({
  component: AdminPolls,
});
