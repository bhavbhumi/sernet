import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/signup")({
  beforeLoad: () => {
    throw redirect({ to: "/open-account", search: {"tab": "invest"}, replace: true, statusCode: 301 });
  },
});
