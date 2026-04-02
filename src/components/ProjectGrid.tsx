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
  { value: "all", label: "Все" },
  { value: "public", label: "Live" },
  { value: "soon", label: "Soon" },
];

export function ProjectGrid({ projects, ghData }: ProjectGridProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const prefersReducedMotion = useReducedMotion();

  const filtered = projects.filter((p) =>
    filter === "all" ? true : p.status === filter
  );

  const sorted = [...filtered].sort((a, b) => {
    if (a.id === "pulseback") return 1;
    if (b.id === "pulseback") return -1;
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  return (
    <div className="flex flex-col gap-5">
      <nav className="filter-shell" role="group" aria-label="Фильтр проектов">
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
              className={`filter-pill ${active ? "filter-pill-active" : ""} flex items-center gap-2`}
            >
              {active && (
                <motion.span
                  layoutId="filter-pill"
                  className="filter-pill-indicator"
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { type: "spring", bounce: 0.14, duration: 0.32 }
                  }
                />
              )}
              <span className="filter-pill-label">{f.label}</span>
              <span className="filter-pill-count">{count}</span>
            </button>
          );
        })}
      </nav>

      <motion.div layout className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {sorted.map((project, i) => (
            <motion.div
              key={project.id}
              layout
              exit={prefersReducedMotion ? {} : { opacity: 0, scale: 0.97 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.22 }}
              className={project.featured ? "lg:col-span-2" : ""}
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
