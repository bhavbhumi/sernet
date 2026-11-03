import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/routeHead";
import Reviews from "@/pages/Reviews";

export const Route = createFileRoute("/reviews")({
  head: () =>
    pageHead({
      title: "Client Reviews",
      description:
        "Read client reviews of SERNET Financial Services, continuing a family financial-services practice started in October 1986.",
      path: "/reviews",
    }),
  component: Reviews,
});
