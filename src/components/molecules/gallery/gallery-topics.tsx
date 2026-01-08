 import Button from "@/components/atoms/button";

type GalleryTopicsProps = {
  selectedTopic: string;
  handleTopicClick: (topic: string) => void;
};
 
const TOPICS = ["All", "javascript", "typescript", "nextjs", "real-world"];
 
const GalleryTopics = (props: GalleryTopicsProps) => {
  return (
    <div className="flex justify-center gap-4">
      {TOPICS.map((topic) =>
        topic === props.selectedTopic ? (
          <Button className="rounded-full" key={topic} size={"lg"}>
            {topic}
          </Button>
        ) : (
          <Button
            onClick={() => props.handleTopicClick(topic)}
            className="rounded-full"
            size={"lg"}
            key={topic}
            variant={"ghost"}
          >
            {topic}
          </Button>
        )
      )}
    </div>
  );
};
 
export default GalleryTopics;