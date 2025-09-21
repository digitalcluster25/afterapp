import { useEffect, useState } from 'react'

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
      
      // Generate unique ID with index to avoid duplicates
      const baseId = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim()
      
      // Ensure ID is not empty and add index if needed
      let id = baseId || `heading-${extractedHeadings.length}`
      
      // Check for duplicates and add index
      let counter = 1
      let finalId = id
      while (extractedHeadings.some(h => h.id === finalId)) {
        finalId = `${id}-${counter}`
        counter++
      }

      extractedHeadings.push({
        id: finalId,
        text,
        level
      })
    }

    setHeadings(extractedHeadings)
  }, [content])

  return headings
}
