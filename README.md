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

## Добавить пост в блог

Положи markdown-файл в [src/content/posts/](src/content/posts/) с frontmatter:

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

KaTeX работает из коробки: `$x^2 + y^2 = r^2$` инлайн, `$$ ... $$` блочно.

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
  content/posts/      ← .md посты блога
  content.config.ts   ← схема frontmatter (Astro Content Collections)
  data/projects.ts    ← данные о проектах
  lib/github.ts       ← подтягивает звёзды и язык из GitHub API на билде
  layouts/
    BaseLayout.astro       ← общий <html>, мета, шрифты
    TerminalLayout.astro   ← обёртка для лендинга (тёмная, моно)
    EditorialLayout.astro  ← обёртка для блога (светлая, serif)
  pages/
    index.astro            ← лендинг
    blog/
      index.astro          ← список постов
      [...slug].astro      ← страница поста
  styles/global.css        ← Tailwind v4 + темы
```
