import { createFileRoute } from "@tanstack/react-router";
import ArticleDetail from "@/pages/ArticleDetail";

export const Route = createFileRoute("/insights/articles/$id")({
  component: ArticleDetail,
});
