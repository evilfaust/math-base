import type { APIRoute } from "astro";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { IMAGES_DIR, IMAGES_URL_BASE, slugify } from "../lib/posts";

export const prerender = false;

const MAX_BYTES = 20 * 1024 * 1024;
/** Ровно те форматы, которые умеет декодировать sharp и понимает браузер. */
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);

export const POST: APIRoute = async ({ request }) => {
  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return json({ error: "Файл не получен" }, 400);
    }
    if (!ALLOWED.has(file.type)) {
      return json({ error: `Неподдерживаемый тип: ${file.type || "неизвестен"}` }, 400);
    }
    if (file.size > MAX_BYTES) {
      return json({ error: "Файл больше 20 МБ" }, 400);
    }

    await fs.mkdir(IMAGES_DIR, { recursive: true });

    const input = Buffer.from(await file.arrayBuffer());
    const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "image";

    // Пережимаем в webp: картинки из телефона весят по несколько мегабайт, а
    // блог статический — всё, что попало в public/, уезжает на VPS как есть.
    // Анимированные gif пропускаем без изменений, иначе анимация потеряется.
    let data: Buffer;
    let ext: string;
    if (file.type === "image/gif") {
      data = input;
      ext = "gif";
    } else {
      data = await sharp(input)
        .rotate() // учитываем EXIF-ориентацию, иначе фото с телефона лягут боком
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();
      ext = "webp";
    }

    const name = await uniqueName(base, ext);
    await fs.writeFile(path.join(IMAGES_DIR, name), data);

    const meta = await sharp(data).metadata().catch(() => null);
    return json({
      url: `${IMAGES_URL_BASE}/${name}`,
      width: meta?.width ?? null,
      height: meta?.height ?? null,
      bytes: data.byteLength,
    });
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : String(err) }, 500);
  }
};

/** Не затираем уже загруженные картинки с тем же именем. */
async function uniqueName(base: string, ext: string): Promise<string> {
  for (let i = 0; i < 500; i++) {
    const name = i === 0 ? `${base}.${ext}` : `${base}-${i}.${ext}`;
    const taken = await fs
      .access(path.join(IMAGES_DIR, name))
      .then(() => true)
      .catch(() => false);
    if (!taken) return name;
  }
  return `${base}-${Date.now()}.${ext}`;
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
