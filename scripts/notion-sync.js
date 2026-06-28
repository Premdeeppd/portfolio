import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import fs from "fs";
import path from "path";
import https from "https";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

// Ensure Notion client can be initialized
const token = process.env.NOTION_TOKEN ? process.env.NOTION_TOKEN.trim() : null;
const notesParentId = process.env.NOTION_NOTES_PARENT_ID ? process.env.NOTION_NOTES_PARENT_ID.trim() : null;
const articlesParentId = process.env.NOTION_ARTICLES_PARENT_ID ? process.env.NOTION_ARTICLES_PARENT_ID.trim() : null;

if (!token) {
  console.warn("WARNING: NOTION_TOKEN is not defined in the environment. Sync will fail if run.");
}

const notion = token ? new Client({ auth: token }) : null;
const n2m = notion ? new NotionToMarkdown({ notionClient: notion }) : null;

// Helper to slugify titles
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

// Download image helper
function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on("finish", () => {
        file.close(resolve);
      });
    }).on("error", (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

// Helper to resolve title from Notion page properties
function getPageTitle(page) {
  if (!page.properties) return "Untitled";
  const titleProp = Object.values(page.properties).find((prop) => prop.type === "title");
  if (titleProp && titleProp.title && titleProp.title.length > 0) {
    return titleProp.title.map((t) => t.plain_text).join("");
  }
  return "Untitled";
}

// Extract generic property helper for Databases
function getProperty(properties, name) {
  if (!properties || !properties[name]) return null;
  const prop = properties[name];
  if (prop.type === "rich_text" && prop.rich_text.length > 0) {
    return prop.rich_text.map((t) => t.plain_text).join("");
  }
  if (prop.type === "title" && prop.title.length > 0) {
    return prop.title.map((t) => t.plain_text).join("");
  }
  if (prop.type === "checkbox") {
    return prop.checkbox;
  }
  if (prop.type === "select" && prop.select) {
    return prop.select.name;
  }
  if (prop.type === "multi_select" && prop.multi_select) {
    return prop.multi_select.map((s) => s.name);
  }
  if (prop.type === "date" && prop.date) {
    return prop.date.start;
  }
  return null;
}

// Main page getter that supports both database query and block child page lookup
async function getPages(parentId) {
  if (!notion) throw new Error("Notion client not initialized. Check NOTION_TOKEN.");
  
  let dbError = null;
  try {
    // 1. Try querying directly as a database first
    const dbResponse = await notion.dataSources.query({ data_source_id: parentId });
    return dbResponse.results.map((page) => ({
      id: page.id,
      title: getPageTitle(page),
      properties: page.properties,
      created_time: page.created_time,
      last_edited_time: page.last_edited_time,
    }));
  } catch (err) {
    dbError = err;
  }

  // 2. Fallback: Fetch child blocks of the parent ID
  let childrenResponse;
  try {
    childrenResponse = await notion.blocks.children.list({ block_id: parentId });
  } catch (pageError) {
    throw new Error(
      `Could not access Notion ID "${parentId}".\n` +
      `  - Database Query Error: ${dbError.message}\n` +
      `  - Page Blocks Query Error: ${pageError.message}\n\n` +
      `Please ensure that:\n` +
      `1. The ID in your .env file is correct.\n` +
      `2. You have shared the database or page in Notion with your integration connection (named "PortfolioArticleLink").`
    );
  }

  // 3. Scan for inline databases inside the parent page
  const childDatabases = childrenResponse.results.filter((block) => block.type === "child_database");
  if (childDatabases.length > 0) {
    const dbId = childDatabases[0].id;
    console.log(`Found inline database "${childDatabases[0].child_database.title}" (${dbId}) inside page ${parentId}. Querying database...`);
    try {
      const dbResponse = await notion.dataSources.query({ data_source_id: dbId });
      return dbResponse.results.map((page) => ({
        id: page.id,
        title: getPageTitle(page),
        properties: page.properties,
        created_time: page.created_time,
        last_edited_time: page.last_edited_time,
      }));
    } catch (inlineDbErr) {
      throw new Error(
        `Failed to query inline database "${childDatabases[0].child_database.title}" (${dbId}): ${inlineDbErr.message}\n` +
        `Make sure you have shared this specific inline database with your connection (named "PortfolioArticleLink").`
      );
    }
  }

  // 4. Fallback: Treat as a page containing nested sub-pages
  const childPages = childrenResponse.results.filter((block) => block.type === "child_page");
  console.log(`Parent ID ${parentId} is not a database. Treating as a page and found ${childPages.length} nested child pages.`);
  
  const pages = [];
  for (const block of childPages) {
    try {
      const page = await notion.pages.retrieve({ page_id: block.id });
      pages.push({
        id: page.id,
        title: block.child_page.title,
        properties: page.properties,
        created_time: page.created_time,
        last_edited_time: page.last_edited_time,
      });
    } catch (e) {
      console.error(`Error retrieving child page ${block.id}:`, e.message);
    }
  }
  return pages;
}

async function syncType(type, parentId) {
  if (!parentId) {
    console.log(`No parent ID defined for ${type}, skipping.`);
    return [];
  }

  const outputDir = path.join(projectRoot, "content", type);
  const imagesDir = path.join(projectRoot, "public", "content-images", type);
  
  fs.mkdirSync(outputDir, { recursive: true });
  fs.mkdirSync(imagesDir, { recursive: true });

  console.log(`Fetching ${type} from Notion...`);
  const pages = await getPages(parentId);
  console.log(`Found ${pages.length} pages/items in ${type}.`);

  const metadataList = [];

  for (const page of pages) {
    try {
      console.log(`Processing ${type}: "${page.title}" (${page.id})...`);
      
      // Determine metadata properties, prioritizing database properties if present
      const rawSlug = getProperty(page.properties, "slug") || getProperty(page.properties, "Slug");
      const slug = rawSlug ? slugify(rawSlug) : slugify(page.title);
      
      const rawDescription = getProperty(page.properties, "description") || getProperty(page.properties, "Description");
      
      const rawDate = getProperty(page.properties, "date") || getProperty(page.properties, "Date") || getProperty(page.properties, "publishDate");
      const date = rawDate || page.created_time.split("T")[0];
      
      const rawLastUpdated = getProperty(page.properties, "lastUpdated") || getProperty(page.properties, "LastUpdated") || getProperty(page.properties, "last_updated");
      const lastUpdated = rawLastUpdated || page.last_edited_time.split("T")[0];
      
      const featured = getProperty(page.properties, "featured") || getProperty(page.properties, "Featured") || false;

      // Fetch markdown from Notion
      const mdblocks = await n2m.pageToMarkdown(page.id);
      let markdownContent = n2m.toMarkdownString(mdblocks).parent;

      // Extract first callout or paragraph for description if not set in properties
      let description = rawDescription || "";
      if (!description) {
        // Find first paragraph or callout block to use as description
        const textBlocks = mdblocks.filter(b => b.type === "paragraph" || b.type === "callout");
        if (textBlocks.length > 0) {
          const firstBlock = textBlocks[0];
          const rawText = firstBlock.parent || "";
          description = rawText
            .replace(/[#*`_\[\]]/g, "") // Strip simple markdown formatting
            .substring(0, 160)
            .trim();
        }
        if (!description) {
          description = `Personal knowledge reference note on ${page.title}.`;
        }
      }

      // Download images locally & rewrite URLs
      const imageRegex = /!\[(.*?)\]\((https?:\/\/.*?)\)/g;
      let match;
      let imageIndex = 1;
      const imagesToDownload = [];

      // Collect all images in the content
      while ((match = imageRegex.exec(markdownContent)) !== null) {
        const altText = match[1];
        const imageUrl = match[2];
        imagesToDownload.push({ altText, imageUrl });
      }

      for (const img of imagesToDownload) {
        try {
          const cleanUrl = img.imageUrl.split("?")[0];
          let ext = path.extname(cleanUrl) || ".png";
          if (![".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"].includes(ext.toLowerCase())) {
            ext = ".png";
          }
          const imageFilename = `${slug}-${imageIndex}${ext}`;
          const localImagePath = path.join(imagesDir, imageFilename);
          
          console.log(`Downloading image for ${slug} to ${localImagePath}...`);
          await downloadImage(img.imageUrl, localImagePath);
          
          const relativeUrl = `/content-images/${type}/${imageFilename}`;
          markdownContent = markdownContent.replace(img.imageUrl, relativeUrl);
          imageIndex++;
        } catch (imgErr) {
          console.error(`Error downloading image ${img.imageUrl}:`, imgErr.message);
        }
      }

      // Compute reading time (roughly 200 words per minute)
      const wordCount = markdownContent.split(/\s+/).filter(Boolean).length;
      const readingTime = `${Math.ceil(wordCount / 200)} min read`;

      // Generate Front Matter
      const frontMatter = `---
title: "${page.title.replace(/"/g, '\\"')}"
slug: "${slug}"
description: "${description.replace(/"/g, '\\"')}"
readingTime: "${readingTime}"
date: "${date}"
lastUpdated: "${lastUpdated}"
featured: ${featured}
---

`;

      const fullFileContent = frontMatter + markdownContent;
      const outputFilePath = path.join(outputDir, `${slug}.md`);
      
      fs.writeFileSync(outputFilePath, fullFileContent, "utf-8");
      console.log(`Saved Markdown file to ${outputFilePath}`);

      // Add to index list
      metadataList.push({
        title: page.title,
        slug,
        description,
        readingTime,
        date,
        lastUpdated,
        featured,
      });

    } catch (pageErr) {
      console.error(`Error syncing page "${page.title}":`, pageErr);
    }
  }

  return metadataList;
}

async function startSync() {
  if (!token) {
    console.error("ERROR: Cannot start sync without NOTION_TOKEN in environment.");
    process.exit(1);
  }

  console.log("Starting Notion Synchronization...");
  
  try {
    const notes = await syncType("notes", notesParentId);
    const articles = await syncType("articles", articlesParentId);

    // Sort by date descending (newest first)
    notes.sort((a, b) => new Date(b.date) - new Date(a.date));
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Save combined index
    const indexPath = path.join(projectRoot, "content", "index.json");
    fs.mkdirSync(path.dirname(indexPath), { recursive: true });
    
    fs.writeFileSync(
      indexPath,
      JSON.stringify({ notes, articles }, null, 2),
      "utf-8"
    );
    console.log(`Saved index JSON file to ${indexPath}`);
    console.log("Synchronization complete successfully!");
  } catch (err) {
    console.error("Notion synchronization failed:", err);
    process.exit(1);
  }
}

startSync();
