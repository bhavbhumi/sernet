import { createFileRoute } from "@tanstack/react-router";
import AdminPipelineConfig from "@/pages/admin/sales/AdminPipelineConfig";

export const Route = createFileRoute("/admin/sales/crm/pipeline-config")({
  head: () => ({meta:[{title:'Sales Pipeline Configuration | SERNET'},{name:'description',content:'Manage sales pipeline configuration for SERNET staff.'},{property:'og:title',content:'Sales Pipeline Configuration | SERNET'},{property:'og:description',content:'Manage sales pipeline configuration for SERNET staff.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'}]}),
  component: AdminPipelineConfig,
});
