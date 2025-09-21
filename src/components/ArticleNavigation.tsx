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
    <nav className="sticky top-24 w-64 hidden lg:block">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">
          Содержание
        </h3>
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={cn(
                  "block text-sm transition-colors hover:text-gray-900",
                  heading.level === 1 && "font-medium text-gray-900",
                  heading.level === 2 && "text-gray-700 ml-2",
                  heading.level === 3 && "text-gray-600 ml-4 text-xs",
                  heading.level === 4 && "text-gray-500 ml-6 text-xs",
                  activeHeading === heading.id && "text-blue-600 font-medium"
                )}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
