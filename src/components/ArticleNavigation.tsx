'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { ArrowUp } from 'lucide-react'

interface Heading {
  id: string
  text: string
  level: number
}

interface ArticleNavigationProps {
  headings: Heading[]
}

export default function ArticleNavigation({ headings }: ArticleNavigationProps) {
  const [activeHeading, setActiveHeading] = useState<string>('')

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-80px 0px -80% 0px',
      }
    )

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [headings])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (headings.length === 0) return null

  return (
    <div className="sticky top-8 col-span-3 col-start-10 hidden h-fit lg:block">
      <span className="text-lg font-medium">На этой странице</span>
      
      <nav className="mt-4 text-sm">
        <ul className="space-y-1">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={cn(
                  "block py-1 transition-colors duration-200",
                  "text-muted-foreground hover:text-primary",
                  activeHeading === heading.id && "text-primary font-medium"
                )}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="bg-border shrink-0 h-px w-full my-6"></div>

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Поделиться статьей</p>
        <ul className="flex gap-2">
          <li>
            <a href="#" className="hover:bg-muted inline-flex rounded-full border p-2 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook h-4 w-4">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
          </li>
          <li>
            <a href="#" className="hover:bg-muted inline-flex rounded-full border p-2 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter h-4 w-4">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </a>
          </li>
          <li>
            <a href="#" className="hover:bg-muted inline-flex rounded-full border p-2 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin h-4 w-4">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect width="4" height="12" x="2" y="9"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </li>
          <li>
            <a href="#" className="hover:bg-muted inline-flex rounded-full border p-2 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram h-4 w-4">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
              </svg>
            </a>
          </li>
        </ul>
      </div>

      <div className="mt-6">
        <button 
          onClick={scrollToTop}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
        >
          <ArrowUp className="h-4 w-4" />
          Наверх
        </button>
      </div>
    </div>
  )
}
