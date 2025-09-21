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
      const allValues: ParameterValue[] = []
      
      console.log('Loading parameter values for metrics:', selectedMetrics)
      
      // Load values for each selected parameter
      selectedMetrics.forEach(metric => {
        const key = `parameter_values_${metric.id}`
        const stored = localStorage.getItem(key)
        console.log(`Checking key: ${key}`, stored ? 'found' : 'not found')
        
        if (stored) {
          const values = JSON.parse(stored)
          console.log(`Found ${values.length} values for parameter ${metric.name}`)
          
          // Add parameterId to each value for filtering
          const valuesWithParamId = values.map((value: any) => ({
            ...value,
            parameterId: metric.id
          }))
          allValues.push(...valuesWithParamId)
        }
      })
      
      console.log(`Total values loaded: ${allValues.length}`)
      
      // Sort by date (newest first)
      allValues.sort((a: ParameterValue, b: ParameterValue) => b.timestamp - a.timestamp)
      
      setParameterValues(allValues)
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
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
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

  if (parameterValues.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            История показателей
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-2">
              Нет данных для выбранных показателей
            </p>
            <p className="text-sm text-muted-foreground">
              Добавьте значения в трекере велнеса для отслеживания прогресса
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          История показателей ({parameterValues.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {parameterValues.map((value, index) => (
            <div key={value.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {formatDate(value.date)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="font-medium">
                      {getParameterName(value.parameterId)}
                    </span>
                    <Badge variant="outline">
                      {value.value} {getParameterUnit(value.parameterId)}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
