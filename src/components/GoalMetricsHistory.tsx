'use client'

import { useState, useEffect } from 'react'
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

  useEffect(() => {
    loadParameterValues()
  }, [selectedMetrics])

  const loadParameterValues = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('parameter_values')
      const allValues = stored ? JSON.parse(stored) : []
      
      // Filter values for selected metrics only
      const selectedParameterIds = selectedMetrics.map(m => m.id)
      const filteredValues = allValues.filter((value: ParameterValue) => 
        selectedParameterIds.includes(value.parameterId)
      )
      
      // Sort by date (newest first)
      filteredValues.sort((a: ParameterValue, b: ParameterValue) => b.timestamp - a.timestamp)
      
      setParameterValues(filteredValues)
    }
  }

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
