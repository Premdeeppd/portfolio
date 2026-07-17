import { notFound } from "next/navigation";
import { generateCardResponse } from "../../og-generator";
import contentIndex from "../../../../../content/index.json";

export const runtime = "nodejs";

interface RouteParams {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

interface ContentItem {
  title: string;
  slug: string;
  description: string;
  featured: boolean;
}

export async function GET(request: Request, { params }: RouteParams) {
  const { category, slug } = await params;
  const cleanSlug = slug.replace(/\.png$/, "");

  if (category === "notes") {
    const notes = (contentIndex?.notes || []) as ContentItem[];
    const note = notes.find((n) => n.slug === cleanSlug);
    if (!note) {
      notFound();
    }
    return generateCardResponse({
      title: note.title,
      description: note.description,
      category: "Note",
    });
  }

  if (category === "articles") {
    const articles = (contentIndex?.articles || []) as ContentItem[];
    const article = articles.find((a) => a.slug === cleanSlug);
    if (!article) {
      notFound();
    }
    return generateCardResponse({
      title: article.title,
      description: article.description,
      category: "Article",
    });
  }

  notFound();
}
