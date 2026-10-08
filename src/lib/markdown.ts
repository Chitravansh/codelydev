import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: false });

export type CoverKey = "cyan" | "teal" | "navy" | "ocean" | "glacier" | "mint";

export interface Frontmatter {
  title?: string;
  excerpt?: string;
  description?: string;
  date?: string;
  tags?: string[];
  author?: string;
  cover?: CoverKey;
  featured?: boolean;
  type?: string;
  price?: number;
  [key: string]: unknown;
}

/**
 * Minimal, dependency-free frontmatter parser.
 * Supports: `key: value`, `key: [a, b, c]`, `key: true|false`, `key: 12`.
 */
export function parseFrontmatter(raw: string): {
  data: Frontmatter;
  content: string;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { data: {}, content: raw };

  const data: Frontmatter = {};
  const body = match[1];

  for (const line of body.split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const sep = line.indexOf(":");
    if (sep === -1) continue;

    const key = line.slice(0, sep).trim();
    const value = line.slice(sep + 1).trim();
    if (!key) continue;

    if (value.startsWith("[") && value.endsWith("]")) {
      data[key] = value
        .slice(1, -1)
        .split(",")
        .map((v) => v.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else if (value === "true" || value === "false") {
      data[key] = value === "true";
    } else if (value !== "" && !Number.isNaN(Number(value)) && /^-?\d+(\.\d+)?$/.test(value)) {
      data[key] = Number(value);
    } else {
      data[key] = value.replace(/^["']|["']$/g, "");
    }
  }

  return { data, content: raw.slice(match[0].length) };
}

export function renderMarkdown(markdown: string): string {
  const html = marked.parse(markdown, { async: false });
  return html as string;
}

export function readingTime(markdown: string): number {
  const words = markdown.replace(/```[\s\S]*?```/g, " ").trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}
