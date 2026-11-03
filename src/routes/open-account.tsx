import { createFileRoute } from "@tanstack/react-router";
import OpenAccount from "@/pages/OpenAccount";

export const Route = createFileRoute("/open-account")({
  component: OpenAccount,
});
