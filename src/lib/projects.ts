export type ProjectStatus = "public" | "soon" | "private";

export interface Project {
  id: string;
  name: string;
  description: string;
  repo: string;           // "owner/repo"
  website?: string;       // live URL if exists
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
    description: "Образовательный инструмент для работы с математическими понятиями и доказательствами",
    repo: "evilfaust/lemma",
    website: "https://lemma.oipav.ru",
    status: "public",
    tags: ["edu", "math"],
    accent: "#6366f1",
    featured: true,
    hasLanding: true,
  },
  {
    id: "ege-journal",
    name: "ЕГЭ Журнал",
    description: "Дневник подготовки к ЕГЭ — отслеживай прогресс, анализируй слабые места",
    repo: "evilfaust/ege-journal",
    website: "https://ege-journal.oipav.ru",
    status: "public",
    tags: ["edu", "productivity"],
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
    landingRepo: "evilfaust/pulseback-landing",
    status: "soon",
    tags: ["hr", "feedback", "saas"],
    accent: "#ec4899",
    featured: true,
    hasLanding: true,
  },
  {
    id: "progression",
    name: "Progression",
    description: "Инструмент для отслеживания личного и профессионального роста",
    repo: "evilfaust/progression",
    status: "public",
    tags: ["productivity", "personal"],
    accent: "#22c55e",
    hasLanding: false,
  },
];
