'use client'

import { useState, useEffect } from 'react'
import { TrackedParameter } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
  const maxValue = Math.max(...parameter.weekData.map(d => d.value), 1)
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{parameter.name}</CardTitle>
          <Badge variant="secondary">{parameter.unit}</Badge>
        </div>
        <CardDescription>
          Среднее за неделю: <span className="font-semibold">{parameter.weekAverage.toFixed(1)} {parameter.unit}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Столбчатый график */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-muted-foreground mb-2">Последние 7 дней</div>
          <div className="flex items-end justify-between gap-1 h-24">
            {parameter.weekData.map((day, index) => (
              <div key={index} className="flex flex-col items-center gap-1 flex-1">
                <div className="w-full bg-muted rounded-t-sm relative">
                  <div 
                    className="bg-primary rounded-t-sm transition-all duration-300"
                    style={{ 
                      height: `${maxValue > 0 ? (day.value / maxValue) * 80 : 0}px`,
                      minHeight: day.value > 0 ? '4px' : '0px'
                    }}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDate(day.date)}
                </div>
                {day.value > 0 && (
                  <div className="text-xs font-medium">
                    {day.value}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function WellnessDashboard() {
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
          
          return {
            ...param,
            values,
            weekAverage,
            weekData
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
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="text-muted-foreground">Загрузка дашборда...</div>
        </div>
      </div>
    )
  }

  if (parameters.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
              <div className="h-6 w-6 text-muted-foreground">📊</div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Нет данных для отображения</h3>
              <p className="text-muted-foreground">
                Добавьте параметры для отслеживания, чтобы увидеть аналитику
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground">
          Обзор параметров
        </h2>
        <p className="text-muted-foreground mt-1">
          Аналитика ваших отслеживаемых показателей за последнюю неделю
        </p>
      </div>

      {/* Виджеты параметров */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parameters.map((parameter) => (
          <ParameterWidget key={parameter.id} parameter={parameter} />
        ))}
      </div>
    </div>
  )
}