import { createFileRoute } from "@tanstack/react-router";
import Disclosure from "@/pages/Disclosure";

export const Route = createFileRoute("/disclosure")({
  component: Disclosure,
});
