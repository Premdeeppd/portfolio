import fs from "fs";
import path from "path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const contentIndex = JSON.parse(
  fs.readFileSync(path.resolve("content/index.json"), "utf8")
);

// Load fonts
const font700Path = path.resolve(
  "node_modules/@fontsource/outfit/files/outfit-latin-700-normal.woff"
);
const font400Path = path.resolve(
  "node_modules/@fontsource/outfit/files/outfit-latin-400-normal.woff"
);
const font700Data = fs.readFileSync(font700Path);
const font400Data = fs.readFileSync(font400Path);

// Base64 author image if available
let authorAvatarBase64 = null;
const authorImgPath = path.resolve("src/assets/images/image.png");
if (fs.existsSync(authorImgPath)) {
  const imgBuffer = fs.readFileSync(authorImgPath);
  authorAvatarBase64 = `data:image/png;base64,${imgBuffer.toString("base64")}`;
}

async function generateCard({ title, description, category, outputPath }) {
  const truncatedTitle =
    title.length > 70 ? title.substring(0, 67) + "..." : title;
  const truncatedDesc =
    description && description.length > 140
      ? description.substring(0, 137) + "..."
      : description || "";

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#ffe3d0", // Brand Peach
          padding: "60px 70px",
          fontFamily: "Outfit, sans-serif",
          boxSizing: "border-box",
          border: "16px solid #0262de", // Brand Blue frame
        },
        children: [
          // Top section: Category Badge
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                alignItems: "center",
                gap: "12px",
              },
              children: [
                {
                  type: "span",
                  props: {
                    style: {
                      backgroundColor: "#0262de",
                      color: "#ffffff",
                      fontSize: "18px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                      padding: "8px 18px",
                    },
                    children: category,
                  },
                },
              ],
            },
          },
          // Middle section: Title and Description
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              },
              children: [
                {
                  type: "h1",
                  props: {
                    style: {
                      fontSize: truncatedTitle.length > 45 ? "44px" : "54px",
                      fontWeight: 700,
                      color: "#0262de",
                      lineHeight: 1.15,
                      margin: 0,
                    },
                    children: truncatedTitle,
                  },
                },
                truncatedDesc
                  ? {
                      type: "p",
                      props: {
                        style: {
                          fontSize: "24px",
                          fontWeight: 400,
                          color: "#334155",
                          lineHeight: 1.4,
                          margin: 0,
                        },
                        children: truncatedDesc,
                      },
                    }
                  : null,
              ].filter(Boolean),
            },
          },
          // Bottom section: Author Profile & Domain
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderTop: "3px solid #0262de",
                paddingTop: "24px",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    },
                    children: [
                      authorAvatarBase64
                        ? {
                            type: "img",
                            props: {
                              src: authorAvatarBase64,
                              style: {
                                width: "54px",
                                height: "54px",
                                objectFit: "cover",
                                border: "2px solid #0262de",
                              },
                            },
                          }
                        : null,
                      {
                        type: "div",
                        props: {
                          style: {
                            display: "flex",
                            flexDirection: "column",
                          },
                          children: [
                            {
                              type: "span",
                              props: {
                                style: {
                                  fontSize: "22px",
                                  fontWeight: 700,
                                  color: "#0262de",
                                },
                                children: "Prem Deep",
                              },
                            },
                            {
                              type: "span",
                              props: {
                                style: {
                                  fontSize: "16px",
                                  fontWeight: 400,
                                  color: "#475569",
                                },
                                children: "ROXC | Turing | IIT Roorkee",
                              },
                            },
                          ],
                        },
                      },
                    ].filter(Boolean),
                  },
                },
                {
                  type: "span",
                  props: {
                    style: {
                      fontSize: "20px",
                      fontWeight: 700,
                      color: "#0262de",
                      letterSpacing: "1px",
                    },
                    children: "premdeep.co.in",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Outfit", data: font700Data, weight: 700, style: "normal" },
        { name: "Outfit", data: font400Data, weight: 400, style: "normal" },
      ],
    }
  );

  const resvg = new Resvg(svg);
  const pngData = resvg.render().asPng();

  const fullPath = path.resolve(outputPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, pngData);
}

async function run() {
  console.log("🎨 Generating dynamic OG cards...");

  // 1. Home card
  await generateCard({
    title: "Prem - Portfolio, articles, and notes",
    description:
      "Full-stack software engineer writing articles and notes on software engineering, web architecture, and algorithms.",
    category: "Portfolio",
    outputPath: "public/og/home.png",
  });

  // 2. Read with me card
  await generateCard({
    title: "Learn with Me - Notes & Articles",
    description:
      "A collection of structured notes, deep dives, and articles on full-stack development, cloud, and databases.",
    category: "Learn with Me",
    outputPath: "public/og/read-with-me.png",
  });

  // 3. Notes cards
  for (const note of contentIndex.notes || []) {
    await generateCard({
      title: note.title,
      description: note.description,
      category: "Note",
      outputPath: `public/og/notes/${note.slug}.png`,
    });
  }

  // 4. Articles cards
  for (const article of contentIndex.articles || []) {
    await generateCard({
      title: article.title,
      description: article.description,
      category: "Article",
      outputPath: `public/og/articles/${article.slug}.png`,
    });
  }

  console.log("✨ Successfully generated all OG cards in public/og!");
}

run().catch((err) => {
  console.error("❌ Error generating OG cards:", err);
  process.exit(1);
});
