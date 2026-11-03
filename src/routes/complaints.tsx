import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/routeHead";
import Complaints from "@/pages/Complaints";

export const Route = createFileRoute("/complaints")({
  head: () =>
    pageHead({
      title: "Lodge a Complaint",
      description:
        "SERNET's grievance redressal mechanism — raise and track complaints as per SEBI guidelines.",
      path: "/complaints",
    }),
  component: Complaints,
});
