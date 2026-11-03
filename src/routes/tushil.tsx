import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/routeHead";
import TushilPage from "@/pages/Tushil";

export const Route = createFileRoute("/tushil")({
  head: () =>
    pageHead({
      title: "Tushil Insurance Platform",
      description:
        "Compare and buy life, health, motor and travel insurance through Tushil by SERNET, placed by our IRDAI-registered broker partner — no charge to you.",
      path: "/tushil",
    }),
  component: TushilPage,
});
