'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TrackedParameter } from '@/types'
import { Button } from "@/components/ui/button"
import { createTrackedParameter, getTrackedParameters } from '@/lib/directus'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, ChevronRight } from "lucide-react"

interface ParameterWithLatestValue extends TrackedParameter {
  latestValue?: string
  latestDate?: string
}

export default function WellnessTracker() {
  const [parameters, setParameters] = useState<ParameterWithLatestValue[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [parameterName, setParameterName] = useState('')
  const [parameterUnit, setParameterUnit] = useState('')
  const [loading, setLoading] = useState(false)

  const loadParameters = async () => {
    const data = await getTrackedParameters()
    const parametersWithValues = data.data.map((param: TrackedParameter) => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(`parameter_values_${param.id}`)
        const values = stored ? JSON.parse(stored) : []
        const latestValue = values.length > 0 ? values[0] : null
        
        return {
          ...param,
          latestValue: latestValue?.value,
          latestDate: latestValue?.date
        }
      }
      return param
    })
    setParameters(parametersWithValues)
  }

  useEffect(() => {
    loadParameters()
    
    const handleFocus = () => loadParameters()
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith('parameter_values_') || e.key === 'tracked_parameters') {
        loadParameters()
      }
    }
    const handleVisibilityChange = () => {
      if (!document.hidden) loadParameters()
    }
    
    window.addEventListener('focus', handleFocus)
    window.addEventListener('storage', handleStorageChange)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('storage', handleStorageChange)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const handleAddParameter = async () => {
    if (!parameterName.trim() || !parameterUnit.trim()) {
      alert('Пожалуйста, заполните все поля')
      return
    }

    try {
      setLoading(true)
      
      const newParameter = await createTrackedParameter({
        name: parameterName.trim(),
        unit: parameterUnit.trim(),
        userId: 'user_1'
      })

      // Обновляем список параметров
      await loadParameters()
      setParameterName('')
      setParameterUnit('')
      setShowAddForm(false)
    } catch (error) {
      console.error('Error creating parameter:', error)
      alert('Ошибка при создании параметра')
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Отслеживаемые параметры
          </h2>
          <p className="text-muted-foreground mt-1">
            Управляйте своими персональными показателями здоровья
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Добавить параметр
        </Button>
      </div>

      {/* Add parameter form */}
      {showAddForm && (
        <Card className="animate-in slide-in-from-top-2 duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Создать новый параметр
            </CardTitle>
            <CardDescription>
              Добавьте параметр для отслеживания ваших показателей
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="parameter-name">Название параметра</Label>
                <Input
                  id="parameter-name"
                  value={parameterName}
                  onChange={(e) => setParameterName(e.target.value)}
                  placeholder="Например: Вес"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parameter-unit">Единица измерения</Label>
                <Input
                  id="parameter-unit"
                  value={parameterUnit}
                  onChange={(e) => setParameterUnit(e.target.value)}
                  placeholder="Например: кг"
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="flex gap-3">
              <Button 
                onClick={handleAddParameter}
                disabled={loading || !parameterName.trim() || !parameterUnit.trim()}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                {loading ? 'Создание...' : 'Создать параметр'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAddForm(false)}
              >
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Parameters list */}
      {parameters.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Нет отслеживаемых параметров</h3>
                <p className="text-muted-foreground">
                  Начните отслеживать свои показатели здоровья
                </p>
              </div>
              <Button onClick={() => setShowAddForm(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Добавить первый параметр
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            {parameters.map((parameter, index) => (
              <div key={parameter.id}>
                <div className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-4 flex-1">
                    <h3 className="text-lg font-medium">
                      {parameter.name}
                    </h3>
                    <Badge variant="secondary">
                      {parameter.unit}
                    </Badge>
                    {parameter.latestValue && (
                      <span className="text-sm text-muted-foreground">
                        {parameter.latestValue} {parameter.unit}
                      </span>
                    )}
                  </div>
                  
                  <Link href={`/wellness-tracker/parameter/${parameter.id}`}>
                    <Button variant="ghost" size="sm" className="gap-2">
                      Подробнее
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
                {index < parameters.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}