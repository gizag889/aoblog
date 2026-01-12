import useSWR from "swr";
// const
import { WpQueries } from "@/constants/WpQueries";
// type
import PostListType from "@/types/PostListType";
// service
import AppliesTypes from "@/services/PostServices";

const usePostListSwr = ({
  currentPage,
  categoryId,
  staticPostList,
  staticTotal,
}: {
  currentPage: number;
  categoryId?: number;
  staticPostList: PostListType[];
  staticTotal: number;
}) => {
  let key, fetcher;
  if (categoryId) {
    key = [WpQueries.listByCategory, currentPage, categoryId];
    fetcher = async ([_, page, categoryId]: [string, number, number]) => {
      const result = await AppliesTypes.getList({ page, categoryId });
      if (result.type === "failure") throw result.error;
      return result.data;
    };
  } else {
    key = [WpQueries.list, currentPage];
    fetcher = async ([_, page]: [string, number]) => {
      const result = await AppliesTypes.getList({ page });
      if (result.type === "failure") throw result.error;
      return result.data;
    };
  }
  const { data } = useSWR<[PostListType[], number]>(
    //ここまでで設定してきた、key,fetcher格納
    key,
    fetcher,
    { fallbackData: [staticPostList, staticTotal] }
  );
  return data ?? [staticPostList, staticTotal];
};

export default usePostListSwr;
