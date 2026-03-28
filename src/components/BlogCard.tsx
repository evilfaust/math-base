"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { PostMeta } from "@/lib/blog";

interface BlogCardProps {
  posts: PostMeta[];
  index: number;
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
  );
}

function PenIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  );
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

export function BlogCard({ posts, index }: BlogCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const accent = "#a78bfa";
  const latest = posts.slice(0, 3);

  return (
    <motion.article
      initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: 0.55, delay: index * 0.07, ease: [0.22, 0.68, 0, 1] }
      }
      className="card flex flex-col gap-5 p-6 h-full"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      {/* Top row */}
      <div className="flex items-center justify-between pt-1">
        <span className="flex items-center gap-1.5 text-xs font-medium text-violet-400">
          <PenIcon />
          Блог
        </span>
        <span className="text-[0.6rem] font-semibold tracking-[0.12em] uppercase px-2 py-0.5 rounded-full border"
          style={{
            color: accent,
            borderColor: `color-mix(in srgb, ${accent} 30%, transparent)`,
            background: `color-mix(in srgb, ${accent} 8%, transparent)`,
          }}
        >
          {posts.length} {posts.length === 1 ? "запись" : posts.length < 5 ? "записи" : "записей"}
        </span>
      </div>

      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white leading-tight">
          oipav<span style={{ color: accent }}>.</span>blog
        </h2>
        <p className="text-xs text-zinc-600 mt-0.5">blog.oipav.ru</p>
      </div>

      {/* Description */}
      <p className="text-sm text-zinc-400 leading-[1.65]">
        Заметки о математике, преподавании и инструментах.
      </p>

      {/* Latest posts */}
      {latest.length > 0 && (
        <div className="flex flex-col gap-2 flex-1">
          {latest.map((post) => (
            <a
              key={post.slug}
              href={`https://blog.oipav.ru/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start justify-between gap-3 group cursor-pointer"
            >
              <span className="text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors leading-snug line-clamp-1">
                {post.title}
              </span>
              <span className="text-xs text-zinc-700 shrink-0 mt-0.5">
                {formatDateShort(post.date)}
              </span>
            </a>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-end pt-1 mt-auto">
        <a
          href="https://blog.oipav.ru"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Открыть блог"
          className="cursor-pointer flex items-center gap-1.5 text-xs font-medium px-3 py-2 min-h-[40px] rounded-lg transition-all duration-200"
          style={{
            color: accent,
            background: `color-mix(in srgb, ${accent} 10%, transparent)`,
            border: `1px solid color-mix(in srgb, ${accent} 20%, transparent)`,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              `color-mix(in srgb, ${accent} 18%, transparent)`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              `color-mix(in srgb, ${accent} 10%, transparent)`;
          }}
        >
          Читать
          <ArrowIcon />
        </a>
      </div>
    </motion.article>
  );
}
