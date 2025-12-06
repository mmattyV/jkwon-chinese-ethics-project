import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

// POST /api/comments - Create a new comment
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { postId, content, parentCommentId } = body
    
    // Validate input
    if (!postId || !content) {
      return NextResponse.json(
        { error: 'Post ID and content are required' },
        { status: 400 }
      )
    }
    
    if (content.trim().length < 1) {
      return NextResponse.json(
        { error: 'Comment cannot be empty' },
        { status: 400 }
      )
    }
    
    // Verify post exists
    const postExists = await prisma.post.findUnique({
      where: { id: postId },
    })
    
    if (!postExists) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }
    
    // If parentCommentId is provided, verify it exists
    if (parentCommentId) {
      const parentExists = await prisma.comment.findUnique({
        where: { id: parentCommentId },
      })
      
      if (!parentExists) {
        return NextResponse.json(
          { error: 'Parent comment not found' },
          { status: 404 }
        )
      }
    }
    
    // Create comment
    const comment = await prisma.comment.create({
      data: {
        postId,
        content,
        authorId: user.id,
        parentCommentId: parentCommentId || null,
      },
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
    
    return NextResponse.json({ comment }, { status: 201 })
  } catch (error) {
    console.error('Create comment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


