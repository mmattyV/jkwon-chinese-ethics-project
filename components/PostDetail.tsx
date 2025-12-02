import Image from 'next/image'
import { formatDistanceToNow } from '@/lib/utils'

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

interface PostDetailProps {
  post: Post
}

export default function PostDetail({ post }: PostDetailProps) {
  return (
    <article className="card p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {post.title}
      </h1>
      
      <div className="flex items-center text-sm text-gray-500 mb-6 space-x-4">
        <span>Posted by {post.author.email.split('@')[0]}</span>
        <span>•</span>
        <span>{formatDistanceToNow(post.createdAt)}</span>
      </div>
      
      {post.imageUrl && (
        <div className="mb-6">
          <div className="relative w-full max-w-2xl h-96 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
      
      <div className="prose max-w-none">
        <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
      </div>
    </article>
  )
}

