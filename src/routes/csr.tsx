import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/csr")({
  beforeLoad: () => {
    throw redirect({ to: "/about", replace: true, statusCode: 301 });
  },
});
