import { siteConfig } from "@/site.config";

export async function GET() {
  const siteUrl = siteConfig.url?.replace(/\/$/, "") || "http://localhost:3000";
  const currentDate = new Date().toUTCString();

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.name}</title>
    <link>${siteUrl}</link>
    <description>${siteConfig.description}</description>
    <language>${siteConfig.i18n.defaultLocale}</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <item>
      <title>${siteConfig.name}</title>
      <link>${siteUrl}</link>
      <description>${siteConfig.description}</description>
      <pubDate>${currentDate}</pubDate>
      <guid>${siteUrl}</guid>
    </item>
  </channel>
</rss>`;

  return new Response(rssFeed.trim(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
