import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

/**
 * Единственное описание markdown-пайплайна. Его импортируют astro.config.mjs
 * (сборка сайта) и эндпоинт предпросмотра в админке, поэтому превью не может
 * разойтись с тем, что реально попадёт на страницу.
 *
 * Аннотация обязательна: без неё TypeScript расширяет пару
 * `[плагин, опции]` до массива-объединения, и конфиг перестаёт подходить
 * createMarkdownProcessor.
 *
 * @type {Partial<import('@astrojs/markdown-remark').AstroMarkdownOptions>}
 */
export const markdownConfig = {
  remarkPlugins: [remarkMath],
  rehypePlugins: [
    rehypeSlug,
    [rehypeAutolinkHeadings, { behavior: "wrap" }],
    rehypeKatex,
  ],
  shikiConfig: {
    theme: "github-dark-dimmed",
    wrap: true,
  },
};
