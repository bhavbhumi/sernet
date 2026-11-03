import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  beforeLoad: () => {
    throw redirect({ to: "/legal", search: { tab: "privacy" }, replace: true, statusCode: 301 });
  },
});
