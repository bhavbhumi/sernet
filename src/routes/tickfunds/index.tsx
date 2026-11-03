import { createFileRoute } from "@tanstack/react-router";
import TickFunds from "@/pages/TickFunds";
import { tickfundsSeo } from "@/content/tickfunds";
import { pageHead } from "@/lib/routeHead";

export const Route = createFileRoute("/tickfunds/")({
  head: () => pageHead(tickfundsSeo),
  component: TickFunds,
});
