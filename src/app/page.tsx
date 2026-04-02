import { projects } from "@/lib/projects";
import { fetchAllRepos } from "@/lib/github";
import { ProjectGrid } from "@/components/ProjectGrid";
import { ThemeToggle } from "@/components/ThemeToggle";

export const revalidate = 3600;

function ExternalArrow() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
  );
}

export default async function HomePage() {
  const repos = projects.map((p) => p.repo);
  const ghData = await fetchAllRepos(repos);

  const totalPublic = projects.filter((p) => p.status === "public").length;
  const totalSoon = projects.filter((p) => p.status === "soon").length;

  return (
    <>
      <div className="page-glow page-glow-a" aria-hidden="true" />
      <div className="page-glow page-glow-b" aria-hidden="true" />
      <div className="page-grid" aria-hidden="true" />

      <main className="relative z-10">
        <div className="mx-auto max-w-7xl px-5 pb-12 pt-6 sm:px-8 sm:pb-16 sm:pt-8">
          <nav className="site-nav">
            <div className="flex flex-col">
              <span className="site-mark">
                oipav<span className="site-mark-dot">.</span>ru
              </span>
              <span className="site-nav-caption">hub for products, tools and notes</span>
            </div>

            <div className="site-nav-actions">
              <a href="#projects" className="nav-link text-sm">
                Каталог
              </a>
              <a
                href="https://blog.oipav.ru"
                className="nav-link text-sm flex items-center gap-1"
              >
                Блог <ExternalArrow />
              </a>
              <a
                href="https://github.com/evilfaust"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link text-sm flex items-center gap-1"
              >
                GitHub <ExternalArrow />
              </a>
              <div className="site-nav-divider" />
              <ThemeToggle />
            </div>
          </nav>

          <section className="hero-shell">
            <div className="hero-copy">
              <span className="section-kicker">Personal project atlas</span>

              <h1 className="hero-title">
                Простой хаб
                <br />
                для живых
                <br />
                проектов.
              </h1>

              <p className="hero-lead">
                Я преподаю математику и собираю вокруг этого собственные цифровые
                инструменты: от генераторов заданий и тестов до небольших
                сервисов, заметок и экспериментов.
              </p>

              <div className="hero-actions">
                <a href="#projects" className="hero-button hero-button-primary">
                  Смотреть проекты
                </a>
                <a
                  href="https://github.com/evilfaust"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-button hero-button-secondary"
                >
                  Открыть GitHub
                </a>
              </div>
            </div>

            <aside className="hero-aside">
              <div className="hero-stats">
                <div className="hero-stat">
                  <span className="hero-stat-value">{projects.length}</span>
                  <span className="hero-stat-label">всего проектов</span>
                </div>
                <div className="hero-stat">
                  <span className="hero-stat-value">{totalPublic}</span>
                  <span className="hero-stat-label">доступны сейчас</span>
                </div>
                {totalSoon > 0 && (
                  <div className="hero-stat">
                    <span className="hero-stat-value">{totalSoon}</span>
                    <span className="hero-stat-label">готовятся дальше</span>
                  </div>
                )}
              </div>
            </aside>
          </section>

          <section className="section-frame" id="projects">
            <div className="section-heading">
              <div>
                <span className="section-kicker">Selected work</span>
                <h2 className="section-title">Каталог проектов</h2>
              </div>
              <p className="section-text">
                Открытые сервисы, преподавательские инструменты и несколько
                соседних направлений, которые постепенно образуют общий контур.
              </p>
            </div>

            <ProjectGrid projects={projects} ghData={ghData} />
          </section>

          <footer className="site-footer">
            <span className="site-footer-name">evilfaust · {new Date().getFullYear()}</span>
            <div className="site-footer-links">
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
