import AppliesTypes from "@/services/PostServices";
import { notFound } from "next/navigation";
import CategoryClient from "../../categoryClient";


export default async function categoryPage({ params }: { params: Promise<{ slug: string, page: string}>}){

    const { slug, page: pageStr } = await params;
    const categoryResult = await AppliesTypes.getCategoryIdBySlug({ slug });
    if (categoryResult.type === 'failure') {
        notFound();
    }
    const categoryId = categoryResult.data

    const page = parseInt(pageStr);
    const listResult = await AppliesTypes.getList({ categoryId, page });
    if (listResult.type === 'failure') {
        notFound();
    }
    const [staticPost] = listResult.data;

    if (!staticPost || staticPost.length === 0) {
        notFound();
    }

    return <CategoryClient categoryId={categoryId} categoryList={staticPost} currentPage={page} categorySlug={slug} />
}

export const revalidate = 10

export async function generateStaticParams() {
    try {
        const pathsResult = await AppliesTypes.getTotalCategory();
        if (pathsResult.type === 'failure') return [];
        const paths = pathsResult.data;

        // ページネーションも含めた全てのパスを生成（不正形は除外）
        const params = paths
            .map((path) => {
                const param = path?.params?.param;
                if (
                    Array.isArray(param) &&
                    param.length >= 4 &&
                    param[0] === 'category' &&
                    param[2] === 'page' &&
                    param[3]
                ) {
                    return {
                        slug: String(param[1]),
                        page: String(param[3])
                    };
                }
                return null;
            })
            .filter(Boolean) as { slug: string; page: string }[];
        return params;
    } catch {
        // ビルドを壊さないように、失敗時は空配列
        return [];
    }
}