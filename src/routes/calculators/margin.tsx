import { createFileRoute } from "@tanstack/react-router";
import MarginCalculator from "@/pages/calculators/MarginCalculator";

export const Route = createFileRoute("/calculators/margin")({
  component: MarginCalculator,
});
