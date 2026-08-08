import type { APIRoute } from "astro";
import { getPosts } from "~/lib/blog";

/**
 * Индекс для поиска по блогу. Собирается на этапе сборки и лежит статикой —
 * искать на статическом сайте больше негде, а файл настолько мал, что грузить
 * его целиком дешевле любой серверной обвязки.
 */
export const GET: APIRoute = async () => {
  const posts = await getPosts();

  const index = posts.map((post) => ({
    slug: post.id,
    title: post.data.title,
    description: post.data.description,
    category: post.data.category,
    tags: post.data.tags,
    date: post.data.date.toISOString().slice(0, 10),
    // Разметку выбрасываем: искать по «##» или «](https://…» смысла нет.
    text: (post.body ?? "")
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/[#>*_`~|-]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 4000),
  }));

  return new Response(JSON.stringify(index), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
};
