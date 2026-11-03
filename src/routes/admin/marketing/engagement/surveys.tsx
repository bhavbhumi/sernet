import { createFileRoute } from "@tanstack/react-router";
import AdminSurveys from "@/pages/admin/engagement/AdminSurveys";

export const Route = createFileRoute("/admin/marketing/engagement/surveys")({
  component: AdminSurveys,
});
