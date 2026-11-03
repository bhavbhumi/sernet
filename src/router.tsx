import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  // Queries prefetched in route loaders on the server (articles, legal pages)
  // are streamed to the browser, so pages hydrate with the same data they rendered.
  setupRouterSsrQueryIntegration({ router, queryClient });

  return router;
};
