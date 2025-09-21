import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: ':after',
  description: 'Система управления здоровьем и активностью',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-background text-foreground flex flex-col">
        <Navigation />
        <main className="container mx-auto px-4 py-8 flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
