import { createFileRoute } from "@tanstack/react-router";
import AdminIssueTypes from "@/pages/admin/support/AdminIssueTypes";

export const Route = createFileRoute("/admin/support/issue-types")({
  component: AdminIssueTypes,
});
