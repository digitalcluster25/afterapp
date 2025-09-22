'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TrackedParameter } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Edit3, 
  AlertCircle,
  Check,
  X
} from "lucide-react"
import PageWrapper from "@/components/PageWrapper"
import Section from "@/components/Section"
import ArticleSelector from "@/components/ArticleSelector"

interface ParameterDetailProps {
  parameterId: number
}

interface ParameterValue {
  id: number
  value: string
  date: string
  time: string
  notes?: string
}

// Функция для форматирования даты в формат "28 сент. 2025"
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const months = [
    'янв.', 'фев.', 'мар.', 'апр.', 'май', 'июн.',
    'июл.', 'авг.', 'сент.', 'окт.', 'нояб.', 'дек.'
  ]
  
  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  
  return `${day} ${month} ${year}`
}

// Функции для фильтрации значений по периодам
const getWeekValues = (values: ParameterValue[]): ParameterValue[] => {
  const now = new Date()
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
  weekStart.setHours(0, 0, 0, 0)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 7)
  
  return values.filter(value => {
    const valueDate = new Date(value.date)
    return valueDate >= weekStart && valueDate < weekEnd
  })
}

const getMonthValues = (values: ParameterValue[]): ParameterValue[] => {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  
  return values.filter(value => {
    const valueDate = new Date(value.date)
    return valueDate >= monthStart && valueDate < monthEnd
  })
}

const getSeasonValues = (values: ParameterValue[]): ParameterValue[] => {
  const now = new Date()
  const month = now.getMonth()
  let seasonStart: Date, seasonEnd: Date
  
  if (month >= 2 && month <= 4) { // Весна
    seasonStart = new Date(now.getFullYear(), 2, 1)
    seasonEnd = new Date(now.getFullYear(), 5, 1)
  } else if (month >= 5 && month <= 7) { // Лето
    seasonStart = new Date(now.getFullYear(), 5, 1)
    seasonEnd = new Date(now.getFullYear(), 8, 1)
  } else if (month >= 8 && month <= 10) { // Осень
    seasonStart = new Date(now.getFullYear(), 8, 1)
    seasonEnd = new Date(now.getFullYear(), 11, 1)
  } else { // Зима
    seasonStart = new Date(now.getFullYear() - 1, 11, 1)
    seasonEnd = new Date(now.getFullYear(), 2, 1)
  }
  
  return values.filter(value => {
    const valueDate = new Date(value.date)
    return valueDate >= seasonStart && valueDate < seasonEnd
  })
}

const getYearValues = (values: ParameterValue[]): ParameterValue[] => {
  const now = new Date()
  const yearStart = new Date(now.getFullYear(), 0, 1)
  const yearEnd = new Date(now.getFullYear() + 1, 0, 1)
  
  return values.filter(value => {
    const valueDate = new Date(value.date)
    return valueDate >= yearStart && valueDate < yearEnd
  })
}

