import { getCollection, type CollectionEntry } from "astro:content";
import { slugify } from "./slug";

export type Post = CollectionEntry<"posts">;

/** Опубликованные записи, новые сверху. Черновики не покидают админку. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  return posts.sort((a, b) => +b.data.date - +a.data.date);
}

export interface Facet {
  /** То, как значение написано в frontmatter — его и показываем. */
  name: string;
  /** Транслитерированный вариант для адреса страницы. */
  slug: string;
  count: number;
}

function tally(values: string[]): Facet[] {
  const byslug = new Map<string, Facet>();
  for (const raw of values) {
    const name = raw.trim();
    if (!name) continue;
    const slug = slugify(name);
    if (!slug) continue;
    const existing = byslug.get(slug);
    if (existing) existing.count++;
    else byslug.set(slug, { name, slug, count: 1 });
  }
  return [...byslug.values()].sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name, "ru"),
  );
}

export const collectTags = (posts: Post[]): Facet[] =>
  tally(posts.flatMap((p) => p.data.tags));

export const collectCategories = (posts: Post[]): Facet[] =>
  tally(posts.map((p) => p.data.category));

export const tagUrl = (tag: string) => `/blog/tag/${slugify(tag)}`;
export const categoryUrl = (category: string) => `/blog/category/${slugify(category)}`;

export const fmtDate = (d: Date) =>
  d.toLocaleDateString("ru-RU", { year: "numeric", month: "long", day: "numeric" });

export const fmtDateShort = (d: Date) =>
  d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
