import { createFileRoute } from "@tanstack/react-router";
import Awareness from "@/pages/Awareness";

export const Route = createFileRoute("/awareness")({
  component: Awareness,
});
