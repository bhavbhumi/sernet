import { createFileRoute } from "@tanstack/react-router";
import Legal from "@/pages/Legal";
import { supabase } from "@/integrations/supabase/client";
import { pageHead } from "@/lib/routeHead";

// Same query the Legal page uses, prefetched so the full documents are in the first HTML response.
export const legalPagesQuery = {
  queryKey: ["legal-pages"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("legal_pages" as any)
      .select("slug, title, body, updated_at, last_reviewed_on")
      .order("slug");
    if (error) throw error;
    return (data as unknown[]) || [];
  },
};

export const Route = createFileRoute("/legal")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(legalPagesQuery).catch(() => undefined);
  },
  head: () =>
    pageHead({
      title: "Legal & Compliance",
      description:
        "SERNET terms, privacy, IT & HR policies, disclosures and grievance redressal — AMFI mutual fund and APMI PMS distributor.",
      path: "/legal",
    }),
  component: Legal,
});
