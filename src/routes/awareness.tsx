import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/routeHead";
import Awareness from "@/pages/Awareness";

export const Route = createFileRoute("/awareness")({
  head: () =>
    pageHead({
      title: "Awareness — Financial Literacy",
      description:
        "Free financial awareness content — investor protection, scam alerts, market basics, and personal finance education by SERNET.",
      path: "/awareness",
    }),
  component: Awareness,
});
