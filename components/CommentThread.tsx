'use client'

import CommentItem from './CommentItem'

interface Comment {
  id: string
  postId: string
  content: string
  createdAt: Date
  parentCommentId: string | null
  author: {
    id: string
    email: string
  }
  votes: Array<{
    id: string
    value: number
    userId: string
  }>
}

interface CommentThreadProps {
  comments: Comment[]
  currentUserId?: string
  onCommentAdded: (comment: Comment) => void
  onVoteUpdate: (commentId: string, newVotes: any[]) => void
}

export default function CommentThread({ 
  comments, 
  currentUserId,
  onCommentAdded,
  onVoteUpdate
}: CommentThreadProps) {
  // Build comment tree
  const topLevelComments = comments.filter(c => !c.parentCommentId)
  
  const getReplies = (commentId: string): Comment[] => {
    return comments.filter(c => c.parentCommentId === commentId)
  }
  
  if (topLevelComments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No comments yet. Be the first to comment!
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {topLevelComments.map(comment => (
        <CommentItem
          key={comment.id}
          comment={comment}
          replies={getReplies(comment.id)}
          allComments={comments}
          currentUserId={currentUserId}
          onCommentAdded={onCommentAdded}
          onVoteUpdate={onVoteUpdate}
        />
      ))}
    </div>
  )
}

