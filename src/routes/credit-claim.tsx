import { createFileRoute } from "@tanstack/react-router";
import CreditClaim from "@/pages/CreditClaim";

export const Route = createFileRoute("/credit-claim")({
  component: CreditClaim,
});
