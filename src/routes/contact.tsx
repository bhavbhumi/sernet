import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/routeHead";
import Contact from "@/pages/Contact";

export const Route = createFileRoute("/contact")({
  head: () =>
    pageHead({
      title: "Contact Us",
      description:
        "Get in touch with SERNET Financial Services. Schedule a call, send us a message, or visit our offices.",
      path: "/contact",
    }),
  component: Contact,
});
