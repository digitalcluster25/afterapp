'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

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
                onClick={(e) => {
                  e.preventDefault()
                  const element = document.getElementById(heading.id)
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                }}
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

    </div>
  )
}
