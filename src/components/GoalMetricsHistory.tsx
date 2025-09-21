'use client'

import { useState, useEffect, useCallback } from 'react'
import { TrackedParameter } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, TrendingUp } from "lucide-react"

interface ParameterValue {
  id: number
  parameterId: number
  value: number
  date: string
  timestamp: number
}

interface GoalMetricsHistoryProps {
  selectedMetrics: TrackedParameter[]
}

export default function GoalMetricsHistory({ selectedMetrics }: GoalMetricsHistoryProps) {
  const [parameterValues, setParameterValues] = useState<ParameterValue[]>([])

  const loadParameterValues = useCallback(() => {
    if (typeof window !== 'undefined') {
      const today = new Date()
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)
      
      const todayValues: ParameterValue[] = []
      
      console.log('Loading today\'s parameter values for metrics:', selectedMetrics)
      
      // Load values for each selected parameter - only today's data
      selectedMetrics.forEach(metric => {
        const key = `parameter_values_${metric.id}`
        const stored = localStorage.getItem(key)
        console.log(`Checking key: ${key}`, stored ? 'found' : 'not found')
        
        if (stored) {
          const values = JSON.parse(stored)
          console.log(`Found ${values.length} values for parameter ${metric.name}`)
          
          // Filter only today's values
          const todayMetricValues = values
            .filter((value: any) => {
              const valueDate = new Date(value.date)
              return valueDate >= todayStart && valueDate <= todayEnd
            })
            .map((value: any) => ({
              ...value,
              parameterId: metric.id
            }))
          
          console.log(`Found ${todayMetricValues.length} today's values for parameter ${metric.name}`)
          todayValues.push(...todayMetricValues)
        }
      })
      
      console.log(`Total today's values loaded: ${todayValues.length}`)
      
      // Sort by time (newest first)
      todayValues.sort((a: ParameterValue, b: ParameterValue) => b.timestamp - a.timestamp)
      
      setParameterValues(todayValues)
    }
  }, [selectedMetrics])

  useEffect(() => {
    loadParameterValues()
    
    // Listen for storage changes to update when new values are added
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('parameter_values_')) {
        loadParameterValues()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [selectedMetrics, loadParameterValues])

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch (error) {
      return dateString
    }
  }

  const getParameterName = (parameterId: number) => {
    const parameter = selectedMetrics.find(p => p.id === parameterId)
    return parameter ? parameter.name : `Параметр ${parameterId}`
  }

  const getParameterUnit = (parameterId: number) => {
    const parameter = selectedMetrics.find(p => p.id === parameterId)
    return parameter ? parameter.unit : ''
  }

  if (selectedMetrics.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Показатели на сегодня
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedMetrics.map((metric) => {
          // Find today's values for this specific metric
          const metricValues = parameterValues.filter(value => value.parameterId === metric.id)
          
          return (
            <div key={metric.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <span className="font-medium">{metric.name}</span>
                {metricValues.length > 0 ? (
                  <Badge variant="outline">
                    {metricValues[0].value} {metric.unit}
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-muted-foreground">
                    Нет данных на сегодня
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Сегодня</span>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
