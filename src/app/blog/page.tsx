import { getAllPostsMeta, getAllCategories } from "@/lib/blog";
import { PostCard } from "@/components/blog/PostCard";
import Link from "next/link";

export const revalidate = 3600;

export default function BlogIndex() {
  const posts = getAllPostsMeta();
  const categories = getAllCategories();

  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      {/* Hero */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[var(--blog-text)] mb-2" style={{ fontFamily: "var(--font-archivo)" }}>
          Блог
        </h1>
        <p className="text-[var(--blog-muted)] text-sm">
          Заметки о математике, преподавании и инструментах
        </p>
      </div>

      {/* Categories */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href="/"
            className="text-xs px-3 py-1.5 rounded-full bg-indigo-500 text-white font-medium"
          >
            Все
          </Link>
          {categories.map((c) => (
            <Link
              key={c.name}
              href={`/category/${encodeURIComponent(c.name)}`}
              className="text-xs px-3 py-1.5 rounded-full bg-[var(--blog-tag-bg)] text-[var(--blog-muted)] hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-500 transition-colors"
            >
              {c.name}
              <span className="ml-1 opacity-50">{c.count}</span>
            </Link>
          ))}
        </div>
      )}

      {/* Posts */}
      {posts.length === 0 ? (
        <p className="text-[var(--blog-muted)] text-sm py-12 text-center">Постов пока нет</p>
      ) : (
        <div>
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
