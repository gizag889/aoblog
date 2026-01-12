import AppliesTypes from "@/services/PostServices";

import { notFound } from "next/navigation";
import PostClient from "../PostClient";

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {

	const { slug } = await params;
	const result = await AppliesTypes.getOne({ id: slug });
	
    if (result.type === 'failure') {
        notFound();
    }
    const staticPost = result.data;

	if (!staticPost) {
		notFound();
	}
	return <PostClient slug={slug} staticPost={staticPost} />
}


export const revalidate = 10

export async function generateStaticParams() {
    const result = await AppliesTypes.getAllSlugList();
    if (result.type === 'failure') return [];
    // Service returns [{ params: { slug } }], transform to [{ slug }]
    return result.data.map((item) => ({ slug: item.params.slug }));
  }