import type { APIRoute } from "astro";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

export const prerender = false;

const run = promisify(execFile);

/** Публикуем только содержимое блога — незакоммиченный код рядом не трогаем. */
const BLOG_PATHS = ["src/content/posts", "public/images/posts"];

const git = (args: string[]) =>
  run("git", args, { cwd: process.cwd(), maxBuffer: 8 * 1024 * 1024 }).then((r) => r.stdout);

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

/** GET /api/admin/git → что именно уедет при публикации. */
export const GET: APIRoute = async () => {
  try {
    const branch = (await git(["rev-parse", "--abbrev-ref", "HEAD"])).trim();
    const porcelain = await git(["status", "--porcelain", "--", ...BLOG_PATHS]);

    const changes = porcelain
      .split("\n")
      .filter(Boolean)
      .map((line) => ({
        status: line.slice(0, 2).trim(),
        path: line.slice(3).replace(/^"|"$/g, ""),
      }));

    // Коммиты, которые уже лежат локально, но ещё не ушли в origin.
    let ahead = 0;
    try {
      ahead = Number((await git(["rev-list", "--count", `origin/${branch}..HEAD`])).trim()) || 0;
    } catch {
      ahead = 0; // нет upstream — не повод падать
    }

    return json({ branch, changes, ahead });
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : String(err) }, 500);
  }
};

/** POST /api/admin/git → add + commit + push по путям блога. */
export const POST: APIRoute = async ({ request }) => {
  try {
    const { message } = (await request.json().catch(() => ({}))) as { message?: string };

    const branch = (await git(["rev-parse", "--abbrev-ref", "HEAD"])).trim();
    const porcelain = await git(["status", "--porcelain", "--", ...BLOG_PATHS]);
    const hasChanges = porcelain.trim().length > 0;

    if (hasChanges) {
      await git(["add", "--", ...BLOG_PATHS]);
      // execFile без shell: сообщение уходит отдельным аргументом, поэтому
      // кавычки и переводы строк в заголовке поста ничего не сломают.
      await git(["commit", "-m", message?.trim() || "Обновление блога"]);
    }

    const pushOut = await git(["push", "origin", branch]).catch((err: Error) => {
      throw new Error(`Не удалось запушить: ${err.message}`);
    });

    return json({ ok: true, branch, committed: hasChanges, output: pushOut });
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : String(err) }, 500);
  }
};
