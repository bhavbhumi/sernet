import { createFileRoute } from "@tanstack/react-router";
import Policies from "@/pages/Policies";

export const Route = createFileRoute("/policies")({
  component: Policies,
});
