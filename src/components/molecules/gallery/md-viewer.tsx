import { marked } from "marked";
import { fetchRepoData } from "@/lib/utils/api";


interface MarkdownViewerProps {
  repoUrl: string;
}
 
export default async function MarkdownViewer({ repoUrl }: MarkdownViewerProps) {
  const repoData = await fetchRepoData(repoUrl);
 
  return (
    <div className="w-full max-w-4xl ">
      <div>
        <h1 className="text-gray-500">/README.md</h1>
      </div>
      <div>
        {repoData.readme ? (
          <article
            className="prose max-w-full"
            dangerouslySetInnerHTML={{
              __html: marked.parse(repoData.readme),
            }}
          />
        ) : (
          <div className="text-gray-500 py-4">
            README could not be loaded or is empty. (Debug: Length {repoData.readme?.length ?? 0})
          </div>
        )}
      </div>
    </div>
  );
}