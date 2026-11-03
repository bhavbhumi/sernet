import type { QueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ARTICLE_SITE, articlePath, articleShareImage } from "@/lib/articleMetadata";

type ArticleRow = {
  id: string;
  title: string;
  excerpt: string | null;
  thumbnail_url: string | null;
  media_url: string | null;
  content_type: string | null;
};

/** Same query ArticleDetail uses, so server-rendered pages hydrate with identical data. */
export function articleQueryOptions(id: string) {
  return {
    queryKey: ["article", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .eq("status", "published")
        .single();
      if (error) throw error;
      return data;
    },
  };
}

/** Prefetch the article and return only the fields needed for sharing metadata. */
export async function loadArticleForRoute(queryClient: QueryClient, id: string): Promise<ArticleRow | null> {
  try {
    const article = (await queryClient.ensureQueryData(articleQueryOptions(id))) as ArticleRow | null;
    if (!article) return null;
    return {
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      thumbnail_url: article.thumbnail_url,
      media_url: article.media_url,
      content_type: article.content_type,
    };
  } catch {
    return null;
  }
}

/** Per-article title, description, canonical and share image, rendered in the first HTML response. */
export function articleHead(article: ArticleRow | null | undefined) {
  if (!article) return {};
  const title = `${article.title} | SERNET Financial Services`;
  const description = (article.excerpt || article.title).replace(/<[^>]+>/g, "").slice(0, 160);
  const url = `${ARTICLE_SITE}${articlePath(article.id, article.content_type)}`;
  const rawImage =
    article.thumbnail_url ||
    (/\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i.test(article.media_url || "") ? article.media_url : null);
  const image = articleShareImage(rawImage);
  const meta: Array<Record<string, string>> = [
    { title },
    { name: "description", content: description },
    { property: "og:type", content: "article" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
  if (image) {
    meta.push(
      { property: "og:image", content: image },
      { property: "og:image:width", content: "600" },
      { property: "og:image:height", content: "315" },
      { name: "twitter:image", content: image },
    );
  }
  return { meta, links: [{ rel: "canonical", href: url }] };
}
