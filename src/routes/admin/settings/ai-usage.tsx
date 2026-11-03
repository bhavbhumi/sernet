import { createFileRoute } from "@tanstack/react-router";
import AdminAIUsage from "@/pages/admin/settings/AdminAIUsage";

export const Route = createFileRoute("/admin/settings/ai-usage")({
  component: AdminAIUsage,
});
