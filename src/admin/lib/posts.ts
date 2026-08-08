/**
 * Файловый слой админки. Работает только в dev — маршруты, которые это
 * используют, подключаются в astro.config.mjs исключительно при `astro dev`.
 */
import fs from "node:fs/promises";
import path from "node:path";
import YAML from "yaml";

export const POSTS_DIR = path.resolve("src/content/posts");
export const IMAGES_DIR = path.resolve("public/images/posts");
export const IMAGES_URL_BASE = "/images/posts";

/** Поля из src/content.config.ts. Порядок влияет на вид frontmatter. */
export interface PostData {
  title: string;
  date: string; // YYYY-MM-DD
  updated?: string;
  description: string;
  category: string;
  tags: string[];
  cover?: string;
  draft: boolean;
}

export interface Post extends PostData {
  slug: string;
  body: string;
}

const SLUG_RE = /^[a-z0-9][a-z0-9-]*$/;

/**
 * Единственный барьер между HTTP-запросом и файловой системой. Slug попадает
 * в путь, поэтому проверяем его строго и дополнительно убеждаемся, что
 * итоговый путь не убежал из каталога постов.
 */
export function resolvePostPath(slug: string): string {
  if (typeof slug !== "string" || !SLUG_RE.test(slug) || slug.length > 120) {
    throw new Error(`Недопустимый slug: ${JSON.stringify(slug)}`);
  }
  const full = path.join(POSTS_DIR, `${slug}.md`);
  if (path.dirname(full) !== POSTS_DIR) {
    throw new Error("Путь выходит за пределы каталога постов");
  }
  return full;
}

const TRANSLIT: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh",
  з: "z", и: "i", й: "j", к: "k", л: "l", м: "m", н: "n", о: "o",
  п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c",
  ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu",
  я: "ya",
};

/** «Добро пожаловать» → «dobro-pozhalovat», как в уже существующих файлах. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .split("")
    .map((ch) => (ch in TRANSLIT ? TRANSLIT[ch] : ch))
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Файлы названы `YYYY-MM-DD-slug.md`, что задаёт и порядок, и URL. */
export function buildSlug(title: string, date: string): string {
  const base = slugify(title) || "zapis";
  return `${date}-${base}`;
}

function toDateString(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string") return value.slice(0, 10);
  return new Date().toISOString().slice(0, 10);
}

/** Разбор frontmatter вручную: контент-лоадер Astro в dev-эндпоинтах недоступен. */
function splitFrontmatter(raw: string): { data: Record<string, unknown>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };
  return { data: (YAML.parse(match[1]) ?? {}) as Record<string, unknown>, body: match[2] };
}

export function serialize(data: PostData, body: string): string {
  // Собираем объект по одному полю, чтобы порядок ключей был стабильным и
  // diff'ы в git оставались читаемыми.
  const fm: Record<string, unknown> = {
    title: data.title,
    date: data.date,
  };
  if (data.updated) fm.updated = data.updated;
  fm.description = data.description ?? "";
  fm.category = data.category || "Дневник";
  fm.tags = data.tags ?? [];
  if (data.cover) fm.cover = data.cover;
  fm.draft = Boolean(data.draft);

  const yaml = YAML.stringify(fm, { lineWidth: 0 }).trimEnd();
  return `---\n${yaml}\n---\n\n${body.trim()}\n`;
}

export async function listPosts(): Promise<Post[]> {
  await fs.mkdir(POSTS_DIR, { recursive: true });
  const files = (await fs.readdir(POSTS_DIR)).filter((f) => f.endsWith(".md"));

  const posts = await Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(path.join(POSTS_DIR, file), "utf8");
      const { data, body } = splitFrontmatter(raw);
      return {
        slug: file.replace(/\.md$/, ""),
        title: String(data.title ?? "Без названия"),
        date: toDateString(data.date),
        updated: data.updated ? toDateString(data.updated) : undefined,
        description: String(data.description ?? ""),
        category: String(data.category ?? "Дневник"),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        cover: data.cover ? String(data.cover) : undefined,
        draft: Boolean(data.draft),
        body,
      } satisfies Post;
    }),
  );

  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export async function readPost(slug: string): Promise<Post> {
  const file = resolvePostPath(slug);
  const raw = await fs.readFile(file, "utf8");
  const { data, body } = splitFrontmatter(raw);
  return {
    slug,
    title: String(data.title ?? ""),
    date: toDateString(data.date),
    updated: data.updated ? toDateString(data.updated) : undefined,
    description: String(data.description ?? ""),
    category: String(data.category ?? "Дневник"),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    cover: data.cover ? String(data.cover) : undefined,
    draft: Boolean(data.draft),
    body,
  };
}

export async function writePost(
  slug: string,
  data: PostData,
  body: string,
  previousSlug?: string,
): Promise<void> {
  const file = resolvePostPath(slug);
  await fs.mkdir(POSTS_DIR, { recursive: true });

  // Переименование: пишем под новым именем и убираем старый файл, но только
  // если новое имя ещё не занято другой записью.
  if (previousSlug && previousSlug !== slug) {
    const exists = await fs
      .access(file)
      .then(() => true)
      .catch(() => false);
    if (exists) {
      throw new Error(`Запись с адресом «${slug}» уже существует`);
    }
    await fs.writeFile(file, serialize(data, body), "utf8");
    await fs.rm(resolvePostPath(previousSlug), { force: true });
    return;
  }

  await fs.writeFile(file, serialize(data, body), "utf8");
}

export async function deletePost(slug: string): Promise<void> {
  await fs.rm(resolvePostPath(slug), { force: true });
}
