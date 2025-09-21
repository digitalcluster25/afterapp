// Directus integration based on BRD.md technical requirements
import { WellnessParameter, TrackedParameter, Goal, Article } from '@/types'

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'https://directus-production-3727.up.railway.app'

export async function getWellnessParameters(): Promise<{ data: WellnessParameter[] }> {
  try {
    const response = await fetch(`${DIRECTUS_URL}/items/welness_parameters`)
    if (!response.ok) {
      throw new Error('Failed to fetch wellness parameters')
    }
    const rawData = await response.json()
    
    // Map Directus data to our WellnessParameter interface
    const mappedData = rawData.data.map((item: any) => ({
      id: item.id,
      name: item.parameter_ru || item.welness_parameter_name,
      unit: item.unit,
      description: item.physical_effects,
      ranges: [
        {
          label: 'Критически низкий',
          min: undefined,
          max: parseFloat(item.min_value?.replace(/[<>%]/g, '') || '0'),
          description: 'Требует внимания'
        },
        {
          label: 'Низкий',
          min: parseFloat(item.min_value?.replace(/[<>%]/g, '') || '0'),
          max: parseFloat(item.low_value?.replace(/[<>%]/g, '') || '0'),
          description: 'Ниже нормы'
        },
        {
          label: 'Средний',
          min: parseFloat(item.low_value?.replace(/[<>%]/g, '') || '0'),
          max: parseFloat(item.medium_value?.replace(/[<>%]/g, '') || '0'),
          description: 'Нормальный уровень'
        },
        {
          label: 'Высокий',
          min: parseFloat(item.medium_value?.replace(/[<>%]/g, '') || '0'),
          max: parseFloat(item.high_value?.replace(/[<>%]/g, '') || '0'),
          description: 'Выше нормы'
        }
      ]
    }))
    
    return { data: mappedData }
  } catch (error) {
    console.error('Error fetching wellness parameters:', error)
    return { data: [] }
  }
}

export async function getTrackedParameters(): Promise<{ data: TrackedParameter[] }> {
  // Временное решение: используем localStorage, так как tracked_parameters не имеет публичного доступа
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('tracked_parameters')
    const parameters = stored ? JSON.parse(stored) : []
    return { data: parameters }
  }
  return { data: [] }
}

export async function createTrackedParameter(data: Omit<TrackedParameter, 'id'>): Promise<{ data: TrackedParameter }> {
  // Временное решение: сохраняем в localStorage
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('tracked_parameters')
    const parameters = stored ? JSON.parse(stored) : []
    
    const newParameter: TrackedParameter = {
      id: Date.now(),
      name: data.name,
      unit: data.unit,
      userId: data.userId
    }
    
    parameters.push(newParameter)
    localStorage.setItem('tracked_parameters', JSON.stringify(parameters))
    
    return { data: newParameter }
  }
  
  throw new Error('localStorage not available')
}

export async function getGoals(): Promise<{ data: Goal[] }> {
  // Временное решение: используем localStorage, так как goals может не иметь публичного доступа
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('goals')
    const goals = stored ? JSON.parse(stored) : []
    return { data: goals }
  }
  return { data: [] }
}

export async function createGoal(data: Omit<Goal, 'id'>): Promise<{ data: Goal }> {
  // Временное решение: сохраняем в localStorage
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('goals')
    const goals = stored ? JSON.parse(stored) : []
    
    const newGoal: Goal = {
      id: Date.now(),
      title: data.title,
      status: data.status,
      isCustom: data.isCustom,
      userId: data.userId
    }
    
    goals.push(newGoal)
    localStorage.setItem('goals', JSON.stringify(goals))
    
    return { data: newGoal }
  }
  
  throw new Error('localStorage not available')
}

export async function getArticles(): Promise<{ data: Article[] }> {
  try {
    // Add timeout and proper error handling
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
    
    const response = await fetch(`${DIRECTUS_URL}/items/spravochnik`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching articles:', error)
    
    // Always return mock articles as fallback
    try {
      const { mockArticles } = await import('@/data/mockArticles')
      return { data: mockArticles }
    } catch (importError) {
      console.error('Error importing mock articles:', importError)
      return { data: [] }
    }
  }
}