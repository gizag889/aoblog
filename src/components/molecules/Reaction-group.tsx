import { Tables } from "@/types/database.types";
import { fetchReactions } from "@/app/(pages)/(root)/post/[slug]/_utils/featchReactions";
import ReactionButton from "./reaction-btn";
import ReactionMemo from "./reaction-memo";
import useSWR from "swr";

const REACTION_TYPES: Tables<"reactions">["reaction_type"][] = [
  "heart",
  "memo",
];

type ReactionState = {
  reactionCount: number;
  hasReacted: boolean;
  comment: string[];
};

const ReactionGroup = ({ contentId }: { contentId: string }) => {

  const { data: reactionStates, isLoading } = useSWR(
    //useSWRのkey
    contentId ? ["reactions", contentId] : null,
    //useSWRのfetcher
    //keyを受け取って、REACTION_TYPESをmapで回してfetchReactionsを呼び出す
    // 配列の一つ目の要素(文字列のreactions)は無視
    async ([, id]) => {

      const results = await Promise.all(
        REACTION_TYPES.map(async (type) => {

          const data = await fetchReactions(id, type);

          // fetchReactions now returns comment as string[], so we cast/ensure compatibility
          // Ideally fetchReactions return type should be inferred, but let's be safe.
          // data has { reactionCount, hasReacted, comment: string[] }
          return { type, data };

        })

      );

      const newStates: Record<string, ReactionState> = {};

      results.forEach(({ type, data }) => {
        newStates[type] = data;
      });
      //reactStatesを返す
      return newStates;

    }

  );



  if (isLoading || !reactionStates) {

    return <div className="h-6" />; // Loading placeholder

  }
  return (
    <div className="mt-6 space-x-2 text-muted-foreground">
      {REACTION_TYPES.map((reactionType) => {
        const state = reactionStates[reactionType];
        
        if (!state) return null;

        if (reactionType === "memo") {
          return (
            <ReactionMemo
              key={reactionType}
              contentId={contentId}
              initialComment={state.comment || []}
            />
          );
        }

        return (
          <ReactionButton
            key={reactionType}
            contentId={contentId}
            reactionType={reactionType}
            reactionCount={state.reactionCount}
            hasReacted={state.hasReacted}
          />
        );
      })}
    </div>
  );
};

export default ReactionGroup;