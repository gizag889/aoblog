function extractOwnerAndRepo(repoUrl: string): { owner: string; repo: string } {
  const urlParts = repoUrl.replace("https://github.com/", "").split("/");
  return { owner: urlParts[0], repo: urlParts[1] };
}
 
async function fetchRepoDetails(owner: string, repo: string) {
  const repoResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    {
      cache: "force-cache",
    }
  );
 
  if (!repoResponse.ok) {
    throw new Error("Failed to fetch repository details");
  }
 
  return repoResponse.json();
}
 
async function fetchReadmeContent(
  owner: string,
  repo: string
): Promise<string> {
  const readmeResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/readme`,
    {
      headers: {
        Accept: "application/vnd.github.v3.raw",
      },
      cache: "force-cache",
    }
  );
 
  return readmeResponse.ok ? await readmeResponse.text() : "";
}
 
interface RepoData {
  id: number;
  owner: string;
  slug: string;
  repoName: string;
  description: string | null;
  stargazersCount: number;
  topics: string[];
  readme: string;
  homepage: string;
}
 
async function fetchRepoData(repoUrl: string): Promise<RepoData> {
  // URLから、ownerとrepoを抜き出す
  const { owner, repo } = extractOwnerAndRepo(repoUrl);
  // リポジトリのメタデータを取得
  const repoData = await fetchRepoDetails(owner, repo);
  // README.md のデータを取得
  const readmeContent = await fetchReadmeContent(owner, repo);
 
  return {
    id: repoData.id,
    owner: owner,
    slug: repo,
    repoName: repoData.name,
    description: repoData.description,
    stargazersCount: repoData.stargazers_count,
    topics: repoData.topics,
    homepage: repoData.homepage,
    readme: readmeContent,
  };
}
 
export { fetchRepoData, extractOwnerAndRepo };