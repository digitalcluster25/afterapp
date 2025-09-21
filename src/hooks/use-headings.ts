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

    // Extract headings from markdown content
    const headingRegex = /^(#{1,6})\s+(.+)$/gm
    const extractedHeadings: Heading[] = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const text = match[2].trim()
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim()

      extractedHeadings.push({
        id,
        text,
        level
      })
    }

    setHeadings(extractedHeadings)
  }, [content])

  return headings
}
