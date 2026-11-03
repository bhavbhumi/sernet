import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/media")({
  beforeLoad: () => {
    throw redirect({ to: "/about", search: {"tab": "Press"}, replace: true, statusCode: 301 });
  },
});
