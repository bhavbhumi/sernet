import { createFileRoute } from "@tanstack/react-router";
import ScheduleCall from "@/pages/ScheduleCall";

export const Route = createFileRoute("/schedule-call")({
  component: ScheduleCall,
});
