import { useEffect, type ReactNode } from "react";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouter,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";

import appCss from "../styles.css?url";
// ported from main.tsx — i18next init (side effect)
import { applyDetectedLanguage } from "@/i18n";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import { ScrollDownFAB } from "@/components/shared/ScrollDownFAB";
import { reportLovableError } from "@/lib/lovable-error-reporting";
import NotFound from "@/pages/NotFound";

const SITE_TITLE = "SERNET Financial Services — Wealth Management India";
const SITE_DESCRIPTION =
  "SERNET Financial Services — a family legacy since October 1986; company incorporated 10 March 2004. Trading, Mutual Funds, Insurance & more across 54 cities, 18 countries.";

// Deindex non-canonical hosts (lovable.app previews/published subdomain) so Google only shows sernetindia.com
const NOINDEX_NON_CANONICAL = `(function () {
  try {
    var host = window.location.hostname;
    if (host.indexOf('lovable.app') !== -1 || host.indexOf('lovableproject.com') !== -1) {
      var m = document.createElement('meta');
      m.name = 'robots';
      m.content = 'noindex, nofollow';
      document.head.appendChild(m);
    }
  } catch (e) {}
})();`;

const GA_INIT = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-BSRJ9Q1H5T');`;

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-medium">This page didn't load</h1>
        <p className="text-muted-foreground">Something went wrong on our end. Please try again.</p>
        <div className="flex gap-2 justify-center">
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              void router.invalidate();
              reset();
            }}
          >
            Try again
          </button>
          <a href="/" className="btn-secondary">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESCRIPTION },
      { name: "author", content: "SERNET Financial Services Pvt Ltd" },
      { name: "keywords", content: "SERNET, financial services, mutual funds, trading, insurance, wealth management, India" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://sernetindia.com" },
      { property: "og:site_name", content: "SERNET Financial Services" },
      { property: "og:title", content: SITE_TITLE },
      { property: "og:description", content: SITE_DESCRIPTION },
      { property: "og:image", content: "https://sernetindia.com/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@sernetindia" },
      { name: "twitter:title", content: SITE_TITLE },
      { name: "twitter:description", content: SITE_DESCRIPTION },
      { name: "twitter:image", content: "https://sernetindia.com/og-image.jpg" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
    ],
    scripts: [
      { src: "https://www.googletagmanager.com/gtag/js?id=G-BSRJ9Q1H5T", async: true },
      { children: GA_INIT },
      { children: NOINDEX_NON_CANONICAL },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useEffect(() => {
    applyDetectedLanguage();
  }, []);
  return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <ScrollToTop />
            <ScrollDownFAB />
            <Outlet />
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
  );
}
