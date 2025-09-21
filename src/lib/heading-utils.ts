// Utility functions for heading ID generation

export function generateHeadingId(text: string, existingIds: string[] = []): string {
  // Generate base ID from text
  const baseId = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim()
  
  // Ensure ID is not empty
  let id = baseId || `heading-${existingIds.length}`
  
  // Check for duplicates and add counter
  let counter = 1
  let finalId = id
  while (existingIds.includes(finalId)) {
    finalId = `${id}-${counter}`
    counter++
  }
  
  return finalId
}
