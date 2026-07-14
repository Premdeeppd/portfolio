import fs from "fs";
import path from "path";

const DOMAIN = "https://www.premdeep.co.in";

const contentIndexPath = path.resolve("content/index.json");
const contentIndex = JSON.parse(fs.readFileSync(contentIndexPath, "utf8"));

const today = new Date().toISOString().split("T")[0];

const routes = [
  { url: "/", priority: "1.0", changefreq: "daily" },
  { url: "/read-with-me", priority: "0.8", changefreq: "weekly" },
];

if (contentIndex.notes && Array.isArray(contentIndex.notes)) {
  contentIndex.notes.forEach((note) => {
    routes.push({
      url: `/notes/${note.slug}`,
      priority: "0.7",
      changefreq: "monthly",
    });
  });
}

if (contentIndex.articles && Array.isArray(contentIndex.articles)) {
  contentIndex.articles.forEach((article) => {
    routes.push({
      url: `/articles/${article.slug}`,
      priority: "0.7",
      changefreq: "monthly",
    });
  });
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) => `  <url>
    <loc>${DOMAIN}${r.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

const publicDir = path.resolve("public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const sitemapPath = path.join(publicDir, "sitemap.xml");
fs.writeFileSync(sitemapPath, xml, "utf8");
console.log(`✅ Sitemap successfully generated at ${sitemapPath} with ${routes.length} URLs.`);
