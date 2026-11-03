import { createFileRoute } from "@tanstack/react-router";
import AdminCannedResponses from "@/pages/admin/support/AdminCannedResponses";

export const Route = createFileRoute("/admin/support/canned-responses")({
  component: AdminCannedResponses,
});
