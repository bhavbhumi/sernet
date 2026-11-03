import { createFileRoute } from "@tanstack/react-router";
import Calendars from "@/pages/Calendars";

export const Route = createFileRoute("/calendars")({
  component: Calendars,
});
