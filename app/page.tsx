import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import PostList from '@/components/PostList'
import Pagination from '@/components/Pagination'

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const limit = 10
  const skip = (page - 1) * limit
  
  const user = await getCurrentUser()
  
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
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
        votes: true,
      },
    }),
    prisma.post.count(),
  ])
  
  const totalPages = Math.ceil(total / limit)
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Home Feed</h1>
        <p className="text-gray-600 mt-1">Latest posts from the community</p>
      </div>
      
      {posts.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-500 text-lg">No posts yet. Be the first to create one!</p>
        </div>
      ) : (
        <>
          <PostList posts={posts} currentUserId={user?.id} />
          {totalPages > 1 && (
            <Pagination currentPage={page} totalPages={totalPages} />
          )}
        </>
      )}
    </div>
  )
}

