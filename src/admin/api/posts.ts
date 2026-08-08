import type { APIRoute } from "astro";
import {
  buildSlug,
  deletePost,
  listPosts,
  readPost,
  writePost,
  type PostData,
} from "../lib/posts";

export const prerender = false;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

const fail = (err: unknown, status = 400) =>
  json({ error: err instanceof Error ? err.message : String(err) }, status);

/** GET /api/admin/posts → список; ?slug=… → одна запись целиком. */
export const GET: APIRoute = async ({ url }) => {
  try {
    const slug = url.searchParams.get("slug");
    if (slug) return json(await readPost(slug));

    const posts = await listPosts();
    return json({
      posts: posts.map(({ body, ...meta }) => meta),
      // Подсказки для полей: показываем то, что уже используется в блоге,
      // чтобы теги и категории не размножались опечатками.
      categories: [...new Set(posts.map((p) => p.category))].sort(),
      tags: [...new Set(posts.flatMap((p) => p.tags))].sort(),
    });
  } catch (err) {
    return fail(err, 404);
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const payload = (await request.json()) as {
      slug?: string;
      previousSlug?: string;
      data: PostData;
      body: string;
    };

    const data = payload.data;
    if (!data?.title?.trim()) return fail("Заголовок не может быть пустым");

    const date = (data.date || new Date().toISOString().slice(0, 10)).slice(0, 10);
    const slug = payload.slug?.trim() || buildSlug(data.title, date);

    await writePost(
      slug,
      {
        ...data,
        date,
        title: data.title.trim(),
        description: (data.description ?? "").trim(),
        category: (data.category || "Дневник").trim(),
        tags: (data.tags ?? []).map((t) => t.trim()).filter(Boolean),
        cover: data.cover?.trim() || undefined,
        draft: Boolean(data.draft),
      },
      payload.body ?? "",
      payload.previousSlug,
    );

    return json({ ok: true, slug });
  } catch (err) {
    return fail(err);
  }
};

export const DELETE: APIRoute = async ({ url }) => {
  try {
    const slug = url.searchParams.get("slug");
    if (!slug) return fail("Не указан slug");
    await deletePost(slug);
    return json({ ok: true });
  } catch (err) {
    return fail(err);
  }
};
