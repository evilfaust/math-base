"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Project } from "@/lib/projects";
import type { GitHubRepoData } from "@/lib/github";
import { StatusBadge } from "./StatusBadge";

interface ProjectCardProps {
  project: Project;
  ghData: GitHubRepoData | null;
  index: number;
  featured?: boolean;
}

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

const languageColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  CSS: "#563d7c",
  HTML: "#e34c26",
};

function formatDate(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("ru-RU", { month: "short", year: "numeric" });
}

export function ProjectCard({ project, ghData, index, featured }: ProjectCardProps) {
  const prefersReducedMotion = useReducedMotion();

  const liveUrl = project.website ?? ghData?.homepage ?? null;
  const repoUrl = `https://github.com/${project.repo}`;
  const desc = project.description || ghData?.description || "";
  const language = ghData?.language ?? null;
  const stars = ghData?.stars ?? 0;
  const lastPush = ghData?.pushedAt ? formatDate(ghData.pushedAt) : null;
  const hasLive = liveUrl && project.status !== "soon";
  const order = String(index + 1).padStart(2, "0");

  return (
    <motion.article
      initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: 0.55, delay: index * 0.06, ease: [0.22, 0.68, 0, 1] }
      }
      className="project-card"
      style={{ "--accent-color": project.accent } as React.CSSProperties}
    >
      <div className="project-card-inner">
        <div className="project-card-head">
          <div className="flex flex-col gap-4">
            <span className="project-index">
              Project {order}
              {featured ? " / featured" : ""}
            </span>

            <div className="flex flex-col gap-3">
              {project.logo && (
                <div className="project-logo-wrap">
                  <img
                    src={project.logo}
                    alt={`${project.name} logo`}
                    className={`project-logo ${project.id === "ege-journal" ? "rounded-md" : ""}`}
                  />
                </div>
              )}

              <div>
                <h3 className="project-title">{project.name}</h3>
                <div className="project-subline">
                  <span>{project.repo.split("/")[1]}</span>
                  {lastPush && <span>обновлён {lastPush}</span>}
                  {project.hasLanding && <span>есть отдельный лендинг</span>}
                </div>
              </div>
            </div>
          </div>

          <StatusBadge status={project.status} />
        </div>

        {desc && <p className="project-description">{desc}</p>}

        {project.tags.length > 0 && (
          <div className="project-tags">
            {project.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="project-card-footer">
          <div className="project-meta">
            {language && (
              <span className="project-meta-item">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: languageColors[language] ?? "var(--text-muted)" }}
                />
                {language}
              </span>
            )}
            {stars > 0 && (
              <span className="project-meta-item">
                <StarIcon />
                {stars}
              </span>
            )}
          </div>

          <div className="project-actions">
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.name} на GitHub`}
              className="action-link"
            >
              <GitHubIcon />
              Code
            </a>

            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Demo ${project.name}`}
                className="action-link"
              >
                Demo
                <ArrowIcon />
              </a>
            )}

            {hasLive ? (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Открыть ${project.name}`}
                className="action-link action-link-primary"
              >
                Открыть
                <ArrowIcon />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
