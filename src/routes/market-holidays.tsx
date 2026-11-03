import { createFileRoute } from "@tanstack/react-router";
import MarketHolidays from "@/pages/MarketHolidays";

export const Route = createFileRoute("/market-holidays")({
  component: MarketHolidays,
});
