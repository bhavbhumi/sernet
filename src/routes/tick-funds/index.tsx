import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/tick-funds/")({
  beforeLoad: () => {
    throw redirect({ to: "/tickfunds", replace: true, statusCode: 301 });
  },
});
