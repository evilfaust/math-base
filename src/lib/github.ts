export interface GitHubRepoData {
  stars: number;
  description: string | null;
  language: string | null;
  pushedAt: string;
  topics: string[];
  homepage: string | null;
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function fetchRepo(repo: string): Promise<GitHubRepoData | null> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${GITHUB_TOKEN}`;
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers,
      next: { revalidate: 3600 }, // ISR: обновляем раз в час
    });

    if (!res.ok) return null;
    const data = await res.json();

    return {
      stars: data.stargazers_count ?? 0,
      description: data.description ?? null,
      language: data.language ?? null,
      pushedAt: data.pushed_at ?? "",
      topics: data.topics ?? [],
      homepage: data.homepage ?? null,
    };
  } catch {
    return null;
  }
}

export async function fetchAllRepos(
  repos: string[]
): Promise<Record<string, GitHubRepoData | null>> {
  const results = await Promise.all(
    repos.map(async (repo) => [repo, await fetchRepo(repo)] as const)
  );
  return Object.fromEntries(results);
}
