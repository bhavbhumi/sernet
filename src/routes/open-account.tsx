import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/routeHead";
import OpenAccount from "@/pages/OpenAccount";

export const Route = createFileRoute("/open-account")({
  head: () =>
    pageHead({
      title: "Open an Account",
      description:
        "Start investing with Tick Funds, get insured with Tushil, or trade with Choice FinX — with SERNET by your side.",
      path: "/open-account",
    }),
  component: OpenAccount,
});
