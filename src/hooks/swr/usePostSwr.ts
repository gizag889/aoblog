import useSWR from "swr"; // const

// type
import PostType from "../../types/PostType";
// service
import AppliesTypes from "@/services/PostServices";

const usePostSwr = ({
  id,
  staticPost,
}: {
  id: string;
  staticPost: PostType;
}) => {
  const { data: post } = useSWR(
    [`post-${id}`, id], // より適切なキー名
    async ([_, id]: [string, string]) => {
      const result = await AppliesTypes.getOne({ id });
      if (result.type === "failure") throw result.error;
      return result.data;
    },
    { fallbackData: staticPost }
  );
  return post;
};

export default usePostSwr;
