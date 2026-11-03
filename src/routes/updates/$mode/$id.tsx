import { createFileRoute } from "@tanstack/react-router";
import UpdatesDetail from "@/pages/UpdatesDetail";

export const Route = createFileRoute("/updates/$mode/$id")({
  component: UpdatesDetail,
});
