import LoginForm from '@/components/LoginForm'

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Log In</h1>
        <LoginForm />
      </div>
    </div>
  )
}


