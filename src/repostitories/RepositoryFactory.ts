import PostRepository from "./PostRepository";
import PageRepository from "./PageRepository";

const RepositoryFactory = {
    post: PostRepository,
    page: PageRepository
//  news: NewsRepository ←　今後こんな感じで増えていく
}

export default RepositoryFactory