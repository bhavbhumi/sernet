import { createFileRoute } from "@tanstack/react-router";
import Opinions from "@/pages/Opinions";

export const Route = createFileRoute("/opinions")({
  component: Opinions,
});
