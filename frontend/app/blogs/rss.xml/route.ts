import { fetchPublicBlogs } from "@/lib/api";
import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 300;

export async function GET() {
  const site = getSiteUrl();
  const result = await fetchPublicBlogs(
    new URLSearchParams({ page: "1", limit: "20" }),
  ).catch(() => null);

  const items = (result?.data || [])
    .map(
      (blog) => `
    <item>
      <title><![CDATA[${blog.title}]]></title>
      <link>${site}/blogs/${blog.slug}</link>
      <guid>${site}/blogs/${blog.slug}</guid>
      <pubDate>${blog.publishedAt ? new Date(blog.publishedAt).toUTCString() : ""}</pubDate>
      <description><![CDATA[${blog.excerpt || ""}]]></description>
    </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Shift My Car Blog</title>
    <link>${site}/blogs</link>
    <description>Published articles on premium car transportation.</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
