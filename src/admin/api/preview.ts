import type { APIRoute } from "astro";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import { markdownConfig } from "../../lib/markdown.mjs";

export const prerender = false;

/**
 * Процессор поднимает Shiki, что занимает заметное время, поэтому создаём его
 * один раз на весь процесс dev-сервера.
 */
let processorPromise: ReturnType<typeof createMarkdownProcessor> | null = null;
const getProcessor = () => (processorPromise ??= createMarkdownProcessor(markdownConfig));

export const POST: APIRoute = async ({ request }) => {
  try {
    const { body } = (await request.json()) as { body?: string };
    const processor = await getProcessor();
    const { code } = await processor.render(body ?? "");
    return new Response(JSON.stringify({ html: code }), {
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  } catch (err) {
    // Незакрытая формула или битый синтаксис не должны рушить редактор —
    // возвращаем текст ошибки, редактор покажет её вместо превью.
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 200, headers: { "content-type": "application/json; charset=utf-8" } },
    );
  }
};
