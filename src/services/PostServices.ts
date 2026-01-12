import RepositoryFactory from "../repostitories/RepositoryFactory";
//types
import PostListType from "@/types/PostListType";
import PostType from "@/types/PostType";
import OffsetPaginationType from "@/types/OffsetPaginationType";
import PageType from "@/types/PageType";

import PostConst from "@/constants/PostConst";

// WordPress API レスポンス型定義
interface WpPostEdge {
  node: {
    id: string;
    title: string;
    slug: string;
    date: string;
    modified: string;
    excerpt: string;
    featuredImage: {
      node: {
        sourceUrl: string;
      };
    };
    categories: {
      edges: Array<{
        node: {
          slug: string;
          name: string;
        };
      }>;
    };
  };
}

interface WpCategoryEdge {
  node: {
    slug: string;
    name?: string;
    posts?: {
      pageInfo: {
        offsetPagination: {
          total: number;
        };
      };
    };
  };
}

interface WpPage {
  page: {
    title: string;
    content: string;
  };
}

import { Result, success, failure } from "@/types/Result";

//postservice
class AppliesTypes {
  static async getPage(): Promise<Result<PageType, Error>> {
    try {
      const res = await RepositoryFactory.page.getPage();
      const data = res.data.data.page;
      return success({
        title: data.title,
        content: data.content,
      });
    } catch (error) {
      console.error("❌ getPage エラー発生:");
      console.error("エラー詳細:", error);
      console.error(
        "エラースタック:",
        error instanceof Error ? error.stack : "スタック情報なし"
      );

      return failure(
        error instanceof Error ? error : new Error("Unknown error")
      );
    }
  }

