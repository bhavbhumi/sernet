import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/routeHead";
import ChoiceFinX from "@/pages/ChoiceFinX";

export const Route = createFileRoute("/choicefinx")({
  head: () =>
    pageHead({
      title: "Choice FinX Trading Platform",
      description:
        "Choice FinX is the broking app of Choice Equity Broking (SEBI INZ000160131). SERNET is an Authorised Person of Choice. Delivery 0.30%, intraday 0.03% per leg.",
      path: "/choicefinx",
    }),
  component: ChoiceFinX,
});
