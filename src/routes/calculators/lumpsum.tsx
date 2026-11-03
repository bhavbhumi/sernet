import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/routeHead";
import LumpsumCalculator from "@/pages/calculators/LumpsumCalculator";

export const Route = createFileRoute("/calculators/lumpsum")({
  head: () =>
    pageHead({
      title: "Lumpsum Calculator",
      description:
        "Estimate the future value of a one-time investment.",
      path: "/calculators/lumpsum",
    }),
  component: LumpsumCalculator,
});
