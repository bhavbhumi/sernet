import { createFileRoute } from "@tanstack/react-router";
import InvestorCharter from "@/pages/InvestorCharter";

export const Route = createFileRoute("/investor-charter")({
  component: InvestorCharter,
});
