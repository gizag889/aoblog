"use client";

import { useActionState, useTransition, useRef } from "react";
import { Button } from "../atoms/Button";
import { updateReaction } from "@/app/(pages)/(root)/post/[slug]/_actions/updateReactions";
import PostContent from "../layouts/PostContent";

interface ReactionMemoProps {
  contentId: string;
  initialComment: string[];
}

const ReactionMemo = ({ contentId, initialComment }: ReactionMemoProps) => {
  const [isPending, startTransition] = useTransition();
//updateReactionでサーバーアクションを呼び出す
  const [state, formAction] = useActionState(updateReaction, {
    //アクション時にprevStateとして渡す
    reactionCount: 0,
    //コメントがあるかどうか
    hasReacted: !!initialComment.length,
    comment: initialComment,
  });

  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (formData: FormData) => {
    const comment = formData.get("comment") as string;
    if (!comment.trim()) return; // Don't submit empty comments
    startTransition(() => {
      formAction({
        // アクション時にReactionDataとして渡す
        contentId,
        reactionType: "memo",
        comment,
      });
      formRef.current?.reset();
    });
  };

  const comments: string[] = state.comment || initialComment || [];

  return (
    <div className="flex flex-col gap-4 w-full mt-6">
      <div className="flex flex-col gap-4">
        {comments.map((c, i) => (
            <PostContent key={i}>
                <div className="p-6 break-all whitespace-pre-wrap">{c}</div>
            </PostContent>
        ))}
      </div>
      <form ref={formRef} action={handleSubmit} className="flex flex-col gap-2 w-full">
        <textarea
            name="comment"
            className="w-full p-2 border rounded-md text-sm min-h-[80px] bg-background text-foreground"
            placeholder="コメントする..."
        />
        <div className="flex justify-end">
            <Button
              className="hover:bg-(--color-secondary-main)"
              type="submit"
              disabled={isPending}
              size="lg"
              variant="outline"
              >
              {isPending ? "保存中..." : "保存"}
            </Button>
        </div>
      </form>
    </div>
  );
};

export default ReactionMemo;
