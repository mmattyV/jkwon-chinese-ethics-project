'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface PostVoteButtonsProps {
  postId: string
  initialVotes: Array<{
    id: string
    value: number
    userId: string
  }>
  currentUserId?: string
  vertical?: boolean
}

export default function PostVoteButtons({ 
  postId, 
  initialVotes,
  currentUserId,
  vertical = false
}: PostVoteButtonsProps) {
  const router = useRouter()
  const [votes, setVotes] = useState(initialVotes)
  const [isVoting, setIsVoting] = useState(false)
  
  const score = votes.reduce((sum, vote) => sum + vote.value, 0)
  const userVote = currentUserId 
    ? votes.find(v => v.userId === currentUserId)?.value 
    : undefined
  
  const handleVote = async (value: 1 | -1) => {
    if (!currentUserId) {
      router.push('/auth/login')
      return
    }
    
    if (isVoting) return
    
    setIsVoting(true)
    try {
      const response = await fetch(`/api/posts/${postId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setVotes(data.votes)
        router.refresh()
      }
    } catch (error) {
      console.error('Vote error:', error)
    } finally {
      setIsVoting(false)
    }
  }
  
  const containerClass = vertical
    ? 'flex flex-col items-center gap-1'
    : 'flex items-center gap-3'
  
  return (
    <div className={containerClass}>
      <button
        onClick={() => handleVote(1)}
        disabled={isVoting}
        className={`p-1 rounded hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          userVote === 1 ? 'text-cerulean-500' : 'text-gray-400'
        }`}
        title={currentUserId ? 'Upvote' : 'Login to vote'}
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
      </button>
      
      <span className={`text-sm font-bold min-w-[2rem] text-center ${
        score > 0 ? 'text-cerulean-500' : score < 0 ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {score}
      </span>
      
      <button
        onClick={() => handleVote(-1)}
        disabled={isVoting}
        className={`p-1 rounded hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          userVote === -1 ? 'text-gray-600' : 'text-gray-400'
        }`}
        title={currentUserId ? 'Downvote' : 'Login to vote'}
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  )
}


