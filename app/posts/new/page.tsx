import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import PostForm from '@/components/PostForm'

export default async function NewPostPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create a Post</h1>
        <PostForm />
      </div>
    </div>
  )
}

