import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import PostDetail from '@/components/PostDetail'
import CommentSection from '@/components/CommentSection'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PostPage({ params }: PageProps) {
  const { id } = await params
  const user = await getCurrentUser()
  
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          email: true,
        },
      },
      _count: {
        select: { comments: true },
      },
    },
  })
  
  if (!post) {
    notFound()
  }
  
  const comments = await prisma.comment.findMany({
    where: { postId: id },
    orderBy: { createdAt: 'asc' },
    include: {
      author: {
        select: {
          id: true,
          email: true,
        },
      },
      votes: true,
    },
  })
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PostDetail post={post} />
      <div className="mt-8">
        <CommentSection 
          postId={id} 
          comments={comments} 
          currentUserId={user?.id} 
        />
      </div>
    </div>
  )
}

