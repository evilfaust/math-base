import Link from "next/link";
import type { PostMeta } from "@/lib/blog";

/* ─── Category styling ──────────────────────────────────────── */
const CATEGORY_STYLES: Record<string, { from: string; to: string; symbol: string }> = {
  "Математика":   { from: "#6366f1", to: "#4338ca", symbol: "π" },
  "Преподавание": { from: "#10b981", to: "#047857", symbol: "∑" },
  "ЕГЭ":          { from: "#ec4899", to: "#be185d", symbol: "✓" },
  "Инструменты":  { from: "#f59e0b", to: "#b45309", symbol: "∞" },
  "Геометрия":    { from: "#8b5cf6", to: "#6d28d9", symbol: "△" },
  "Алгебра":      { from: "#3b82f6", to: "#1d4ed8", symbol: "x²" },
  "Задачи":       { from: "#14b8a6", to: "#0f766e", symbol: "≡" },
};
const DEFAULT_STYLE = { from: "#8b5cf6", to: "#6d28d9", symbol: "∂" };

function getStyle(category: string) {
  return CATEGORY_STYLES[category] ?? DEFAULT_STYLE;
}

/* ─── Helpers ───────────────────────────────────────────────── */
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function extractMins(readingTime: string): string {
  const m = readingTime.match(/(\d+)/);
  return m ? m[1] : "—";
}

/* ─── Component ─────────────────────────────────────────────── */
export function PostCard({ post }: { post: PostMeta }) {
  const style = getStyle(post.category);
  const mins = extractMins(post.readingTime);

  return (
    <article
      className="overflow-hidden flex flex-col"
      style={{
        background: "var(--blog-card-bg)",
        borderRadius: "19px",
        boxShadow: "-1px 12px 28px -10px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.06)",
      }}
    >
      {/* ── Header: colored gradient area ───────────────────── */}
      <Link href={`/${post.slug}`} className="block relative h-36 overflow-hidden select-none">
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${style.from} 0%, ${style.to} 100%)` }}
        />
        {/* Decorative math symbol */}
        <span
          aria-hidden="true"
          className="absolute bottom-1 right-4 font-black text-white leading-none select-none pointer-events-none"
          style={{ fontSize: "5.5rem", opacity: 0.15 }}
        >
          {style.symbol}
        </span>
        {/* Category badge */}
        <span
          className="absolute top-4 left-4 text-xs font-bold uppercase tracking-wider text-white/90 px-2.5 py-1 rounded-full"
          style={{ background: "rgba(0,0,0,0.22)", backdropFilter: "blur(6px)" }}
        >
          {post.category}
        </span>
      </Link>

      {/* ── Body ────────────────────────────────────────────── */}
      <div className="px-5 pt-5 pb-4 flex flex-col flex-1">
        <Link href={`/${post.slug}`} className="block group flex-1">
          <h2
            className="text-[1.05rem] font-bold leading-snug mb-2 transition-colors duration-200 group-hover:text-indigo-500"
            style={{ color: "var(--blog-text)" }}
          >
            {post.title}
          </h2>
          {post.description && (
            <p
              className="text-sm leading-relaxed line-clamp-2"
              style={{ color: "var(--blog-muted)" }}
            >
              {post.description}
            </p>
          )}
        </Link>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                href={`/tag/${encodeURIComponent(tag)}`}
                className="post-tag"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ── Stats bar (clash-card style) ─────────────────────── */}
      <div
        className="flex items-stretch rounded-b-[19px] overflow-hidden"
        style={{ background: style.from }}
      >
        <div className="flex-1 px-4 py-3 text-center">
          <div className="text-white font-semibold text-sm leading-tight">{formatDate(post.date)}</div>
          <div className="text-white/60 text-[0.65rem] uppercase tracking-wider mt-0.5">Дата</div>
        </div>
        <div className="w-px" style={{ background: "rgba(255,255,255,0.2)" }} />
        <div className="flex-1 px-4 py-3 text-center">
          <div className="text-white font-semibold text-sm leading-tight">{mins}<sup className="text-[0.5rem] ml-0.5 opacity-70">мин</sup></div>
          <div className="text-white/60 text-[0.65rem] uppercase tracking-wider mt-0.5">Чтение</div>
        </div>
        <div className="w-px" style={{ background: "rgba(255,255,255,0.2)" }} />
        <div className="flex-1 px-4 py-3 text-center">
          <div className="text-white font-semibold text-sm leading-tight">{post.tags.length || "—"}</div>
          <div className="text-white/60 text-[0.65rem] uppercase tracking-wider mt-0.5">Тегов</div>
        </div>
      </div>
    </article>
  );
}
