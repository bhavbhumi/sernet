import { createFileRoute } from "@tanstack/react-router";
import RaiseTicket from "@/pages/RaiseTicket";

export const Route = createFileRoute("/raise-ticket")({
  component: RaiseTicket,
});
