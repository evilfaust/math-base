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
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

export function BlogCard({ posts, index }: BlogCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const latest = posts.slice(0, 3);

  return (
    <motion.article
      initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: 0.55, delay: index * 0.06, ease: [0.22, 0.68, 0, 1] }
      }
      className="blog-card"
    >
      <div className="blog-card-inner">
        <div className="blog-card-head">
          <div className="flex flex-col gap-3">
            <span className="project-index">
              <PenIcon />
              Writing desk
            </span>
            <div>
              <h3 className="project-title">Блог и заметки</h3>
              <p className="blog-url">blog.oipav.ru</p>
            </div>
          </div>

          <span className="tag">
            {posts.length} {posts.length === 1 ? "запись" : posts.length < 5 ? "записи" : "записей"}
          </span>
        </div>

        <p className="blog-description">
          Короткие тексты о математике, преподавании и собственных инструментах,
          которые появляются вокруг основной работы.
        </p>

        {latest.length > 0 && (
          <div className="blog-list">
            {latest.map((post) => (
              <a
                key={post.slug}
                href={`https://blog.oipav.ru/${post.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="blog-list-item"
              >
                <span className="blog-list-link">{post.title}</span>
                <span className="blog-date">{formatDateShort(post.date)}</span>
              </a>
            ))}
          </div>
        )}

        <div className="blog-card-footer">
          <p className="project-description max-w-xl">
            Это не просто ссылка на внешний сайт, а вторая половина хаба:
            контекст, объяснения и то, что не помещается в карточки продуктов.
          </p>

          <div className="blog-actions">
            <a
              href="https://blog.oipav.ru"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Открыть блог"
              className="action-link action-link-primary"
            >
              Читать блог
              <ArrowIcon />
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
