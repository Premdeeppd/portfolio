const cleanMarkdown = (str: string): string => {
  return str
    .replace(/`([^`]+)`/g, "$1")            // code `text` -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links [text](url) -> text
    .replace(/(\*\*|__)(.*?)\1/g, "$2")      // bold **text** -> text
    .replace(/(\*|_)(.*?)\1/g, "$2")        // italic *text* -> text
    .replace(/~~(.*?)~~/g, "$1")            // strikethrough ~~text~~ -> text
    .trim();
};

export interface HeadingItem {
  level: number;
  text: string;
  id: string;
}

/**
 * Parses markdown content and extracts headings (H1-H6), skipping any headings
 * or comments starting with '#' inside fenced code blocks (``` or ~~~).
 */
export const parseHeadings = (markdown: string): HeadingItem[] => {
  if (!markdown) return [];

  const lines = markdown.split(/\r?\n/);
  const headings: HeadingItem[] = [];
  let inCodeBlock = false;
  let codeFenceChar = "";
  let codeFenceLen = 0;

  for (const line of lines) {
    // Check for fenced code block start/end (e.g. ``` or ~~~, optionally indented)
    const fenceMatch = line.match(/^(\s*)(`{3,}|~{3,})/);
    
    if (fenceMatch) {
      const fenceStr = fenceMatch[2];
      const char = fenceStr[0];
      const len = fenceStr.length;

      if (!inCodeBlock) {
        inCodeBlock = true;
        codeFenceChar = char;
        codeFenceLen = len;
      } else {
        // Closing fence must match the character and be at least as long as the opening fence
        if (char === codeFenceChar && len >= codeFenceLen) {
          inCodeBlock = false;
          codeFenceChar = "";
          codeFenceLen = 0;
        }
      }
      continue;
    }

    if (inCodeBlock) {
      continue;
    }

    // Match ATX headings: # to ###### followed by whitespace and text
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const rawText = headingMatch[2].trim();
      const text = cleanMarkdown(rawText);
      const id = text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-");
      headings.push({ level, text, id });
    }
  }

  return headings;
};
