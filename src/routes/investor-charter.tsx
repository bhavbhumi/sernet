import { createFileRoute } from "@tanstack/react-router";
import InvestorCharter from "@/pages/InvestorCharter";
import { supabase } from "@/integrations/supabase/client";
import { pageHead } from "@/lib/routeHead";

// Same query the Investor Charter page uses, prefetched for the first HTML response.
const charterQuery = {
  queryKey: ["investor-charter-page"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("legal_pages")
      .select("body, last_reviewed_on")
      .eq("slug", "investor-charter")
      .maybeSingle();
    if (error) throw error;
    return data;
  },
};

export const Route = createFileRoute("/investor-charter")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(charterQuery).catch(() => undefined);
  },
  head: () =>
    pageHead({
      title: "Investor Charter",
      description:
        "SERNET investor rights, responsibilities, onboarding, suitability, portfolio review and customer lifecycle guidance.",
      path: "/investor-charter",
    }),
  component: InvestorCharter,
});
