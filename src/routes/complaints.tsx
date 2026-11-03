import { createFileRoute } from "@tanstack/react-router";
import Complaints from "@/pages/Complaints";

export const Route = createFileRoute("/complaints")({
  component: Complaints,
});
