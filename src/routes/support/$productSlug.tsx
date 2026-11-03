import { createFileRoute } from "@tanstack/react-router";
import SupportProduct from "@/pages/SupportProduct";

export const Route = createFileRoute("/support/$productSlug")({
  component: SupportProduct,
});
