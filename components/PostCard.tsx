import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from '@/lib/utils'
import PostVoteButtons from './PostVoteButtons'

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

interface PostCardProps {
  post: Post
  currentUserId?: string
}

export default function PostCard({ post, currentUserId }: PostCardProps) {
  const contentPreview = post.content.length > 200 
    ? post.content.substring(0, 200) + '...' 
    : post.content
  
  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex gap-4 p-6">
        {/* Vote buttons */}
        <div className="flex-shrink-0">
          <PostVoteButtons
            postId={post.id}
            initialVotes={post.votes}
            currentUserId={currentUserId}
            vertical
          />
        </div>
        
        {/* Post content */}
        <Link href={`/posts/${post.id}`} className="flex-1 min-w-0 flex gap-4">
          {/* Media thumbnail */}
          {(post.imageUrl || post.videoUrl) && (
            <div className="flex-shrink-0">
              <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
                {post.imageUrl && (
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                )}
                {post.videoUrl && !post.imageUrl && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-cerulean-600 cursor-pointer">
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
        </Link>
      </div>
    </div>
  )
}

