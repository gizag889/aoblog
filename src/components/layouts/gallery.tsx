"use client";
 
import { Badge } from "../atoms/badge";
import { Button } from "../atoms/button";
import { Card, CardDescription, CardTitle } from "../molecules/gallery/card";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import GalleryTopics from "../molecules/gallery/gallery-topics";
 
type GalleryProps = {
  projects: {
    owner: string;
    slug: string;
    repoName: string;
    topics: string[];
    imageURL: string;
  }[];
};
 
const Gallery = (props: GalleryProps) => {
  const [latestProject, setLatestProject] = useState<
    GalleryProps["projects"][0] | null
  >(props.projects[0]);
  const [selectedTopic, setSelectedTopic] = useState<string>("All");
 
  // 追加
  const handleTopicClick = (topic: string) => {
    if (topic !== "All") {
      setLatestProject(null);
    } else {
      setLatestProject(props.projects[0]);
    }
    setSelectedTopic(topic);
  };
 
  const filteredProjects =
    selectedTopic === "All"
      ? props.projects.slice(1)
      : props.projects.filter((project) =>
          project.topics.includes(selectedTopic)
        );
 
  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
      <div className="col-span-3 mx-auto">
        {/* GalleryTopics コンポーネント */}
        <GalleryTopics
          selectedTopic={selectedTopic}
          handleTopicClick={handleTopicClick}
        />
      </div>
 
      {/* 最新リリースのみ大きいカードで表示 */}
      {latestProject && (
        <Link
        
          href={`portfolio/${latestProject.owner}/${latestProject.slug}`}
          className="contents"
        >
          <Card className="relative col-span-3 grid grid-cols-1 md:grid-cols-2 p-12 hover:border-emerald-600 transition border-2">
            <div className="space-y-8">
              <p className="text-stone-600">最新のリリース</p>
              <CardTitle className="text-4xl">
                {latestProject.repoName}
              </CardTitle>
 
              <CardDescription>
                <div className="space-x-2">
                  {latestProject.topics.map((item) => (
                    <Badge
                      key={item}
                      variant={"secondary"}
                      className="rounded-full text-sm px-4 py-2"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardDescription>
 
              <div className="absolute flex gap-2 items-center bottom-12">
                <p className="text-lg text-emerald-600 font-semibold">
                  Read More
                </p>
                <MoveRight className="w-7 h-7 text-emerald-600" />
              </div>
            </div>
            <div>
              {/* <Image
                src={latestProject.imageURL}
                alt={latestProject.repoName}
                className="rounded-lg mx-auto border"
                width={500}
                height={280}
              /> */}
            </div>
          </Card>
        </Link>
      )}
 
      {/* 追加 */}
      {/* それ以外のリスト */}
      {filteredProjects.map((project) => (
        <Link
          key={project.repoName}
          href={`portfolio/${project.owner}/${project.slug}`}
          className="contents"
        >
          <Card
            key={project.repoName}
            className="col-span-1 p-0! hover:border-emerald-600 transition border-2"
          >
            <div className="w-full h-52 object-cover">
              {/* <Image
                src={project.imageURL}
                alt={project.repoName}
                className="rounded-lg rounded-b-none max-h-full max-w-full object-fill"
                width={364}
                height={204}
              /> */}
            </div>
            <div className="space-y-10 p-8">
              <CardTitle className="text-4xl">{project.repoName}</CardTitle>
 
              <CardDescription>
                <div className=" space-y-2 h-28">
                  {project.topics.map((item) => (
                    <Badge
                      key={item}
                      variant={"secondary"}
                      className="rounded-full text-sm"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardDescription>
 
              <div className="w-full">
                <Button className="w-full" size={"lg"}>
                  Read More
                </Button>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};
 
export default Gallery;