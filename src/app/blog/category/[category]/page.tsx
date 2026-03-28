import { getAllPostsMeta, getAllCategories } from "@/lib/blog";
import { PostCard } from "@/components/blog/PostCard";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateStaticParams() {
  return getAllCategories().map((c) => ({
    category: encodeURIComponent(c.name),
  }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ category: string }> }
): Promise<Metadata> {
  const { category } = await params;
  const name = decodeURIComponent(category);
  return { title: name };
}

export default async function CategoryPage(
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params;
  const name = decodeURIComponent(category);
  const all = getAllPostsMeta();
  const posts = all.filter((p) => p.category === name);
  if (posts.length === 0) notFound();

  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--blog-muted)] hover:text-[var(--blog-text)] transition-colors mb-10 group"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Все записи
      </Link>

      <div className="mb-10">
        <p className="text-xs text-[var(--blog-muted)] mb-1">Категория</p>
        <h1 className="text-2xl font-bold text-[var(--blog-text)]" style={{ fontFamily: "var(--font-archivo)" }}>
          {name}
        </h1>
        <p className="text-sm text-[var(--blog-muted)] mt-1">{posts.length} {posts.length === 1 ? "запись" : "записей"}</p>
      </div>

      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
