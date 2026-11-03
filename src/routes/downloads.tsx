import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/routeHead";
import DownloadsPage from "@/pages/DownloadsPage";

export const Route = createFileRoute("/downloads")({
  head: () =>
    pageHead({
      title: "Downloads",
      description:
        "Download account opening forms, product documents and apps for Tick Funds, Tushil and Choice FinX.",
      path: "/downloads",
    }),
  component: DownloadsPage,
});
