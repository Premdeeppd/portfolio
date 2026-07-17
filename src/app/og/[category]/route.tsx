import { notFound } from "next/navigation";
import { generateCardResponse } from "../og-generator";

export const runtime = "nodejs";

interface RouteParams {
  params: Promise<{ category: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const { category } = await params;

  if (category === "home.png") {
    return generateCardResponse({
      title: "Prem - Portfolio, articles, and notes",
      description: "Full-stack software engineer writing articles and notes on software engineering, web architecture, and algorithms.",
      category: "Portfolio",
    });
  }

  if (category === "read-with-me.png") {
    return generateCardResponse({
      title: "Learn with Me - Notes & Articles",
      description: "A collection of structured notes, deep dives, and articles on full-stack development, cloud, and databases.",
      category: "Learn with Me",
    });
  }

  notFound();
}
