import { useEffect, useState } from 'react'
import { generateHeadingId } from '@/lib/heading-utils'

export interface Heading {
  id: string
  text: string
  level: number
}

export function useHeadings(content: string): Heading[] {
  const [headings, setHeadings] = useState<Heading[]>([])

  useEffect(() => {
    if (!content) {
      setHeadings([])
      return
    }

    // Extract headings from markdown content (only H1 and H2)
    const headingRegex = /^(#{1,2})\s+(.+)$/gm
    const extractedHeadings: Heading[] = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const text = match[2].trim()
      
      // Generate unique ID using utility function
      const existingIds = extractedHeadings.map(h => h.id)
      const id = generateHeadingId(text, existingIds)

      extractedHeadings.push({
        id,
        text,
        level
      })
    }

    console.log('useHeadings extracted headings:', extractedHeadings)
    setHeadings(extractedHeadings)
  }, [content])

  return headings
}
