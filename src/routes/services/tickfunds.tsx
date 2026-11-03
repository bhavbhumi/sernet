import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/services/tickfunds")({
  beforeLoad: () => {
    throw redirect({ to: "/tickfunds", replace: true, statusCode: 301 });
  },
});
