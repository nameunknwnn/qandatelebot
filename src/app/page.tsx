import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Telegram Bot with Gemini AI</h1>
      <p className="text-xl mb-8">
        A Telegram bot powered by Google Gemini AI, built with Next.js
      </p>
      <Link 
        href="/dashboard" 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        View Dashboard
      </Link>
    </main>
  )
}