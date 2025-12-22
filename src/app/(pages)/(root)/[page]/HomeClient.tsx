'use client'
import usePostListSwr from "@/hooks/swr/usePostListSwr";
import PostListType from "@/types/PostListType";
import CategoryType from "@/types/CategoryType";
//component
import Layout from "@/components/layouts/Layout";
import PostBox from "@/components/molecules/PostBox";
import AboutBox from "@/components/molecules/AboutBox";
import Pagination from "@/components/molecules/Pagination";
import PostConst from "@/constants/PostConst";

import CategoryLinks from "@/components/molecules/CategoryLinks";

 

export default function HomeClient({
    staticPostList,
    staticTotal,
    currentPage,
    categories
}: {
    staticPostList: PostListType[],
    staticTotal: number,
    currentPage: number,
    categories: CategoryType[]

}) {
    const [postList, total] = usePostListSwr({
        staticPostList,
        staticTotal,
        currentPage
    })

   

    return (
        <Layout>
            <div className='pt-10 mx-auto lg:max-w-screen-lg'>
                <div className='flex gap-10 justify-center'>
                    <div className='grid grid-cols-2 gap-4  w-170'>
                        {postList.map((post) => {
                            return <PostBox key={post.id} post={post} />
                        })}
                    </div>
                    <div>
                        <a href="http://localhost:8000/portfolio/">ポートフォリオ</a>
                        <AboutBox></AboutBox>
                       <CategoryLinks categories={categories}></CategoryLinks>
                    </div>
                </div>
                <Pagination total={total} sizePerPage={PostConst.sizePerPage} currentPage={currentPage} path="" />
            </div>
        </Layout>
    )
}