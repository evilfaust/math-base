import Link from "next/link";
import type { PostMeta } from "@/lib/blog";

function formatDateRu(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group py-7 border-b border-[var(--blog-border)] last:border-0">
      <div className="flex items-center gap-2 mb-2 text-xs text-[var(--blog-muted)]">
        <Link
          href={`/category/${encodeURIComponent(post.category)}`}
          className="hover:text-indigo-500 transition-colors"
        >
          {post.category}
        </Link>
        <span>·</span>
        <time dateTime={post.date}>{formatDateRu(post.date)}</time>
        <span>·</span>
        <span>{post.readingTime}</span>
      </div>

      <Link href={`/${post.slug}`} className="block">
        <h2 className="text-lg font-semibold text-[var(--blog-text)] group-hover:text-indigo-500 transition-colors leading-snug mb-1.5">
          {post.title}
        </h2>
        {post.description && (
          <p className="text-sm text-[var(--blog-muted)] leading-relaxed line-clamp-2">
            {post.description}
          </p>
        )}
      </Link>

      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tag/${encodeURIComponent(tag)}`}
              className="text-xs px-2 py-0.5 rounded-full bg-[var(--blog-tag-bg)] text-[var(--blog-muted)] hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
