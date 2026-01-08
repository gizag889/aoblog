
import Button from "@/components/atoms/Button";
import { Star } from "lucide-react";
import Link from "next/link";
import { fetchRepoData } from "@/lib/utils/api";
import { PROJECTS } from "@/lib/_data/contents";
 
const MetaDataCard = async ({ repoUrl }: { repoUrl: string }) => {
  const repoData = await fetchRepoData(repoUrl);
  const project = PROJECTS.find((p) => p.repoUrl === repoUrl);
  const demoUrl = project?.demoURL ?? repoData.homepage;

   console.log("repoData.homepage:", repoData.description);
  return (
    <>
      <div className="border-(--color-divider-main) border-1 p-5">
        <div className="flex flex-row items-center justify-between">
          <div>About</div>
          <div className="flex items-center gap-1">
            <Star className="text-yellow-500" />
            <span>{repoData.stargazersCount}</span>
          </div>
        </div>
 
        <div className="space-y-6">
          <div className="text-3xl">
            {repoData.description}
          </div>
          <div className="flex gap-2 w-full">
            <Button className="w-1/2" size={"lg"} asChild>
              <Link href={repoUrl} target="_blank" rel="noopener noreferrer">
                GitHub
              </Link>
            </Button>
            <Button
              className="w-1/2"
              size={"lg"}
              // variant={"outline"}
              disabled={!demoUrl}
              asChild={!!demoUrl}
            >
              {demoUrl ? (
                <a
                  href={demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Demo
                </a>
              ) : (
                "View Demo"
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
 
export default MetaDataCard;