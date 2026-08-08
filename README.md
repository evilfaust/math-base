# math-base — project aggregator

Хаб проектов и блог на одном сайте. Astro · Tailwind · GitHub API.
Статический сайт: билд в GitHub Actions, nginx раздаёт с VPS.

- `/` — лендинг с проектами (terminal-стиль, тёмная тема)
- `blog.oipav.ru` — блог с математикой (editorial-стиль, светлая тема)

## Добавить проект

[src/data/projects.ts](src/data/projects.ts):

```ts
{
  id: "my-project",
  name: "Название",
  description: "Короткое описание",
  repo: "evilfaust/my-project",        // обязательно
  website: "https://...",              // если есть live URL
  status: "public",                    // "public" | "soon" | "private"
  tags: ["tag1", "tag2"],
  accent: "#6366f1",                   // зарезервировано на будущее
  featured: false,                     // выделить
  hasLanding: false,
}
```

Push в `main` → GitHub Actions собирает → rsync в `/var/www/math-base` на VPS.

## Вести блог: админка

```bash
npm run dev      # затем http://localhost:4321/admin
```

Админка живёт **только в dev**. Её маршруты подключает
[src/admin/integration.mjs](src/admin/integration.mjs) по условию
`command === "dev"`, а сами файлы лежат в `src/admin/`, а не в `src/pages/`,
поэтому `astro build` их не видит: в `dist/` не попадает ни страница, ни
эндпоинты. Наружу ничего не торчит, паролей нет — доступ ограничен тем, что
сервер слушает localhost.

Что умеет:

- список записей, создание, редактирование, удаление;
- адрес записи собирается из заголовка транслитерацией (`Добро пожаловать`
  → `2026-08-09-dobro-pozhalovat`), можно переопределить вручную;
- предпросмотр справа гоняется через **тот же** markdown-пайплайн, что и
  сборка сайта — общий конфиг в [src/lib/markdown.mjs](src/lib/markdown.mjs),
  поэтому превью не может разойтись с результатом;
- картинки: перетаскиванием, вставкой из буфера или кнопкой. Пережимаются в
  webp (ширина до 1600) и кладутся в `public/images/posts/`;
- `⌘S` сохранить, `⌘B` / `⌘I` / `⌘K` — форматирование;
- кнопка «Опубликовать» показывает, какие файлы уедут, и делает
  commit + push только по путям блога — незакоммиченный код рядом не трогает.

## Добавить пост вручную

Если админка не нужна — положи markdown-файл в
[src/content/posts/](src/content/posts/) с frontmatter:

```yaml
---
title: "Заголовок"
date: 2026-05-22
description: "Короткое описание для списка и og"
category: "Дневник"          # или "Методика", "Инструменты" и т.п.
tags: [математика, заметка]
draft: false                  # true прячет пост на проде
---
```

KaTeX работает из коробки. Инлайн — `$x^2 + y^2 = r^2$`. Для блочной формулы
`$$` должны стоять **на отдельных строках**, иначе remark-math отрендерит её
как инлайновую:

```
$$
\int_0^1 x^2\,dx = \frac{1}{3}
$$
```

В админке для этого есть кнопка «ƒ блок».

## Локальная разработка

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # сборка в dist/
npm run preview  # пройтись по собранному, порт 3042
```

## Деплой

### GitHub Secrets

Settings → Secrets and variables → Actions:

| Secret | Что это |
|--------|---------|
| `VPS_HOST` | IP или домен VPS |
| `VPS_USER` | Пользователь (`root` или `deploy`) |
| `VPS_SSH_KEY` | Приватный SSH-ключ для деплоя |
| `GH_API_TOKEN` | GitHub PAT (опционально, для GH API rate limit) |

### Первичная настройка VPS

```bash
# Если на сервере был старый Next-деплой:
pm2 delete math-base || true
pm2 save
rm -rf /var/www/math-base
mkdir -p /var/www/math-base

# nginx
cp nginx.conf.example /etc/nginx/sites-available/math-base
# отредактируй server_name → oipav.ru и blog.oipav.ru
ln -sf /etc/nginx/sites-available/math-base /etc/nginx/sites-enabled/math-base
nginx -t && systemctl reload nginx

# HTTPS
certbot --nginx -d oipav.ru -d www.oipav.ru -d blog.oipav.ru
```

После этого первый push в `main` (или ручной запуск workflow) положит статику в `/var/www/math-base`.

## Что внутри

```
src/
  admin/                   ← админка блога, ТОЛЬКО dev (в dist/ не попадает)
    integration.mjs        ← подключает маршруты при command === "dev"
    AdminPage.astro        ← редактор
    api/                   ← posts (CRUD), preview, upload, git
    lib/posts.ts           ← чтение/запись .md, проверка slug
  components/
    PostList.astro         ← список записей: обложки, теги, рубрики
  content/posts/           ← .md посты блога
  content.config.ts        ← схема frontmatter (Astro Content Collections)
  data/projects.ts         ← данные о проектах
  lib/
    github.ts              ← звёзды и язык из GitHub API на билде
    markdown.mjs           ← общий markdown-конфиг: сборка + превью в админке
    blog.ts                ← выборки постов, теги, рубрики
    slug.ts                ← транслитерация для адресов
  layouts/
    BaseLayout.astro       ← общий <html>, мета, OG, шрифты
    TerminalLayout.astro   ← обёртка для лендинга (тёмная, моно)
    EditorialLayout.astro  ← обёртка для блога (светлая, serif)
  pages/
    index.astro            ← лендинг
    og-default.png.ts      ← OG-картинка по умолчанию, рисуется на билде
    blog/
      index.astro          ← список постов + поиск
      [...slug].astro      ← страница поста
      search.json.ts       ← индекс для клиентского поиска
      tag/[tag].astro      ← записи по тегу
      category/[category].astro
  styles/global.css        ← Tailwind v4 + темы
```

Заголовки набраны Literata: у Fraunces, который стоял раньше, нет
кириллического набора, и русские заголовки молча падали в Georgia.
