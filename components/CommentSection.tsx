'use client'

import { useState } from 'react'
import CommentForm from './CommentForm'
import CommentThread from './CommentThread'

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

interface CommentSectionProps {
  postId: string
  comments: Comment[]
  currentUserId?: string
}

export default function CommentSection({ postId, comments: initialComments, currentUserId }: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments)
  
  const handleCommentAdded = (newComment: Comment) => {
    setComments([...comments, newComment])
  }
  
  const handleVoteUpdate = (commentId: string, newVotes: any[]) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, votes: newVotes }
        : comment
    ))
  }
  
  return (
    <div className="card p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Comments ({comments.length})
      </h2>
      
      {currentUserId && (
        <div className="mb-8">
          <CommentForm 
            postId={postId}
            onCommentAdded={handleCommentAdded}
          />
        </div>
      )}
      
      {!currentUserId && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
          <p className="text-gray-600">Please log in to comment</p>
        </div>
      )}
      
      <CommentThread 
        comments={comments}
        currentUserId={currentUserId}
        onCommentAdded={handleCommentAdded}
        onVoteUpdate={handleVoteUpdate}
      />
    </div>
  )
}


