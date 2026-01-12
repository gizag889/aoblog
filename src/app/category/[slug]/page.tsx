import AppliesTypes from "@/services/PostServices";
import CategoryClient from "./categoryClient";
import { notFound } from "next/navigation";


export default async function categoryPage({ params }: { params: Promise<{ slug: string}>}){

    const { slug } = await params;
    const categoryResult = await AppliesTypes.getCategoryIdBySlug({ slug });
    if (categoryResult.type === 'failure') {
        notFound();
    }
    const categoryId = categoryResult.data;

    const listResult = await AppliesTypes.getList({ categoryId, page: 1 });
    if (listResult.type === 'failure') {
        notFound();
    }
    const [staticPost] = listResult.data;

    if (!staticPost || staticPost.length === 0) {
        notFound();
    }
    return <CategoryClient categoryId={categoryId} categoryList={staticPost} currentPage={1} categorySlug={slug}/>

    

}

export const revalidate = 10

    export async function generateStaticParams() {
        const result = await AppliesTypes.getAllCategorySlugList();
        if (result.type === 'failure') return [];
        // Service returns [{ params: { slug } }], transform to [{ slug }]
        return result.data.map((item) => ({ slug: item.params.slug }));
      }