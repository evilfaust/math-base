"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { Project } from "@/lib/projects";
import type { GitHubRepoData } from "@/lib/github";
import { ProjectCard } from "./ProjectCard";

type Filter = "all" | "public" | "soon";

interface ProjectGridProps {
  projects: Project[];
  ghData: Record<string, GitHubRepoData | null>;
}

const filters: { value: Filter; label: string }[] = [
  { value: "all",    label: "Все"   },
  { value: "public", label: "Live"  },
  { value: "soon",   label: "Скоро" },
];

export function ProjectGrid({ projects, ghData }: ProjectGridProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const prefersReducedMotion = useReducedMotion();

  const filtered = projects.filter((p) =>
    filter === "all" ? true : p.status === filter
  );

  const sorted = [...filtered].sort(
    (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
  );

  return (
    <div className="flex flex-col gap-8">

      {/* ── Filter tabs ──────────────────────────────────────── */}
      <nav
        className="flex items-center gap-1 p-1 w-fit rounded-xl"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
        }}
        role="group"
        aria-label="Фильтр проектов"
      >
        {filters.map((f) => {
          const count =
            f.value === "all"
              ? projects.length
              : projects.filter((p) => p.status === f.value).length;
          const active = filter === f.value;

          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              aria-pressed={active}
              className="relative cursor-pointer px-4 py-2 text-sm rounded-lg transition-colors duration-200 min-h-[40px] flex items-center gap-2"
              style={{ color: active ? "var(--text-primary)" : "var(--text-muted)" }}
            >
              {active && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: "var(--filter-pill-bg)",
                    border: "1px solid var(--filter-pill-border)",
                  }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { type: "spring", bounce: 0.18, duration: 0.35 }
                  }
                />
              )}
              <span className="relative z-10">{f.label}</span>
              <span
                className="relative z-10 text-xs tabular-nums"
                style={{ color: "var(--text-muted)" }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ── Grid ─────────────────────────────────────────────── */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {sorted.map((project, i) => (
            <motion.div
              key={project.id}
              layout
              exit={prefersReducedMotion ? {} : { opacity: 0, scale: 0.96 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.22 }}
              className={project.featured ? "md:col-span-2 lg:col-span-1" : ""}
            >
              <ProjectCard
                project={project}
                ghData={ghData[project.repo] ?? null}
                index={i}
                featured={project.featured}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
