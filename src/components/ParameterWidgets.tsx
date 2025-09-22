'use client'

import { useState, useEffect } from 'react'
import { TrackedParameter } from '@/types'
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface ParameterValue {
  id: number
  value: string
  date: string
  time: string
  notes?: string
}

interface ParameterWithValues extends TrackedParameter {
  values: ParameterValue[]
  weekAverage: number
  weekData: { date: string; value: number }[]
  trend: 'up' | 'down' | 'stable'
  trendPercentage: number
}

// Функция для получения данных за последние 7 дней
const getWeekData = (values: ParameterValue[]): { date: string; value: number }[] => {
  const today = new Date()
  const weekData = []
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateString = date.toISOString().split('T')[0]
    
    const dayValue = values.find(v => v.date === dateString)
    weekData.push({
      date: dateString,
      value: dayValue ? parseFloat(dayValue.value) || 0 : 0
    })
  }
  
  return weekData
}

// Функция для вычисления среднего арифметического
const calculateWeekAverage = (weekData: { date: string; value: number }[]): number => {
  const values = weekData.filter(d => d.value > 0).map(d => d.value)
  return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0
}

// Функция для вычисления тренда
const calculateTrend = (weekData: { date: string; value: number }[]): { trend: 'up' | 'down' | 'stable', percentage: number } => {
  const values = weekData.filter(d => d.value > 0).map(d => d.value)
  if (values.length < 2) return { trend: 'stable', percentage: 0 }
  
  const firstHalf = values.slice(0, Math.floor(values.length / 2))
  const secondHalf = values.slice(Math.floor(values.length / 2))
  
  const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length
  const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length
  
  const percentage = ((secondAvg - firstAvg) / firstAvg) * 100
  
  if (Math.abs(percentage) < 5) return { trend: 'stable', percentage: 0 }
  return percentage > 0 ? { trend: 'up', percentage: Math.abs(percentage) } : { trend: 'down', percentage: Math.abs(percentage) }
}

// Функция для форматирования даты
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', { 
    day: 'numeric', 
    month: 'short' 
  })
}

// Компонент виджета параметра
const ParameterWidget = ({ parameter }: { parameter: ParameterWithValues }) => {
  const getTrendIcon = () => {
    switch (parameter.trend) {
      case 'up':
        return <TrendingUp className="size-4" />
      case 'down':
        return <TrendingDown className="size-4" />
      default:
        return <Minus className="size-4" />
    }
  }

  const getTrendColor = () => {
    switch (parameter.trend) {
      case 'up':
        return 'text-green-600 dark:text-green-400'
      case 'down':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-muted-foreground'
    }
  }

  const getTrendText = () => {
    switch (parameter.trend) {
      case 'up':
        return `Рост на ${parameter.trendPercentage.toFixed(1)}%`
      case 'down':
        return `Снижение на ${parameter.trendPercentage.toFixed(1)}%`
      default:
        return 'Стабильные показатели'
    }
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{parameter.name}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {parameter.weekAverage.toFixed(1)} {parameter.unit}
        </CardTitle>
        <CardAction>
          <Badge variant="outline" className={getTrendColor()}>
            {getTrendIcon()}
            {parameter.trendPercentage > 0 && `${parameter.trendPercentage.toFixed(1)}%`}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className={`line-clamp-1 flex gap-2 font-medium ${getTrendColor()}`}>
          {getTrendText()} {getTrendIcon()}
        </div>
        <div className="text-muted-foreground">
          Среднее за последние 7 дней
        </div>
      </CardFooter>
    </Card>
  )
}

export default function ParameterWidgets() {
  const [parameters, setParameters] = useState<ParameterWithValues[]>([])
  const [loading, setLoading] = useState(true)

  const loadParameters = () => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('tracked_parameters')
        const parametersData = stored ? JSON.parse(stored) : []
        
        const parametersWithValues = (parametersData || []).map((param: TrackedParameter) => {
          const storedValues = localStorage.getItem(`parameter_values_${param.id}`)
          const values: ParameterValue[] = storedValues ? JSON.parse(storedValues) : []
          const weekData = getWeekData(values)
          const weekAverage = calculateWeekAverage(weekData)
          const trendData = calculateTrend(weekData)
          
          return {
            ...param,
            values,
            weekAverage,
            weekData,
            trend: trendData.trend,
            trendPercentage: trendData.percentage
          }
        })
        setParameters(parametersWithValues)
      }
    } catch (error) {
      console.error('Error loading parameters:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadParameters()
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith('parameter_values_') || e.key === 'tracked_parameters') {
        loadParameters()
      }
    }
    const handleVisibilityChange = () => {
      if (!document.hidden) loadParameters()
    }
    
    window.addEventListener('storage', handleStorageChange)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground">Загрузка виджетов...</div>
      </div>
    )
  }

  if (parameters.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardDescription>Нет данных для отображения</CardDescription>
          <CardTitle className="text-lg">Добавьте параметры для отслеживания</CardTitle>
        </CardHeader>
        <CardFooter>
          <div className="text-muted-foreground text-sm">
            Перейдите в трекер, чтобы добавить параметры и увидеть аналитику
          </div>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {parameters.map((parameter) => (
        <ParameterWidget key={parameter.id} parameter={parameter} />
      ))}
    </div>
  )
}
