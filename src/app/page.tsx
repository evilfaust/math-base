import { projects } from "@/lib/projects";
import { fetchAllRepos } from "@/lib/github";
import { ProjectGrid } from "@/components/ProjectGrid";

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

      <main className="relative z-10 min-h-screen">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-20 sm:py-32">

          {/* ── Hero ────────────────────────────────────────────── */}
          <header className="mb-20 sm:mb-28">
            <div className="flex flex-col gap-8">

              <p className="text-indigo-400/70 text-xs font-semibold tracking-[0.25em] uppercase">
                evilfaust
              </p>

              <h1 className="text-[5rem] sm:text-[7.5rem] font-bold leading-none tracking-tighter">
                <span className="gradient-text">Projects</span>
              </h1>

              <p className="text-zinc-400 text-lg sm:text-xl max-w-md leading-relaxed font-light">
                Всё что я делаю — в одном месте.
                <br />
                Образование, инструменты, сервисы.
              </p>

              {/* Stats */}
              <div className="flex items-center gap-8 pt-4">
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
          <ProjectGrid projects={projects} ghData={ghData} />

          {/* ── Footer ──────────────────────────────────────────── */}
          <footer className="mt-28 pt-8 border-t border-zinc-900 flex items-center justify-between">
            <span className="text-xs text-zinc-700 font-medium">
              evilfaust
            </span>
            <a
              href="https://github.com/evilfaust"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-700 hover:text-zinc-400 transition-colors duration-200 cursor-pointer"
            >
              github.com/evilfaust
            </a>
          </footer>
        </div>
      </main>
    </>
  );
}
