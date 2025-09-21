// Types based on BRD.md functional requirements

export interface WellnessParameter {
  id: number
  name: string
  unit: string
  description?: string
  ranges: ParameterRange[]
}

export interface ParameterRange {
  label: string
  min?: number
  max?: number
  description: string
}

export interface TrackedParameter {
  id: number
  name: string
  unit: string
  currentValue?: string
  lastUpdated?: string
  userId: string
}

export interface ParameterValue {
  id: number
  parameterId: number
  value: string
  date: string
  time: string
  notes?: string
}

export interface Goal {
  id: number
  title: string
  status: 'active' | 'completed' | 'paused' | 'cancelled'
  isCustom: boolean
  userId: string
}

export interface Article {
  id: number
  title: string
  content?: string
  category?: string
  publishedAt?: string
  date_created?: string
  summary?: string
  author?: string
  description?: string
}
