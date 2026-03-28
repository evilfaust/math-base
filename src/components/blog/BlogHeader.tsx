import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function BlogHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--blog-border)] bg-[var(--blog-bg)]/90 backdrop-blur-sm">
      <div className="max-w-2xl mx-auto px-5 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-[var(--blog-text)] font-semibold tracking-tight hover:opacity-70 transition-opacity"
        >
          oipav<span className="text-indigo-500">.</span>blog
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="https://oipav.ru"
            className="text-sm text-[var(--blog-muted)] hover:text-[var(--blog-text)] transition-colors px-3 py-1.5 rounded-lg hover:bg-[var(--blog-hover)]"
          >
            Проекты
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
