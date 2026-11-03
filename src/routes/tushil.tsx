import { createFileRoute } from "@tanstack/react-router";
import TushilPage from "@/pages/Tushil";

export const Route = createFileRoute("/tushil")({
  component: TushilPage,
});
