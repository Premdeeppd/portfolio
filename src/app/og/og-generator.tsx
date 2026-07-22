import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

// Force nodejs runtime to allow fs file reading
export const runtime = "nodejs";

let font700Data: Buffer | ArrayBuffer;
let font400Data: Buffer | ArrayBuffer;
let authorAvatarBase64: string | null = null;

try {
  font700Data = fs.readFileSync(
    path.join(process.cwd(), "node_modules/@fontsource/outfit/files/outfit-latin-700-normal.woff")
  );
  font400Data = fs.readFileSync(
    path.join(process.cwd(), "node_modules/@fontsource/outfit/files/outfit-latin-400-normal.woff")
  );
} catch (e) {
  console.error("Failed to read font files from node_modules, dynamic fetch fallback", e);
}

try {
  const avatarPath = path.join(process.cwd(), "src/assets/images/image.png");
  if (fs.existsSync(avatarPath)) {
    const avatarBuffer = fs.readFileSync(avatarPath);
    authorAvatarBase64 = `data:image/png;base64,${avatarBuffer.toString("base64")}`;
  }
} catch (e) {
  console.error("Failed to load author avatar", e);
}

interface GenerateCardOptions {
  title: string;
  description?: string;
  category: string;
}

export async function generateCardResponse({ title, description, category }: GenerateCardOptions) {
  const truncatedTitle = title.length > 85 ? title.substring(0, 82) + "..." : title;
  const truncatedDesc =
    description && description.length > 170
      ? description.substring(0, 167) + "..."
      : description || "";

  // Dynamic fallback for fonts if node_modules is not compiled/packaged on Vercel
  if (!font700Data) {
    font700Data = await fetch(
      "https://fonts.gstatic.com/s/outfit/v11/q3sR2qCPE5m2qbLPb1nGFhK0.woff"
    ).then((res) => res.arrayBuffer());
  }
  if (!font400Data) {
    font400Data = await fetch(
      "https://fonts.gstatic.com/s/outfit/v11/q3sL2qCPE5m2qbLPb1nGFhK0.woff"
    ).then((res) => res.arrayBuffer());
  }

  return new ImageResponse(
    (
      <div
        style={{
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
        }}
      >
        {/* Top Section: Category Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span
            style={{
              backgroundColor: "#0262de",
              color: "#ffffff",
              fontSize: "18px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "2px",
              padding: "8px 18px",
            }}
          >
            {category}
          </span>
        </div>

        {/* Middle Section: Title and Description */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h1
            style={{
              fontSize: truncatedTitle.length > 45 ? "44px" : "54px",
              fontWeight: 700,
              color: "#0262de",
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            {truncatedTitle}
          </h1>
          {truncatedDesc && (
            <p
              style={{
                fontSize: "24px",
                fontWeight: 400,
                color: "#334155",
                lineHeight: 1.4,
                margin: 0,
              }}
            >
              {truncatedDesc}
            </p>
          )}
        </div>

        {/* Bottom Section: Author Profile & Domain */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "3px solid #0262de",
            paddingTop: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {authorAvatarBase64 && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={authorAvatarBase64}
                alt="Prem Deep"
                style={{
                  width: "54px",
                  height: "54px",
                  objectFit: "cover",
                  border: "2px solid #0262de",
                }}
              />
            )}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#0262de",
                }}
              >
                Prem Deep
              </span>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: 400,
                  color: "#475569",
                }}
              >
                ROXC | Turing | IIT Roorkee
              </span>
            </div>
          </div>

          <span
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#0262de",
              letterSpacing: "1px",
            }}
          >
            premdeep.co.in
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Outfit",
          data: font700Data,
          weight: 700,
          style: "normal",
        },
        {
          name: "Outfit",
          data: font400Data,
          weight: 400,
          style: "normal",
        },
      ],
    }
  );
}
