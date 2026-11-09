import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/routeHead";
import Opinions from "@/pages/Opinions";

export const Route = createFileRoute("/opinions")({
  head: () =>
    pageHead({
      title: "Opinions",
      description:
        "Share your feedback through surveys — help SERNET improve products and services.",
      path: "/opinions",
    }),
  component: Opinions,
});
