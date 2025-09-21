'use client'

import { useState, useEffect } from 'react'
import { TrackedParameter } from '@/types'
import { getTrackedParameters } from '@/lib/directus'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X } from "lucide-react"

interface GoalMetricsSelectorProps {
  selectedMetrics: TrackedParameter[]
  onMetricsChange: (metrics: TrackedParameter[]) => void
}

export default function GoalMetricsSelector({ 
  selectedMetrics, 
  onMetricsChange 
}: GoalMetricsSelectorProps) {
  const [availableParameters, setAvailableParameters] = useState<TrackedParameter[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadParameters = async () => {
      try {
        const data = await getTrackedParameters()
        setAvailableParameters(data.data)
      } catch (error) {
        console.error('Error loading parameters:', error)
      } finally {
        setLoading(false)
      }
    }

    loadParameters()
  }, [])

  const handleAddMetric = (parameterId: string) => {
    const parameter = availableParameters.find(p => p.id.toString() === parameterId)
    if (parameter && !selectedMetrics.find(m => m.id === parameter.id)) {
      onMetricsChange([...selectedMetrics, parameter])
    }
  }

  const handleRemoveMetric = (parameterId: number) => {
    onMetricsChange(selectedMetrics.filter(m => m.id !== parameterId))
  }

  const availableForSelection = availableParameters.filter(
    param => !selectedMetrics.find(selected => selected.id === param.id)
  )

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Показатели цели</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Загрузка параметров...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Показатели цели</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add metric selector */}
        {availableForSelection.length > 0 && (
          <div className="flex items-center gap-3">
            <Select onValueChange={handleAddMetric}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Выберите параметр для отслеживания" />
              </SelectTrigger>
              <SelectContent>
                {availableForSelection.map((parameter) => (
                  <SelectItem key={parameter.id} value={parameter.id.toString()}>
                    {parameter.name} ({parameter.unit})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Selected metrics */}
        {selectedMetrics.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Выбранные показатели ({selectedMetrics.length}):
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedMetrics.map((metric) => (
                <Badge
                  key={metric.id}
                  variant="secondary"
                  className="flex items-center gap-2 px-3 py-1"
                >
                  <span>{metric.name} ({metric.unit})</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 w-4 h-4 hover:bg-transparent"
                    onClick={() => handleRemoveMetric(metric.id)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-2">
              Показатели не выбраны
            </p>
            <p className="text-sm text-muted-foreground">
              Выберите параметры из трекера для отслеживания прогресса цели
            </p>
          </div>
        )}

        {/* No parameters available */}
        {availableParameters.length === 0 && (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-2">
              Нет доступных параметров
            </p>
            <p className="text-sm text-muted-foreground">
              Сначала создайте параметры в трекере велнеса
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
