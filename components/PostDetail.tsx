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

interface PostDetailProps {
  post: Post
  currentUserId?: string
}

export default function PostDetail({ post, currentUserId }: PostDetailProps) {
  return (
    <article className="card p-8">
      <div className="flex gap-6">
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
        <div className="flex-1 min-w-0">
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
          
          {post.videoUrl && (
            <div className="mb-6">
              <div className="relative w-full max-w-2xl rounded-lg overflow-hidden bg-gray-100">
                <video
                  src={post.videoUrl}
                  controls
                  className="w-full"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          )}
          
          <div className="prose max-w-none">
            <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
          </div>
        </div>
      </div>
    </article>
  )
}

