import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/disclosure")({
  beforeLoad: () => {
    throw redirect({ to: "/legal", search: { tab: "disclosures" }, replace: true, statusCode: 301 });
  },
});
