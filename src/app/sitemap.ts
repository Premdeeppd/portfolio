import { MetadataRoute } from "next";
import contentIndex from "../../content/index.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.premdeep.co.in";

  // Base pages
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/read-with-me`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
  ];

  // Notes routes
  const notes = (contentIndex?.notes || []).map((note) => ({
    url: `${baseUrl}/notes/${note.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Articles routes
  const articles = (contentIndex?.articles || []).map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...routes, ...notes, ...articles];
}
