import { createFileRoute } from "@tanstack/react-router";
import ArticleDetail from "@/pages/ArticleDetail";
import { articleHead, loadArticleForRoute } from "@/lib/articleRoute";

export const Route = createFileRoute("/insights/articles/$id")({
  loader: ({ context, params }) => loadArticleForRoute(context.queryClient, params.id),
  head: ({ loaderData }) => articleHead(loaderData),
  component: ArticleDetail,
});
