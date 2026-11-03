import { createFileRoute } from "@tanstack/react-router";
import Philosophy from "@/pages/Philosophy";

export const Route = createFileRoute("/about/philosophy")({
  component: Philosophy,
});
