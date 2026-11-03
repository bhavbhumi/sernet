import { createFileRoute } from "@tanstack/react-router";
import Calculators from "@/pages/Calculators";

export const Route = createFileRoute("/calculators/")({
  component: Calculators,
});
