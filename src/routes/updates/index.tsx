import { createFileRoute } from "@tanstack/react-router";
import UpdatesPage from "@/pages/Updates";

export const Route = createFileRoute("/updates/")({
  component: UpdatesPage,
});
