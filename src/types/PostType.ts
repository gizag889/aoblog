import FeaturedImageType from "./FeaturedImageType";
import CategoryType from "./CategoryType";

interface PostType {
  id: string;
  title: string;
  slug: string;
  date: string;
  content: string;
  modified: string;
  featuredImage: FeaturedImageType;
  categories: CategoryType[];
}

export default PostType;
