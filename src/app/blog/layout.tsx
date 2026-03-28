import type { Metadata } from "next";
import { Archivo, Lora } from "next/font/google";
import { BlogHeader } from "@/components/blog/BlogHeader";
import "../blog-globals.css";

const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  variable: "--font-archivo",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Блог — oipav.ru", template: "%s — oipav.ru" },
  description: "Заметки о математике, преподавании и инструментах",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning className={`${archivo.variable} ${lora.variable}`}>
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var stored = localStorage.getItem('blog-theme');
                var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (stored === 'dark' || (!stored && prefersDark)) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="bg-[var(--blog-bg)] text-[var(--blog-text)] antialiased transition-colors duration-200">
        <BlogHeader />
        <main>{children}</main>
        <footer className="border-t border-[var(--blog-border)] mt-20 py-8 text-center text-xs text-[var(--blog-muted)]">
          <p>oipav.ru · <a href="https://github.com/evilfaust" className="hover:text-indigo-500 transition-colors">GitHub</a></p>
        </footer>
      </body>
    </html>
  );
}
