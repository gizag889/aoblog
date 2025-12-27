"use client";
 
import { Button } from "../atoms/button";
import { Badge } from "../atoms/badge";
import { Tables } from "@/types/database.types";
import useReactionButtonLogic from "@/hooks/swr/useReactionButtonLogic";
import { cn } from "@/lib/utils";
 
const REACTION_ICONS = {
  like: "👍",
  interest: "👀",
  heart: "❤️‍🔥",
  check: "✅",
  memo: "🫐",
};
 
interface ReactionButtonProps {
  contentId: string;
  reactionType: Tables<"reactions">["reaction_type"];
  reactionCount: number;
  hasReacted: boolean;
}
 
const ReactionButton = (props: ReactionButtonProps) => {
  const { isPending, optimisticState, handleClick } = useReactionButtonLogic(
    props.reactionCount,
    props.hasReacted,
    props.contentId,
    props.reactionType
  );
  return (
    <Button
      variant={"ghost"}
      size={"lg"}
      className="py-0.5 h-10.5"
      asChild
      // 追加
      onClick={handleClick}
      disabled={isPending}
    >
      <Badge
        variant={"outline"}
        // 自分がリアクションしているかどうかで、スタイルを分岐
        className={cn(
          "rounded-full cursor-pointer text-xl border-1 border-(--color-divider-main) text-muted-foreground hover:bg-(--color-secondary-main)",
          optimisticState.hasReacted && "hover:bg-(--color-secondary-main) cursor-pointer"
        )}
      >
        {REACTION_ICONS[props.reactionType]} {optimisticState.reactionCount}
      </Badge>
    </Button>
  );
};
 
export default ReactionButton;