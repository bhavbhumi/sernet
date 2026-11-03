import { createFileRoute } from "@tanstack/react-router";
import AdminKnowledgeBase from "@/pages/admin/support/AdminKnowledgeBase";

export const Route = createFileRoute("/admin/support/knowledge-base")({
  component: AdminKnowledgeBase,
});
