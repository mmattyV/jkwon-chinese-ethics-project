import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { saveUploadedFile } from '@/lib/upload'

// GET /api/posts - Get list of posts with pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit
    
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
    
    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get posts error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const formData = await request.formData()
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const imageFile = formData.get('image') as File | null
    const videoFile = formData.get('video') as File | null
    
    // Validate input
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }
    
    if (title.length < 3) {
      return NextResponse.json(
        { error: 'Title must be at least 3 characters long' },
        { status: 400 }
      )
    }
    
    // Can't upload both image and video
    if (imageFile && imageFile.size > 0 && videoFile && videoFile.size > 0) {
      return NextResponse.json(
        { error: 'You can upload either an image or a video, not both' },
        { status: 400 }
      )
    }
    
    let imageUrl: string | null = null
    let videoUrl: string | null = null
    
    // Handle image upload if provided
    if (imageFile && imageFile.size > 0) {
      try {
        imageUrl = await saveUploadedFile(imageFile, 'image')
      } catch (uploadError: any) {
        return NextResponse.json(
          { error: uploadError.message || 'Failed to upload image' },
          { status: 400 }
        )
      }
    }
    
    // Handle video upload if provided
    if (videoFile && videoFile.size > 0) {
      try {
        videoUrl = await saveUploadedFile(videoFile, 'video')
      } catch (uploadError: any) {
        return NextResponse.json(
          { error: uploadError.message || 'Failed to upload video' },
          { status: 400 }
        )
      }
    }
    
    // Create post
    const post = await prisma.post.create({
      data: {
        title,
        content,
        imageUrl,
        videoUrl,
        authorId: user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    })
    
    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error('Create post error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

