import PostCard from './PostCard'

interface Post {
  id: string
  title: string
  content: string
  imageUrl: string | null
  createdAt: Date
  author: {
    id: string
    email: string
  }
  _count: {
    comments: number
  }
}

interface PostListProps {
  posts: Post[]
}

export default function PostList({ posts }: PostListProps) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}

