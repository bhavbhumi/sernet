import { createFileRoute } from "@tanstack/react-router";
import AdminMasterData from "@/pages/admin/settings/AdminMasterData";

export const Route = createFileRoute("/admin/settings/master-data")({
  component: AdminMasterData,
});
