import { createFileRoute } from "@tanstack/react-router";
import BrokerageCalculator from "@/pages/calculators/BrokerageCalculator";

export const Route = createFileRoute("/calculators/brokerage")({
  component: BrokerageCalculator,
});
