'use client'

import { useState } from 'react'

interface CommentFormProps {
  postId: string
  parentCommentId?: string
  onCommentAdded: (comment: any) => void
  compact?: boolean
}

export default function CommentForm({ 
  postId, 
  parentCommentId,
  onCommentAdded,
  compact = false
}: CommentFormProps) {
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim()) {
      setError('Comment cannot be empty')
      return
    }
    
    setError('')
    setLoading(true)
    
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          postId, 
          content: content.trim(),
          parentCommentId: parentCommentId || null
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || 'Failed to post comment')
        return
      }
      
      onCommentAdded(data.comment)
      setContent('')
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
          {error}
        </div>
      )}
      
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={parentCommentId ? 'Write a reply...' : 'What are your thoughts?'}
        rows={compact ? 3 : 4}
        className="input resize-none"
        disabled={loading}
      />
      
      <button
        type="submit"
        disabled={loading || !content.trim()}
        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Posting...' : 'Comment'}
      </button>
    </form>
  )
}

