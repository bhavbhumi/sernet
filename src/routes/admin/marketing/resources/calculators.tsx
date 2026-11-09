import { createFileRoute } from "@tanstack/react-router";
import AdminCalculatorEnquiries from "@/pages/admin/website/AdminCalculatorEnquiries";

export const Route = createFileRoute("/admin/marketing/resources/calculators")({
  component: AdminCalculatorEnquiries,
});
