import { createFileRoute } from "@tanstack/react-router";
import AdminFirmProfile from "@/pages/admin/accounts/AdminFirmProfile";

export const Route = createFileRoute("/admin/accounts/firm-profile")({
  component: AdminFirmProfile,
});
