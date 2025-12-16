'use client'

import usePostSwr from "@/hooks/swr/usePostSwr";
import PostType from "@/types/PostType";

import Layout from "@/components/layouts/Layout";
import PostContent from "@/components/layouts/PostContent";

import Link from "next/link";
import DateText from "@/components/atoms/text/DateText";
import ModifiedText from "@/components/atoms/text/ModifiedText";
import PostNav from "@/components/molecules/PostNav";
import ReactionGroup from "@/components/molecules/Reaction-group";

import { useEffect } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";


export default function PostClient({
    slug,
    staticPost,
}: {
    slug: string,
    staticPost: PostType
}) {
    const post = usePostSwr({ id: slug, staticPost})
    useEffect(() => {
        hljs.highlightAll();
    }, [post?.content]);


    return(
        
    <Layout>
        <div className="pt-10 mx-auto max-w-[var(--breakpoint-md)]">
            {/* <div className="w-full object-contain  mb-4">
                    <img
                        
                        src={post!.featuredImage.url}
                        alt="投稿のサムネイル"
                        />
            </div> */}
            <div className=" pt-10 flex justify-center gap-15 w-full">
                    <article className="w-full bg-(--color-primary-main) border border-[var(--color-divider-main)] rounded-lg shadow-[var(--shadow-lg)]">
                        <div >
                            <div className="p-4  rounded-md ">
                                <div>
                                    <h1 className="text-4xl font-bold">{post!.title}</h1>
                                </div>
                                <div >
                                    <div className="pt-6 flex justify-end gap-4">
                                        <ModifiedText>{post?.modified}</ModifiedText>
                                        <DateText>{post!.date}</DateText>
                                    </div>
                                    <div className="pt-2 flex align-center">
                                        <Link href={`/category/${post!.category.slug}`}>
                                                <div className="p-2 inline-block rounded-md border border-(--color-divider-main) bg-(--color-background-default)">
                                                    {post!.category.name}
                                                </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <PostContent>
                                <div className=" p-6   break-all" dangerouslySetInnerHTML={{__html: post!.content}}></div>

                            </PostContent>

                        </div>
                    </article>

            </div>
            <ReactionGroup contentId={post!.slug}/>
			<PostNav slug={post!.slug}></PostNav>
            </div>
        </Layout>
    );
}