  static async getTotalCategory(): Promise<
    Result<{ params: { param: string[] } }[], Error>
  > {
    try {
      // 2. 結果を格納する配列を初期化
      const paths: { params: { param: string[] } }[] = [];

      const res = await RepositoryFactory.post.getAllCategorySlugList();

      res.data.data.categories.edges.forEach((data: WpCategoryEdge) => {
        const categorySlug = data.node.slug;
        const total = data.node.posts?.pageInfo.offsetPagination.total ?? 0;
        const pageList = AppliesTypes._makePageList(total);

        pageList.forEach((page: number) => {
          // 2. 'getTotalCategory.push' を 'paths.push' に修正
          paths.push({
            params: {
              param: ["category", categorySlug, "page", page.toString()],
            },
          });
        });
      });

      // 3. 結果の配列を return
      return success(paths);
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error("Unknown error")
      );
    }
  }

  private static _makePageList(total: number) {
    const pageTotal = Math.ceil(total / PostConst.sizePerPage);
    return [...Array(pageTotal)].map((_, i) => i + 1);
  }

  static async getList({
    categoryId,
    page,
  }: {
    categoryId?: number;
    page: number;
    //「非同期通信を行い、完了後に『記事リスト』と『記事総数』のセットを返す」
  }): Promise<Result<[PostListType[], number], Error>> {
    try {
      const offsetPagination = this._makeOffsetPaginationFromPage(page);

      const res = await RepositoryFactory.post.getList({
        categoryId,
        offsetPagination,
      });

      const postList = res.data.data.posts.edges.map((data: WpPostEdge) => {
        const post: PostListType = {
          id: data.node.id,
          title: data.node.title,
          slug: data.node.slug,
          date: data.node.date,
          modified: data.node.modified,
          excerpt: data.node.excerpt,
          featuredImage: {
            url: AppliesTypes._replaceUrl(
              data.node.featuredImage.node.sourceUrl
            ),
          },
          category: {
            slug: data.node.categories.edges[0].node.slug,
            name: data.node.categories.edges[0].node.name,
          },
        };
        return post;
      });

      const total = res.data.data.posts.pageInfo.offsetPagination.total;

      return success([postList, total]);
    } catch (error) {


      return failure(
        error instanceof Error ? error : new Error("Unknown error")
      );
    }
  }

  // すべてのカテゴリ（name/slug）を取得
  static async getAllCategories(): Promise<
    Result<{ slug: string; name: string }[], Error>
  > {
    try {
      const res = await RepositoryFactory.post.getAllCategories();
      return success(
        res.data.data.categories.edges.map((edge: WpCategoryEdge) => ({
          slug: edge.node.slug,
          name: edge.node.name ?? "",
        }))
      );
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error("Unknown error")
      );
    }
  }

  // slugから記事単体を取得
  static async getOne({
    id,
  }: {
    id: string;
  }): Promise<Result<PostType, Error>> {
    // エラーがあればnullを返す
    try {
      const res = await RepositoryFactory.post.getOne({ id }); // idを引数に取る
      const data = res.data.data.post;
      // dataがnullの場合のハンドリングも必要だが、ここではRepositoryが投げるか構造が違うと仮定
      if (!data) {
        return failure(new Error("Post not found"));
      }

      const post: PostType = {
        id: data.id,
        title: data.title,
        slug: data.slug,
        date: data.date,
        content: AppliesTypes._replaceUrl(data.content),
        modified: data.modified,
        featuredImage: {
          url: AppliesTypes._replaceUrl(data.featuredImage.node.sourceUrl),
        },
        categories: data.categories.edges.map(
          (edge: { node: { slug: string; name: string } }) => ({
            slug: edge.node.slug,
            name: edge.node.name,
          })
        ),
      };
      return success(post); // 配列ではなくPostTypeを返す
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error("Unknown error")
      );
    }
  }

  static async getAllSlugList(): Promise<
    Result<
      {
        params: {
          slug: string;
        };
      }[],
      Error
    >
  > {
    try {
      const res = await RepositoryFactory.post.getAllSlugList();
      return success(
        res.data.data.posts.edges.map((data: WpPostEdge) => {
          return { params: { slug: data.node.slug } };
        })
      );
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error("Unknown error")
      );
    }
  }

  // 全カテゴリーのスラッグを取得（getAllSlugListに微妙にまとめにくので別メソッドを分ける）
  static async getAllCategorySlugList(): Promise<
    Result<
      {
        params: {
          slug: string;
        };
      }[],
      Error
    >
  > {
    try {
      const res = await RepositoryFactory.post.getAllCategorySlugList();
      return success(
        res.data.data.categories.edges.map((data: WpCategoryEdge) => {
          return { params: { slug: data.node.slug } };
        })
      );
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error("Unknown error")
      );
    }
  }

  static async getAllPageList(): Promise<
    Result<
      {
        params: {
          page: string;
        };
      }[],
      Error
    >
  > {
    try {
      const totalResult = await this.getTotal();
      if (totalResult.type === "failure") return failure(totalResult.error);

      const total = totalResult.data;
      const pageTotal = Math.ceil(total / PostConst.sizePerPage);
      const pageList = [...Array(pageTotal)].map((_, i) => i + 1);
      return success(
        pageList.map((page: number) => {
          return { params: { page: page.toString() } };
        })
      );
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error("Unknown error")
      );
    }
  }

  // スラッグからカテゴリーIDを取得する
  static async getCategoryIdBySlug({
    slug,
  }: {
    slug: string;
  }): Promise<Result<number, Error>> {
    try {
      const res = await RepositoryFactory.post.getCategoryIdBySlug({ slug });
      return success(res.data.data.category.categoryId);
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error("Unknown error")
      );
    }
  }

  static async getTotal(): Promise<Result<number, Error>> {
    try {
      const res = await RepositoryFactory.post.getTotal();
      return success(res.data.data.posts.pageInfo.offsetPagination.total);
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error("Unknown error")
      );
    }
  }

  private static _makeOffsetPaginationFromPage(
    page: number
  ): OffsetPaginationType {
    return {
      offset: (page - 1) * PostConst.sizePerPage,
      size: PostConst.sizePerPage,
    };
  }

  private static _replaceUrl(content: string): string {
    const wpUrl = process.env.NEXT_PUBLIC_WP_URL;
    if (!wpUrl) return content;
    const escapedUrl = wpUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return content.replace(new RegExp(escapedUrl, "g"), "");
  }
}

export default AppliesTypes;
