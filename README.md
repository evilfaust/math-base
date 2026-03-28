# math-base — project aggregator

Агрегатор проектов. Next.js + Tailwind + GitHub API.

## Добавить проект

Открой `src/lib/projects.ts` и добавь объект:

```ts
{
  id: "my-project",
  name: "Название",
  description: "Короткое описание",
  repo: "evilfaust/my-project",      // обязательно
  website: "https://...",             // если есть live URL
  status: "public",                   // "public" | "soon" | "private"
  tags: ["tag1", "tag2"],
  featured: false,                    // пинит наверх
  hasLanding: false,
}
```

Запушил в `main` → GitHub Actions → VPS обновился автоматически.

## Настройка VPS (первый раз)

```bash
# На сервере
cd /var/www
git clone https://github.com/evilfaust/math-base.git
cd math-base
npm ci
npm run build
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# nginx
cp nginx.conf.example /etc/nginx/sites-available/math-base
# отредактируй server_name
ln -s /etc/nginx/sites-available/math-base /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# HTTPS
certbot --nginx -d yourdomain.com
```

## GitHub Secrets (для CI/CD)

В настройках репозитория → Settings → Secrets → Actions:

| Secret | Значение |
|--------|---------|
| `VPS_HOST` | IP или домен VPS |
| `VPS_USER` | Пользователь (обычно `root` или `deploy`) |
| `VPS_SSH_KEY` | Приватный SSH ключ (`cat ~/.ssh/id_rsa`) |
| `GH_API_TOKEN` | GitHub Personal Access Token (опционально, для повышения rate limit) |

## Локальная разработка

```bash
npm install
npm run dev   # http://localhost:3000
```
