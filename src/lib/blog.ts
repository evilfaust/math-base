import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { remark } from "remark";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeStringify from "rehype-stringify";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  updated?: string;
  description: string;
  category: string;
  tags: string[];
  cover?: string;
  published: boolean;
  readingTime: string;
}

export interface Post extends PostMeta {
  content: string;
}

function slugFromFilename(filename: string): string {
  // Remove date prefix if present: 2026-03-28-my-post.md → my-post
  return filename.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.md$/, "");
}

function formatDate(raw: string | Date): string {
  const d = typeof raw === "string" ? new Date(raw) : raw;
  return d.toISOString().split("T")[0];
}

export function getAllPostsMeta(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));

  const posts = files
    .map((filename) => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf-8");
      const { data, content } = matter(raw);

      if (!data.published) return null;

      return {
        slug: slugFromFilename(filename),
        title: data.title ?? "Без названия",
        date: formatDate(data.date),
        updated: data.updated ? formatDate(data.updated) : undefined,
        description: data.description ?? "",
        category: data.category ?? "Дневник",
        tags: data.tags ?? [],
        cover: data.cover,
        published: true,
        readingTime: readingTime(content).text.replace("min read", "мин"),
      } as PostMeta;
    })
    .filter(Boolean) as PostMeta[];

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPost(slug: string): Promise<Post | null> {
  if (!fs.existsSync(POSTS_DIR)) return null;

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  const filename = files.find((f) => slugFromFilename(f) === slug);
  if (!filename) return null;

  const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf-8");
  const { data, content } = matter(raw);

  if (!data.published) return null;

  const processed = await remark()
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeKatex)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: "wrap" })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  return {
    slug,
    title: data.title ?? "Без названия",
    date: formatDate(data.date),
    updated: data.updated ? formatDate(data.updated) : undefined,
    description: data.description ?? "",
    category: data.category ?? "Дневник",
    tags: data.tags ?? [],
    cover: data.cover,
    published: true,
    readingTime: readingTime(content).text.replace("min read", "мин"),
    content: processed.toString(),
  };
}

export function getAllCategories(): { name: string; count: number }[] {
  const posts = getAllPostsMeta();
  const counts: Record<string, number> = {};
  for (const p of posts) {
    counts[p.category] = (counts[p.category] ?? 0) + 1;
  }
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getAllTags(): { name: string; count: number }[] {
  const posts = getAllPostsMeta();
  const counts: Record<string, number> = {};
  for (const p of posts) {
    for (const tag of p.tags) {
      counts[tag] = (counts[tag] ?? 0) + 1;
    }
  }
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}