// Компонент для отображения списка значений
const ValuesList = ({ values, parameter, onDeleteValue }: { 
  values: ParameterValue[], 
  parameter: TrackedParameter, 
  onDeleteValue: (id: number) => void 
}) => {
  if (values.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Нет записанных значений</p>
        <p className="text-sm text-muted-foreground mt-1">
          Добавьте первое значение для начала отслеживания
        </p>
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        {values
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map((value, index) => (
          <div key={value.id}>
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="text-lg font-medium">
                  {value.value} {parameter.unit}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(value.date)}
                </div>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Удалить значение?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Вы уверены, что хотите удалить это значение? Это действие нельзя отменить.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDeleteValue(value.id)}>
                      Удалить
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            {index < values.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default function ParameterDetail({ parameterId }: ParameterDetailProps) {
  const router = useRouter()
  const [parameter, setParameter] = useState<TrackedParameter | null>(null)
  const [values, setValues] = useState<ParameterValue[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newValue, setNewValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editingTitle, setEditingTitle] = useState('')
  const [selectedArticle, setSelectedArticle] = useState<any>(null)

  useEffect(() => {
    loadParameter()
    loadValues()
    loadSelectedArticle()
  }, [parameterId])

  const loadSelectedArticle = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`parameter_article_${parameterId}`)
      if (stored) {
        try {
          const article = JSON.parse(stored)
          setSelectedArticle(article)
        } catch (error) {
          console.error('Error loading selected article:', error)
        }
      }
    }
  }

  const handleArticleSelect = (article: any) => {
    setSelectedArticle(article)
    if (typeof window !== 'undefined') {
      localStorage.setItem(`parameter_article_${parameterId}`, JSON.stringify(article))
    }
  }

  const loadParameter = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('tracked_parameters')
      const parameters = stored ? JSON.parse(stored) : []
      const foundParameter = parameters.find((p: TrackedParameter) => p.id === parameterId)
      setParameter(foundParameter || null)
    }
  }

  const loadValues = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`parameter_values_${parameterId}`)
      const parameterValues = stored ? JSON.parse(stored) : []
      setValues(parameterValues)
    }
  }

  const handleAddValue = async () => {
    if (!newValue.trim()) return

    // Проверяем, есть ли уже значение за эту дату
    const existingValueForDate = values.find(v => v.date === date)
    if (existingValueForDate) {
      alert('Значение за эту дату уже добавлено. Можно добавить только одно значение в день.')
      return
    }

    try {
      setLoading(true)
      
      const newValueObj: ParameterValue = {
        id: Date.now(),
        value: newValue.trim(),
        date: date,
        time: new Date().toTimeString().split(' ')[0].substring(0, 5)
      }

      const updatedValues = [newValueObj, ...values]
      localStorage.setItem(`parameter_values_${parameterId}`, JSON.stringify(updatedValues))
      setValues(updatedValues)
      
      window.dispatchEvent(new StorageEvent('storage', {
        key: `parameter_values_${parameterId}`,
        newValue: JSON.stringify(updatedValues),
        storageArea: localStorage
      }))
      
      setNewValue('')
      setShowAddForm(false)
    } catch (error) {
      console.error('Ошибка добавления значения:', error)
      alert('Ошибка при добавлении значения')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteValue = (valueId: number) => {
    const updatedValues = values.filter(v => v.id !== valueId)
    localStorage.setItem(`parameter_values_${parameterId}`, JSON.stringify(updatedValues))
    setValues(updatedValues)
    
    window.dispatchEvent(new StorageEvent('storage', {
      key: `parameter_values_${parameterId}`,
      newValue: JSON.stringify(updatedValues),
      storageArea: localStorage
    }))
  }

  const handleStartEdit = () => {
    if (parameter) {
      setEditingTitle(parameter.name)
      setIsEditingTitle(true)
    }
  }

  const handleSaveEdit = () => {
    if (!editingTitle.trim()) {
      alert('Название параметра не может быть пустым')
      return
    }

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('tracked_parameters')
      const parameters = stored ? JSON.parse(stored) : []
      const updatedParameters = parameters.map((p: TrackedParameter) => 
        p.id === parameterId ? { ...p, name: editingTitle.trim() } : p
      )
      localStorage.setItem('tracked_parameters', JSON.stringify(updatedParameters))
      setParameter({ ...parameter!, name: editingTitle.trim() })
      
      // Уведомляем другие компоненты об изменении
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'tracked_parameters',
        newValue: JSON.stringify(updatedParameters),
        storageArea: localStorage
      }))
    }
    
    setIsEditingTitle(false)
    setEditingTitle('')
  }

  const handleCancelEdit = () => {
    setIsEditingTitle(false)
    setEditingTitle('')
  }

  const handleDeleteParameter = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('tracked_parameters')
      const parameters = stored ? JSON.parse(stored) : []
      const updatedParameters = parameters.filter((p: TrackedParameter) => p.id !== parameterId)
      localStorage.setItem('tracked_parameters', JSON.stringify(updatedParameters))
      localStorage.removeItem(`parameter_values_${parameterId}`)
      router.push('/wellness-tracker')
    }
  }

  if (!parameter) {
    return (
      <Section>
        <PageWrapper>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Параметр не найден</h3>
                  <p className="text-muted-foreground">
                    Запрашиваемый параметр не существует или был удален
                  </p>
                </div>
                <Button onClick={() => router.push('/wellness-tracker')} className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Вернуться к списку
                </Button>
              </div>
            </CardContent>
          </Card>
        </PageWrapper>
      </Section>
    )
  }


  return (
    <Section>
      <PageWrapper>
      {/* Back Button */}
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={() => router.push('/wellness-tracker')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад к списку
        </Button>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            {isEditingTitle ? (
              <Input
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                className="text-3xl font-semibold h-auto border-2 border-primary shadow-md p-2 focus-visible:ring-0 text-foreground !text-3xl bg-background"
                style={{ 
                  fontSize: '1.875rem', 
                  lineHeight: '2.25rem',
                  letterSpacing: '0'
                }}
                autoFocus
              />
            ) : (
              <h1 className="text-3xl font-semibold">
                {parameter.name}
              </h1>
            )}
            <Badge variant="secondary">{parameter.unit}</Badge>
            <div className="flex space-x-2">
              {isEditingTitle ? (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={handleSaveEdit}
                    disabled={!editingTitle.trim()}
                    className="size-8"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={handleCancelEdit}
                    className="size-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleStartEdit}
                  className="size-8"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Удалить параметр?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Вы уверены, что хотите удалить этот параметр? Все значения будут потеряны. Это действие нельзя отменить.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteParameter}>
                      Удалить
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>

      {/* Values History with Tabs */}
      <div>
        <div className="flex items-center gap-4 mb-4">
          <Button
            onClick={() => setShowAddForm(true)}
            size="sm"
            className="gap-2"
            disabled={showAddForm}
          >
            <Plus className="h-4 w-4" />
            Добавить значение
          </Button>
          
          {showAddForm && (
            <div className="flex items-center space-x-2">
              <Input
                id="value"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder={`Введите значение в ${parameter.unit}`}
                className="flex-1"
              />
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-auto [&::-webkit-calendar-picker-indicator]:hidden [&::-moz-calendar-picker-indicator]:hidden"
              />
              <Button 
                onClick={handleAddValue}
                disabled={loading || !newValue.trim()}
                size="icon"
                className="size-8"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAddForm(false)}
                size="icon"
                className="size-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        <Tabs defaultValue="week" className="w-full">
          <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-auto">
            <TabsTrigger value="week">Неделя</TabsTrigger>
            <TabsTrigger value="month">Месяц</TabsTrigger>
            <TabsTrigger value="season">Сезон</TabsTrigger>
            <TabsTrigger value="year">Год</TabsTrigger>
          </TabsList>
          
          <TabsContent value="week">
            <ValuesList values={getWeekValues(values)} parameter={parameter} onDeleteValue={handleDeleteValue} />
          </TabsContent>
          
          <TabsContent value="month">
            <ValuesList values={getMonthValues(values)} parameter={parameter} onDeleteValue={handleDeleteValue} />
          </TabsContent>
          
          <TabsContent value="season">
            <ValuesList values={getSeasonValues(values)} parameter={parameter} onDeleteValue={handleDeleteValue} />
          </TabsContent>
          
          <TabsContent value="year">
            <ValuesList values={getYearValues(values)} parameter={parameter} onDeleteValue={handleDeleteValue} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Article Selector */}
      <div className="mt-8">
        <ArticleSelector 
          onArticleSelect={handleArticleSelect}
          selectedArticleId={selectedArticle?.id}
        />
      </div>

      </PageWrapper>
    </Section>
  )
}