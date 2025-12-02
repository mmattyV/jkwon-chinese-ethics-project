import PostCard from './PostCard'

interface Post {
  id: string
  title: string
  content: string
  imageUrl: string | null
  videoUrl: string | null
  createdAt: Date
  author: {
    id: string
    email: string
  }
  _count: {
    comments: number
  }
  votes: Array<{
    id: string
    value: number
    userId: string
  }>
}

interface PostListProps {
  posts: Post[]
  currentUserId?: string
}

export default function PostList({ posts, currentUserId }: PostListProps) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} currentUserId={currentUserId} />
      ))}
    </div>
  )
}

