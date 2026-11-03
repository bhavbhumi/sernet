import { createFileRoute } from "@tanstack/react-router";
import TickFunds from "@/pages/TickFunds";

export const Route = createFileRoute("/tickfunds/")({
  component: TickFunds,
});
