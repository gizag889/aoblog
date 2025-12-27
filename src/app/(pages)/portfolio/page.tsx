import { fetchRepoData } from "@/lib/utils/api";
import { PROJECTS } from "@/lib/_data/contents";
import Gallery from "@/components/layouts/gallery";
import Hero from "@/components/molecules/gallery/hero";

export default async function PortfolioByPage() {
   const projects = await Promise.all(
    PROJECTS.map(async (project) => {
      const data = await fetchRepoData(project.repoUrl);
      return {
        owner: data.owner,
        slug: data.slug,
        repoName: data.repoName,
        topics: data.topics,
        imageURL: project.imageURL,
      };
    })
  );
   return (
    <main className="space-y-32 pt-16">
      <Hero />
      <Gallery projects={projects.reverse()} />
    </main>
  );
}