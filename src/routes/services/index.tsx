import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/routeHead";
import Services from "@/pages/Services";

export const Route = createFileRoute("/services/")({
  head: () =>
    pageHead({
      title: "Financial Product Distribution – Investment, Insurance & Trading",
      description:
        "SERNET financial product distribution: online trading platforms, mutual fund investment strategies, insurance solutions for families, estate planning & more.",
      path: "/services",
    }),
  component: Services,
});
