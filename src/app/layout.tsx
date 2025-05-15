import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Telegram Bot with Gemini',
  description: 'A Telegram bot powered by Google Gemini AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}