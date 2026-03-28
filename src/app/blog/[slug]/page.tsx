import { getPost, getAllPostsMeta } from "@/lib/blog";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateStaticParams() {
  return getAllPostsMeta().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.description };
}

function formatDateRu(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default async function PostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--blog-muted)] hover:text-[var(--blog-text)] transition-colors mb-10 group"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Все записи
      </Link>

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-4 text-xs text-[var(--blog-muted)]">
          <Link
            href={`/category/${encodeURIComponent(post.category)}`}
            className="hover:text-indigo-500 transition-colors"
          >
            {post.category}
          </Link>
          <span>·</span>
          <time dateTime={post.date}>{formatDateRu(post.date)}</time>
          {post.updated && (
            <>
              <span>·</span>
              <span>обновлено {formatDateRu(post.updated)}</span>
            </>
          )}
          <span>·</span>
          <span>{post.readingTime}</span>
        </div>

        <h1
          className="text-3xl font-bold text-[var(--blog-text)] leading-tight mb-4"
          style={{ fontFamily: "var(--font-archivo)" }}
        >
          {post.title}
        </h1>

        {post.description && (
          <p className="text-[var(--blog-muted)] text-base leading-relaxed">
            {post.description}
          </p>
        )}
      </header>

      {/* Cover */}
      {post.cover && (
        <img
          src={post.cover}
          alt={post.title}
          className="w-full rounded-xl mb-10 object-cover max-h-80"
        />
      )}

      {/* Content */}
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-[var(--blog-border)]">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tag/${encodeURIComponent(tag)}`}
              className="text-xs px-2.5 py-1 rounded-full bg-[var(--blog-tag-bg)] text-[var(--blog-muted)] hover:text-indigo-500 transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
