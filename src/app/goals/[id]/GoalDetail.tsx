'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Goal, TrackedParameter, Article } from '@/types'
import PageWrapper from "@/components/PageWrapper"
import Section from "@/components/Section"
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
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Trash2, Edit3, Check, X } from "lucide-react"
import { StatusSelector } from '@/components/StatusSelector'
import GoalMetricsSelector from '@/components/GoalMetricsSelector'
import GoalMetricsHistory from '@/components/GoalMetricsHistory'
import GoalArticleSelector from '@/components/GoalArticleSelector'

interface GoalDetailProps {
  goalId: number
}


export default function GoalDetail({ goalId }: GoalDetailProps) {
  const router = useRouter()
  const [goal, setGoal] = useState<Goal | null>(null)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editingTitle, setEditingTitle] = useState('')
  const [selectedMetrics, setSelectedMetrics] = useState<TrackedParameter[]>([])
  const [showMetricsHistory, setShowMetricsHistory] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [goalValue, setGoalValue] = useState<number | null>(null)

  const loadSelectedMetrics = () => {
    if (typeof window !== 'undefined') {
      const key = `goal_metrics_${goalId}`
      const stored = localStorage.getItem(key)
      if (stored) {
        try {
          const metrics = JSON.parse(stored)
          setSelectedMetrics(metrics)
          // Если есть сохраненные показатели, показываем историю
          if (metrics.length > 0) {
            setShowMetricsHistory(true)
          }
        } catch (error) {
          console.error('Error loading selected metrics:', error)
        }
      }
    }
  }

  const loadSelectedArticle = () => {
    if (typeof window !== 'undefined') {
      const key = `goal_article_${goalId}`
      const stored = localStorage.getItem(key)
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

  const loadGoalValue = () => {
    if (typeof window !== 'undefined') {
      const key = `goal_value_${goalId}`
      const stored = localStorage.getItem(key)
      if (stored) {
        try {
          const value = parseInt(stored)
          setGoalValue(value)
        } catch (error) {
          console.error('Error loading goal value:', error)
        }
      }
    }
  }

  const saveGoalValue = (value: number) => {
    if (typeof window !== 'undefined') {
      const key = `goal_value_${goalId}`
      localStorage.setItem(key, value.toString())
    }
  }

  const saveSelectedMetrics = (metrics: TrackedParameter[]) => {
    if (typeof window !== 'undefined') {
      const key = `goal_metrics_${goalId}`
      localStorage.setItem(key, JSON.stringify(metrics))
    }
  }

  useEffect(() => {
    loadGoal()
    loadSelectedMetrics()
    loadSelectedArticle()
    loadGoalValue()
  }, [goalId])

  // Сохраняем показатели при их изменении
  useEffect(() => {
    if (selectedMetrics.length > 0) {
      saveSelectedMetrics(selectedMetrics)
    }
  }, [selectedMetrics])

  const loadGoal = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('goals')
      const goals = stored ? JSON.parse(stored) : []
      const foundGoal = goals.find((g: Goal) => g.id === goalId)
      setGoal(foundGoal || null)
    }
  }


  const handleStartEdit = () => {
    if (goal) {
      setEditingTitle(goal.title)
      setIsEditingTitle(true)
    }
  }

  const handleSaveEdit = () => {
    if (!editingTitle.trim()) {
      alert('Название цели не может быть пустым')
      return
    }

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('goals')
      const goals = stored ? JSON.parse(stored) : []
      const updatedGoals = goals.map((g: Goal) => 
        g.id === goalId ? { ...g, title: editingTitle.trim() } : g
      )
      localStorage.setItem('goals', JSON.stringify(updatedGoals))
      setGoal({ ...goal!, title: editingTitle.trim() })
      
      // Уведомляем другие компоненты об изменении
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'goals',
        newValue: JSON.stringify(updatedGoals),
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

  const handleDeleteGoal = () => {
    if (typeof window !== 'undefined') {
      // Удаляем цель
      const stored = localStorage.getItem('goals')
      const goals = stored ? JSON.parse(stored) : []
      const updatedGoals = goals.filter((g: Goal) => g.id !== goalId)
      localStorage.setItem('goals', JSON.stringify(updatedGoals))

      // Удаляем активности
      localStorage.removeItem(`goal_activities_${goalId}`)

      // Уведомляем другие компоненты об изменении
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'goals',
        newValue: JSON.stringify(updatedGoals),
        storageArea: localStorage
      }))

      // Перенаправляем на главную страницу целей
      router.push('/goals')
    }
  }

  const handleUpdateStatus = (newStatus: 'active' | 'completed' | 'paused') => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('goals')
      const goals = stored ? JSON.parse(stored) : []
      const updatedGoals = goals.map((g: Goal) => 
        g.id === goalId ? { ...g, status: newStatus } : g
      )
      localStorage.setItem('goals', JSON.stringify(updatedGoals))
      setGoal({ ...goal!, status: newStatus })
      
      // Уведомляем другие компоненты об изменении
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'goals',
        newValue: JSON.stringify(updatedGoals),
        storageArea: localStorage
      }))
    }
  }

  const handleAddMetrics = () => {
    if (selectedMetrics.length > 0) {
      saveSelectedMetrics(selectedMetrics)
      setShowMetricsHistory(true)
    }
  }

  const handleArticleSelect = (article: Article) => {
    setSelectedArticle(article)
  }

  const handleGoalValueSelect = (value: number) => {
    setGoalValue(value)
    saveGoalValue(value)
  }

  if (!goal) {
    return (
      <Section>
        <PageWrapper>
          <div className="text-center py-12">
            <p className="text-gray-500">Цель не найдена</p>
            <button
              onClick={() => router.push('/goals')}
              className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Вернуться к списку
            </button>
          </div>
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
          onClick={() => router.push('/goals')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад к списку
        </Button>
      </div>

      {/* Header */}
      <Card className="mb-8 border-0 shadow-none">
        <CardHeader>
          <div>
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
                  <CardTitle className="text-3xl">
                    {goal.title}
                  </CardTitle>
                )}
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
                        variant="destructive"
                        size="icon"
                        className="size-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Удалить цель?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Вы уверены, что хотите удалить эту цель? Все активности будут потеряны. Это действие нельзя отменить.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteGoal}>
                          Удалить
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <StatusSelector
                selectedStatus={goal.status}
                onStatusChange={handleUpdateStatus}
              />
            </div>
          </div>
          
        </CardHeader>
      </Card>

      {/* Goal Value Selector */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Оценка цели на сегодня</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center gap-3">
            {[1, 2, 3, 4, 5, 6, 7].map((value) => (
              <button
                key={value}
                onClick={() => handleGoalValueSelect(value)}
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-lg font-semibold transition-all hover:scale-110 ${
                  goalValue === value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-foreground border-muted-foreground hover:border-primary'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Goal Metrics Selector */}
      <div className="space-y-4">
        <GoalMetricsSelector
          selectedMetrics={selectedMetrics}
          onMetricsChange={setSelectedMetrics}
        />
        
        {/* Add Metrics Button */}
        {selectedMetrics.length > 0 && !showMetricsHistory && (
          <div className="flex justify-center">
            <Button onClick={handleAddMetrics}>
              Добавить показатели
            </Button>
          </div>
        )}
        
        {/* Metrics History */}
        {showMetricsHistory && (
          <GoalMetricsHistory selectedMetrics={selectedMetrics} goalValue={goalValue} />
        )}
      </div>

      {/* Article Selector */}
      <div className="mt-8">
        <GoalArticleSelector 
          onArticleSelect={handleArticleSelect}
          selectedArticleId={selectedArticle?.id}
          goalId={goalId}
        />
      </div>

      </PageWrapper>
    </Section>
  )
}
