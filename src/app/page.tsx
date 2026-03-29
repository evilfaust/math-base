import { projects } from "@/lib/projects";
import { fetchAllRepos } from "@/lib/github";
import { getAllPostsMeta } from "@/lib/blog";
import { ProjectGrid } from "@/components/ProjectGrid";
import { BlogCard } from "@/components/BlogCard";
import { ThemeToggle } from "@/components/ThemeToggle";

export const revalidate = 3600;

function ExternalArrow() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
  );
}

export default async function HomePage() {
  const repos = projects.map((p) => p.repo);
  const [ghData, blogPosts] = await Promise.all([
    fetchAllRepos(repos),
    Promise.resolve(getAllPostsMeta()),
  ]);

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
        <span
          className="text-sm font-semibold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          oipav<span className="text-indigo-500">.</span>ru
        </span>

        <div
          className="flex items-center gap-0.5 px-2 py-1.5 rounded-full backdrop-blur-sm"
          style={{
            background: "var(--nav-bg)",
            border: "1px solid var(--card-border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <a href="#projects" className="nav-link text-sm px-3 py-1.5">
            Проекты
          </a>
          <a
            href="https://blog.oipav.ru"
            className="nav-link text-sm px-3 py-1.5 flex items-center gap-1"
          >
            Блог <ExternalArrow />
          </a>
          <a
            href="https://github.com/evilfaust"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link text-sm px-3 py-1.5 flex items-center gap-1"
          >
            GitHub <ExternalArrow />
          </a>
          <div className="w-px h-4 mx-1" style={{ background: "var(--divider)" }} />
          <ThemeToggle />
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

              <p
                className="text-lg sm:text-xl max-w-lg leading-relaxed font-light"
                style={{ color: "var(--text-secondary)" }}
              >
                Учитель математики. Делаю инструменты для преподавания —
                генераторы задач, тесты, интерактивные модели.
                Всё открытое, всё здесь.
              </p>

              {/* Stats */}
              <div className="flex items-center gap-8 pt-2">
                <div>
                  <div
                    className="text-4xl sm:text-5xl font-bold tabular-nums leading-none"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {projects.length}
                  </div>
                  <div
                    className="text-[0.65rem] mt-2 uppercase tracking-[0.15em]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    проектов
                  </div>
                </div>

                <div className="w-px h-12" style={{ background: "var(--divider)" }} />

                <div>
                  <div className="text-4xl sm:text-5xl font-bold text-emerald-500 tabular-nums leading-none">
                    {totalPublic}
                  </div>
                  <div
                    className="text-[0.65rem] mt-2 uppercase tracking-[0.15em]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    в сети
                  </div>
                </div>

                {totalSoon > 0 && (
                  <>
                    <div className="w-px h-12" style={{ background: "var(--divider)" }} />
                    <div>
                      <div className="text-4xl sm:text-5xl font-bold text-amber-500 tabular-nums leading-none">
                        {totalSoon}
                      </div>
                      <div
                        className="text-[0.65rem] mt-2 uppercase tracking-[0.15em]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        скоро
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* ── Grid ────────────────────────────────────────────── */}
          <section id="projects" className="flex flex-col gap-8">
            <ProjectGrid projects={projects} ghData={ghData} />

            {/* Blog card — outside filter, always visible */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BlogCard posts={blogPosts} index={projects.length} />
            </div>
          </section>

          {/* ── Footer ──────────────────────────────────────────── */}
          <footer
            className="mt-28 pt-8 flex items-center justify-between"
            style={{ borderTop: "1px solid var(--divider)" }}
          >
            <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              evilfaust · {new Date().getFullYear()}
            </span>
            <div className="flex items-center gap-4">
              <a href="https://blog.oipav.ru" className="footer-link text-xs">
                blog.oipav.ru
              </a>
              <a
                href="https://github.com/evilfaust"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link text-xs"
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
