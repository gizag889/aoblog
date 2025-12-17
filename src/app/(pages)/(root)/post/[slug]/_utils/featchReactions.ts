"use server";

import { supabase } from "@/lib/supabaseClient";
import { Tables } from "@/types/database.types";
import { getUserToken } from "@/lib/userToken";
import { GLOBAL_MEMO_CONTENT_ID } from "@/constants/PostConst";
// import { GLOBAL_MEMO_CONTENT_ID } from "@/lib/constants";
 
const fetchReactions = async (
  contentId: string,
  reactionType: Tables<"reactions">["reaction_type"]
) => {
  let targetId = contentId;
  if (reactionType === "memo") {
    targetId = GLOBAL_MEMO_CONTENT_ID;
  }

  const { count } = await supabase
    .from("reactions")
    .select("*", { count: "exact" })
    .eq("content_id", targetId)
    .eq("reaction_type", reactionType);

  const userToken = await getUserToken();
  if (!userToken) {
    return {
      reactionCount: count || 0,
      hasReacted: false,
      comment: [],
    };
  }

  const { data } = await supabase
    .from("reactions")
    .select()
    .eq("content_id", targetId)
    .eq("reaction_type", reactionType)
    .eq("user_token", userToken)
    .single();

  return {
    //リアクション数
    reactionCount: count || 0,
    //リアクションをしたかどうか
    hasReacted: !!data,
    //コメントがあるか
    comment: data?.comment || [],
  };
};
 
export { fetchReactions };