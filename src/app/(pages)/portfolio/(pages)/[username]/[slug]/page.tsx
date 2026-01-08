import { PROJECTS } from "@/lib/_data/contents";
import { extractOwnerAndRepo } from "@/lib/utils/api"; 
import MarkdownViewer from "@/components/molecules/gallery/md-viewer";
import MetaDataCard from "@/components/molecules/gallery/metadata-card";
import Layout from "@/components/layouts/Layout";

export default async function Detail({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}) {
  const username = (await params).username;
  const slug = (await params).slug;
  const repoUrl = `https://github.com/${username}/${slug}`;
 
  return (
    <Layout>
      <div className="md:flex-row flex flex-col max-w-7xl mx-auto gap-4 pt-12 ">
        <div className="md:w-2/3 w-full h-full border-(--color-divider-main) border-1">
          <MarkdownViewer repoUrl={repoUrl} />
        </div>
        <div className="md:w-1/3 w-full sticky top-24 h-screen overflow-hidden">
          <MetaDataCard repoUrl={repoUrl} />
        </div>
      </div>
    </Layout>
  );
}
 
export async function generateStaticParams() {
  return PROJECTS.map(({ repoUrl }) => {
    const { owner, repo } = extractOwnerAndRepo(repoUrl);
    return { username: owner, slug: repo };
  });
}