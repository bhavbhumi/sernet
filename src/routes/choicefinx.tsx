import { createFileRoute } from "@tanstack/react-router";
import ChoiceFinX from "@/pages/ChoiceFinX";

export const Route = createFileRoute("/choicefinx")({
  component: ChoiceFinX,
});
