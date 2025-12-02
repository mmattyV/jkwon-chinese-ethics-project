import Link from 'next/link'
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

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const contentPreview = post.content.length > 200 
    ? post.content.substring(0, 200) + '...' 
    : post.content
  
  return (
    <Link href={`/posts/${post.id}`}>
      <div className="card p-6 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex gap-4">
          {post.imageUrl && (
            <div className="flex-shrink-0">
              <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-orange-600">
              {post.title}
            </h2>
            
            <p className="text-gray-700 mb-3 line-clamp-3">
              {contentPreview}
            </p>
            
            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <span>Posted by {post.author.email.split('@')[0]}</span>
              <span>•</span>
              <span>{formatDistanceToNow(post.createdAt)}</span>
              <span>•</span>
              <span>{post._count.comments} {post._count.comments === 1 ? 'comment' : 'comments'}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

