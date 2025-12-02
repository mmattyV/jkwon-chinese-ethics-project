'use client'

import { useState } from 'react'
import { formatDistanceToNow } from '@/lib/utils'
import CommentForm from './CommentForm'

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

interface CommentItemProps {
  comment: Comment
  replies: Comment[]
  allComments: Comment[]
  currentUserId?: string
  onCommentAdded: (comment: Comment) => void
  onVoteUpdate: (commentId: string, newVotes: any[]) => void
  depth?: number
}

export default function CommentItem({ 
  comment, 
  replies, 
  allComments,
  currentUserId,
  onCommentAdded,
  onVoteUpdate,
  depth = 0 
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [isVoting, setIsVoting] = useState(false)
  
  const score = comment.votes.reduce((sum, vote) => sum + vote.value, 0)
  const userVote = currentUserId 
    ? comment.votes.find(v => v.userId === currentUserId)?.value 
    : undefined
  
  const handleVote = async (value: 1 | -1) => {
    if (!currentUserId || isVoting) return
    
    setIsVoting(true)
    try {
      const response = await fetch(`/api/comments/${comment.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      })
      
      if (response.ok) {
        const data = await response.json()
        onVoteUpdate(comment.id, data.votes)
      }
    } catch (error) {
      console.error('Vote error:', error)
    } finally {
      setIsVoting(false)
    }
  }
  
  const handleReplyAdded = (newComment: Comment) => {
    onCommentAdded(newComment)
    setShowReplyForm(false)
  }
  
  const getReplies = (commentId: string): Comment[] => {
    return allComments.filter(c => c.parentCommentId === commentId)
  }
  
  const maxDepth = 6
  const indentClass = depth > 0 ? 'ml-8 pl-4 border-l-2 border-gray-200' : ''
  
  return (
    <div className={indentClass}>
      <div className="flex gap-4">
        {/* Vote buttons */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <button
            onClick={() => handleVote(1)}
            disabled={!currentUserId || isVoting}
            className={`p-1 rounded hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              userVote === 1 ? 'text-orange-500' : 'text-gray-400'
            }`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          <span className={`text-sm font-bold ${
            score > 0 ? 'text-orange-500' : score < 0 ? 'text-blue-500' : 'text-gray-600'
          }`}>
            {score}
          </span>
          
          <button
            onClick={() => handleVote(-1)}
            disabled={!currentUserId || isVoting}
            className={`p-1 rounded hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              userVote === -1 ? 'text-blue-500' : 'text-gray-400'
            }`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {/* Comment content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span className="font-medium text-gray-700">
              {comment.author.email.split('@')[0]}
            </span>
            <span>•</span>
            <span>{formatDistanceToNow(comment.createdAt)}</span>
          </div>
          
          <p className="text-gray-800 mb-3 whitespace-pre-wrap">
            {comment.content}
          </p>
          
          {currentUserId && depth < maxDepth && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-sm text-gray-600 hover:text-orange-600 font-medium"
            >
              {showReplyForm ? 'Cancel' : 'Reply'}
            </button>
          )}
          
          {showReplyForm && (
            <div className="mt-4">
              <CommentForm
                postId={comment.postId}
                parentCommentId={comment.id}
                onCommentAdded={handleReplyAdded}
                compact
              />
            </div>
          )}
          
          {/* Nested replies */}
          {replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {replies.map(reply => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  replies={getReplies(reply.id)}
                  allComments={allComments}
                  currentUserId={currentUserId}
                  onCommentAdded={onCommentAdded}
                  onVoteUpdate={onVoteUpdate}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

