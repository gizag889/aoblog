"use server";
 
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Tables } from "@/types/database.types";
import { getUserToken, setUserToken } from "@/lib/userToken";
import { GLOBAL_MEMO_CONTENT_ID } from "@/constants/PostConst";
 
type ReactionData = {
  contentId: string;
  reactionType: Tables<"reactions">["reaction_type"];
  comment?: string;
};
 
type prevState = {
  reactionCount: number;
  hasReacted: boolean;
  comment?: string[];
};

export const updateReaction = async (
  prevState: prevState,
  
  reactiondata: ReactionData
) => {
  let userToken = await getUserToken();
 
  if (!userToken) {
    userToken = await setUserToken();
  }
 
  // memoの場合は、コメントを更新または追加
  if (reactiondata.reactionType === "memo") {
    const targetId = GLOBAL_MEMO_CONTENT_ID;

    // 既存のコメントを取得
    const { data: currentData } = await supabaseAdmin
      .from("reactions")
      .select("comment")
      .eq("user_token", userToken)
      .eq("content_id", targetId)
      .eq("reaction_type", "memo")
      .single();

    // 既に配列として返ってくる
    const comments: string[] = currentData?.comment || [];

    if (reactiondata.comment) {
      comments.push(reactiondata.comment);
    }

    const { data, error } = await supabaseAdmin
      .from("reactions")
      .upsert(
        {
          user_token: userToken,
          content_id: targetId,
          reaction_type: reactiondata.reactionType,
          comment: comments,
          created_at: new Date().toISOString(),
        },
        
        { onConflict: "user_token, content_id, reaction_type" }
      )
      .select()
      .single();

    if (error) {
      console.error(error);
      return prevState;
    }

    return {
      reactionCount: prevState.reactionCount, 
      hasReacted: true,
      comment: comments,
    };
  }

 
  // heartなどのトグル系リアクション
  if (prevState.hasReacted) {
    // リアクションを削除
    await supabaseAdmin
      .from("reactions")
      .delete()
      .eq("content_id", reactiondata.contentId)
      .eq("reaction_type", reactiondata.reactionType)
      .eq("user_token", userToken);
 
    return {
      reactionCount: prevState.reactionCount - 1,
      hasReacted: !prevState.hasReacted,
    };
  } else {
    // リアクションを追加
    await supabaseAdmin.from("reactions").insert({
      user_token: userToken,
      content_id: reactiondata.contentId,
      reaction_type: reactiondata.reactionType,
    });
 
    return {
      reactionCount: prevState.reactionCount + 1,
      hasReacted: !prevState.hasReacted,
    };
  }
};