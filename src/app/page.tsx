import { projects } from "@/lib/projects";
import { fetchAllRepos } from "@/lib/github";
import { ProjectGrid } from "@/components/ProjectGrid";
import Link from "next/link";

export const revalidate = 3600;

export default async function HomePage() {
  const repos = projects.map((p) => p.repo);
  const ghData = await fetchAllRepos(repos);

  const totalPublic = projects.filter((p) => p.status === "public").length;
  const totalSoon = projects.filter((p) => p.status === "soon").length;

  return (
    <>
      {/* Aurora background orbs */}
      <div className="aurora-orb aurora-1" aria-hidden="true" />
      <div className="aurora-orb aurora-2" aria-hidden="true" />
      <div className="aurora-orb aurora-3" aria-hidden="true" />

      {/* ── Nav ─────────────────────────────────────────────────── */}
      <nav className="relative z-20 max-w-5xl mx-auto px-5 sm:px-8 pt-8 flex items-center justify-between">
        <span className="text-zinc-500 text-sm font-medium tracking-tight">
          oipav<span className="text-indigo-500">.</span>ru
        </span>
        <div className="flex items-center gap-1">
          <a
            href="#projects"
            className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
          >
            Проекты
          </a>
          <a
            href="https://blog.oipav.ru"
            className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5 flex items-center gap-1"
          >
            Блог
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </a>
          <a
            href="https://github.com/evilfaust"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5 flex items-center gap-1"
          >
            GitHub
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </a>
        </div>
      </nav>

      <main className="relative z-10 min-h-screen">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-24">

          {/* ── Hero ────────────────────────────────────────────── */}
          <header className="mb-20 sm:mb-28">
            <div className="flex flex-col gap-8">

              <h1 className="text-[4.5rem] sm:text-[7rem] font-bold leading-none tracking-tighter">
                <span className="gradient-text">Projects</span>
              </h1>

              <p className="text-zinc-400 text-lg sm:text-xl max-w-lg leading-relaxed font-light">
                Учитель математики. Делаю инструменты для преподавания —
                генераторы задач, тесты, интерактивные модели.
                Всё открытое, всё здесь.
              </p>

              {/* Stats */}
              <div className="flex items-center gap-8 pt-2">
                <div>
                  <div className="text-4xl sm:text-5xl font-bold text-white tabular-nums leading-none">
                    {projects.length}
                  </div>
                  <div className="text-[0.65rem] text-zinc-600 mt-2 uppercase tracking-[0.15em]">
                    проектов
                  </div>
                </div>

                <div className="w-px h-12 bg-zinc-800" />

                <div>
                  <div className="text-4xl sm:text-5xl font-bold text-emerald-400 tabular-nums leading-none">
                    {totalPublic}
                  </div>
                  <div className="text-[0.65rem] text-zinc-600 mt-2 uppercase tracking-[0.15em]">
                    в сети
                  </div>
                </div>

                {totalSoon > 0 && (
                  <>
                    <div className="w-px h-12 bg-zinc-800" />
                    <div>
                      <div className="text-4xl sm:text-5xl font-bold text-amber-400 tabular-nums leading-none">
                        {totalSoon}
                      </div>
                      <div className="text-[0.65rem] text-zinc-600 mt-2 uppercase tracking-[0.15em]">
                        скоро
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* ── Grid ────────────────────────────────────────────── */}
          <section id="projects">
            <ProjectGrid projects={projects} ghData={ghData} />
          </section>

          {/* ── Footer ──────────────────────────────────────────── */}
          <footer className="mt-28 pt-8 border-t border-zinc-900 flex items-center justify-between">
            <span className="text-xs text-zinc-700 font-medium">
              evilfaust · {new Date().getFullYear()}
            </span>
            <div className="flex items-center gap-4">
              <a
                href="https://blog.oipav.ru"
                className="text-xs text-zinc-700 hover:text-zinc-400 transition-colors duration-200"
              >
                blog.oipav.ru
              </a>
              <a
                href="https://github.com/evilfaust"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-zinc-700 hover:text-zinc-400 transition-colors duration-200"
              >
                github.com/evilfaust
              </a>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
}
