import { createFileRoute } from "@tanstack/react-router";
import SIPCalculator from "@/pages/calculators/SIPCalculator";

export const Route = createFileRoute("/calculators/sip")({
  component: SIPCalculator,
});
