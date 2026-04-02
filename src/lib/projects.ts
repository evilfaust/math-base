export type ProjectStatus = "public" | "soon" | "private";

export interface Project {
  id: string;
  name: string;
  description: string;
  repo: string;           // "owner/repo"
  website?: string;       // live URL if exists
  demoUrl?: string;       // demo URL if available
  logo?: string;          // logo image URL
  landingRepo?: string;   // отдельный лендинг-репо
  status: ProjectStatus;
  tags: string[];
  accent: string;         // accent color for card glow & top bar
  featured?: boolean;
  hasLanding: boolean;
}

export const projects: Project[] = [
  {
    id: "lemma",
    name: "Lemma",
    description: "Инструменты учителя математики: база задач, генератор работ, геометрия с GeoGebra, онлайн-тесты, ТДФ-конспекты",
    repo: "evilfaust/lemma",
    website: "https://lemma.oipav.ru",
    logo: "https://lemma.oipav.ru/lemma-logo.png",
    status: "public",
    tags: ["edu", "math"],
    accent: "#6366f1",
    featured: true,
    hasLanding: true,
  },
  {
    id: "ege-journal",
    name: "ЕГЭ Журнал",
    description: "Веб-платформа для учителей математики: база задач, генератор контрольных работ и вариантов ЕГЭ, онлайн-тесты для учеников с достижениями.",
    repo: "evilfaust/ege-journal",
    website: "https://ege-journal.oipav.ru",
    logo: "https://ege-journal.oipav.ru/ege-journal-logo.png",
    status: "public",
    tags: ["edu", "math"],
    accent: "#8b5cf6",
    hasLanding: true,
  },
  {
    id: "dorozhnyj-dnevnik",
    name: "Дорожный дневник",
    description: "Личный сервис для хранения и публикации путевых заметок и маршрутов",
    repo: "evilfaust/dorozhnyj-dnevnik",
    website: "https://travel-gu.ru",
    status: "public",
    tags: ["travel", "personal"],
    accent: "#0ea5e9",
    hasLanding: true,
  },
  {
    id: "pulseback",
    name: "PulseBack",
    description: "Инструмент для пульс-опросов — быстрый сбор обратной связи внутри команды",
    repo: "evilfaust/pulse-survey-app",
    website: "https://pulseback.ru",
    demoUrl: "https://demo.pulseback.ru",
    landingRepo: "evilfaust/pulseback-landing",
    status: "public",
    tags: ["hr", "feedback", "saas"],
    accent: "#ec4899",
    featured: true,
    hasLanding: true,
  },
  {
    id: "progression",
    name: "Progression",
    description: "Интерактивные модели для уроков математики: прогрессии (ОГЭ/ЕГЭ), Фибоначчи, Паскаль, решето Эратосфена. 19 HTML-файлов без зависимостей.",
    repo: "evilfaust/progression",
    status: "public",
    tags: ["edu", "math"],
    accent: "#22c55e",
    hasLanding: false,
  },
  {
    id: "geometry",
    name: "Geometry",
    description: "Небольшой статический сайт с интерактивными пошаговыми построениями геометрических фигур для учеников.",
    repo: "evilfaust/geometry",
    website: "https://geometry.oipav.ru",
    logo: "https://raw.githubusercontent.com/evilfaust/geometry/main/logo.png",
    status: "public",
    tags: ["edu", "math", "geometry"],
    accent: "#14b8a6",
    hasLanding: false,
  },
];
