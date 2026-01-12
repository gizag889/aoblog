import AppliesTypes from "@/services/PostServices";
import PostListType from "@/types/PostListType";
import HomeClient from "./HomeClient";
import { notFound } from "next/navigation";

export default async function HomeByPage({ params }: { params: Promise<{ page: string }> }) {
	const { page } = await params
	const currentPage = Number(page)
  
  if (!Number.isFinite(currentPage) || currentPage < 1) {
      notFound()
  }
  
  const listResult = await AppliesTypes.getList({ page: currentPage });
  if (listResult.type === 'failure') notFound();
  
  const [staticPostList, staticTotal]: [PostListType[], number] = listResult.data;

  const categoriesResult = await AppliesTypes.getAllCategories();
  const allCategories = categoriesResult.type === 'success' ? categoriesResult.data : [];
  
  console.log('Post list length:', staticPostList?.length); // デバッグ用
  console.log('Total:', staticTotal); // デバッグ用
  
  // if (!staticPostList || staticPostList.length === 0) {
  //     notFound()
  // }

  return <HomeClient staticPostList={staticPostList} staticTotal={staticTotal} currentPage={currentPage} categories={allCategories} />
}

export const revalidate = 10

export async function generateStaticParams() {
    const listResult = await AppliesTypes.getAllPageList();
    if (listResult.type === 'failure') return [];
    // Service returns [{ params: { page } }], transform to [{ page }]
    return listResult.data.map((item) => ({ page: item.params.page }));
}
