import { getAllPostsMeta, getAllCategories } from "@/lib/blog";
import { PostCard } from "@/components/blog/PostCard";
import Link from "next/link";

export const revalidate = 3600;

function PenLineIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20h9"/>
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  );
}

export default function BlogIndex() {
  const posts = getAllPostsMeta();
  const categories = getAllCategories();

  return (
    <div className="max-w-4xl mx-auto px-5 py-12">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="mb-12 pb-10" style={{ borderBottom: "1px solid var(--blog-border)" }}>
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
          >
            <PenLineIcon />
          </div>
          <div>
            <div className="font-bold text-lg" style={{ color: "var(--blog-text)" }}>
              oipav<span className="text-indigo-500">.</span>blog
            </div>
            <div className="text-sm" style={{ color: "var(--blog-muted)" }}>oipav.ru</div>
          </div>
        </div>

        <h1
          className="text-4xl sm:text-5xl font-bold mb-3 leading-tight"
          style={{ fontFamily: "var(--font-archivo)", color: "var(--blog-text)" }}
        >
          Блог
        </h1>
        <p className="text-base leading-relaxed max-w-lg" style={{ color: "var(--blog-muted)" }}>
          Заметки о математике, преподавании и инструментах.
          {posts.length > 0 && (
            <span className="ml-2 font-medium text-indigo-500">{posts.length} {posts.length === 1 ? "запись" : posts.length < 5 ? "записи" : "записей"}</span>
          )}
        </p>
      </div>

      {/* ── Category filters ─────────────────────────────────── */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-10">
          <Link
            href="/"
            className="text-xs px-4 py-2 rounded-full font-semibold transition-colors duration-200 bg-indigo-500 text-white"
          >
            Все
          </Link>
          {categories.map((c) => (
            <Link
              key={c.name}
              href={`/category/${encodeURIComponent(c.name)}`}
              className="text-xs px-4 py-2 rounded-full font-medium transition-colors duration-200"
              style={{
                background: "var(--blog-tag-bg)",
                color: "var(--blog-muted)",
              }}
            >
              {c.name}
              <span className="ml-1.5 opacity-50">{c.count}</span>
            </Link>
          ))}
        </div>
      )}

      {/* ── Posts grid ───────────────────────────────────────── */}
      {posts.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center py-24 text-center">
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: "var(--blog-tag-bg)" }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--blog-muted)" }} aria-hidden="true">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <line x1="10" y1="9" x2="8" y2="9"/>
        </svg>
      </div>
      <p className="font-semibold text-lg mb-1" style={{ color: "var(--blog-text)" }}>
        Скоро здесь появятся статьи
      </p>
      <p className="text-sm" style={{ color: "var(--blog-muted)" }}>
        Заметки о математике, задачах и преподавании
      </p>
    </div>
  );
}
