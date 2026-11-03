import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/policies")({
  beforeLoad: () => {
    throw redirect({ to: "/legal", search: { tab: "policies" }, replace: true, statusCode: 301 });
  },
});
