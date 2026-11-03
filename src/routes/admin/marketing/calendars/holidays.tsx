import { createFileRoute } from "@tanstack/react-router";
import AdminMarketHolidays from "@/pages/admin/calendars/AdminMarketHolidays";

export const Route = createFileRoute("/admin/marketing/calendars/holidays")({
  component: AdminMarketHolidays,
});
