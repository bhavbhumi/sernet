import { createFileRoute } from "@tanstack/react-router";
import PortalSignup from "@/pages/portal/PortalSignup";

export const Route = createFileRoute("/portal/signup")({
  component: PortalSignup,
});
