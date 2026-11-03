import { createFileRoute } from "@tanstack/react-router";
import AdminPosts from "@/pages/admin/content/AdminPosts";

export const Route = createFileRoute("/admin/marketing/content/posts")({
  component: AdminPosts,
});
