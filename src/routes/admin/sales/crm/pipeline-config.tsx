import { createFileRoute } from "@tanstack/react-router";
import AdminPipelineConfig from "@/pages/admin/sales/AdminPipelineConfig";

export const Route = createFileRoute("/admin/sales/crm/pipeline-config")({
  component: AdminPipelineConfig,
});
