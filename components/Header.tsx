import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import LogoutButton from './LogoutButton'

export default async function Header() {
  const user = await getCurrentUser()
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Reddit Clone</span>
          </Link>
          
          <nav className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/posts/new" className="btn-primary">
                  Create Post
                </Link>
                <span className="text-sm text-gray-600">
                  {user.email}
                </span>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn-outline">
                  Log In
                </Link>
                <Link href="/auth/signup" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

