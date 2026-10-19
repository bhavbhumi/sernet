export const ARTICLE_SITE = 'https://sernetindia.com';

export function articlePath(id: string): string {
  return `/insights/articles/${id}`;
}

export function articleShareImage(image?: string | null): string | undefined {
  if (!image) return undefined;
  const url = new URL(image, ARTICLE_SITE);
  if (url.protocol !== 'https:') return undefined;
  if (url.pathname.includes('/storage/v1/object/public/')) {
    url.pathname = url.pathname.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/');
    url.searchParams.set('width', '1200');
    url.searchParams.set('height', '630');
    url.searchParams.set('resize', 'cover');
    url.searchParams.set('quality', '75');
  }
  return url.href;
}