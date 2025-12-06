import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

// POST /api/comments/[id]/vote - Vote on a comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const { id: commentId } = await params
    const body = await request.json()
    const { value } = body
    
    // Validate input
    if (value !== 1 && value !== -1) {
      return NextResponse.json(
        { error: 'Vote value must be 1 (like) or -1 (dislike)' },
        { status: 400 }
      )
    }
    
    // Verify comment exists
    const commentExists = await prisma.comment.findUnique({
      where: { id: commentId },
    })
    
    if (!commentExists) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }
    
    // Check for existing vote
    const existingVote = await prisma.commentVote.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId: user.id,
        },
      },
    })
    
    if (existingVote) {
      if (existingVote.value === value) {
        // Same vote - remove it (toggle off)
        await prisma.commentVote.delete({
          where: { id: existingVote.id },
        })
      } else {
        // Different vote - update it
        await prisma.commentVote.update({
          where: { id: existingVote.id },
          data: { value },
        })
      }
    } else {
      // No existing vote - create new one
      await prisma.commentVote.create({
        data: {
          commentId,
          userId: user.id,
          value,
        },
      })
    }
    
    // Calculate new score
    const votes = await prisma.commentVote.findMany({
      where: { commentId },
    })
    
    const score = votes.reduce((sum, vote) => sum + vote.value, 0)
    
    return NextResponse.json({ score, votes })
  } catch (error) {
    console.error('Vote comment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


