import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import PostList from '@/components/PostList'
import Pagination from '@/components/Pagination'

interface PageProps {
  searchParams: Promise<{ page?: string; sort?: string }>
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const sort = params.sort || 'hot' // 'hot' (by votes) or 'new' (by date)
  const limit = 10
  const skip = (page - 1) * limit
  
  const user = await getCurrentUser()
  
  // Fetch all posts with votes (we'll sort in memory)
  const [allPosts, total] = await Promise.all([
    prisma.post.findMany({
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
  
  // Calculate vote score for each post and sort
  const postsWithScores = allPosts.map(post => ({
    ...post,
    voteScore: post.votes.reduce((sum, vote) => sum + vote.value, 0)
  }))
  
  // Sort based on selected method
  const sortedPosts = postsWithScores.sort((a, b) => {
    if (sort === 'hot') {
      // Sort by vote score, then by date if scores are equal
      if (b.voteScore !== a.voteScore) {
        return b.voteScore - a.voteScore
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else {
      // Sort by newest first
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })
  
  // Apply pagination after sorting
  const posts = sortedPosts.slice(skip, skip + limit)
  
  const totalPages = Math.ceil(total / limit)
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Home Feed</h1>
            <p className="text-gray-600 mt-1">Latest posts from the community</p>
          </div>
          
          {/* Sort Toggle */}
          <div className="flex gap-2">
            <a
              href="/?sort=hot"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                sort === 'hot'
                  ? 'bg-cerulean-500 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              🔥 Hot
            </a>
            <a
              href="/?sort=new"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                sort === 'new'
                  ? 'bg-cerulean-500 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              ✨ New
            </a>
          </div>
        </div>
      </div>
      
      {posts.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-500 text-lg">No posts yet. Be the first to create one!</p>
        </div>
      ) : (
        <>
          <PostList posts={posts} currentUserId={user?.id} />
          {totalPages > 1 && (
            <Pagination currentPage={page} totalPages={totalPages} sortBy={sort} />
          )}
        </>
      )}
    </div>
  )
}

