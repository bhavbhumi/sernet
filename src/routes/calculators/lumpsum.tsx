import { createFileRoute } from "@tanstack/react-router";
import LumpsumCalculator from "@/pages/calculators/LumpsumCalculator";

export const Route = createFileRoute("/calculators/lumpsum")({
  component: LumpsumCalculator,
});
