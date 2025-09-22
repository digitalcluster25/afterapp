'use client'

import { useState, useEffect } from 'react'
import { Goal } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, CheckCircle, Pause, Clock } from "lucide-react"
import Link from 'next/link'

interface GoalWithValue extends Goal {
  todayValue?: number | null
}

export default function GoalsStatusWidget() {
  const [goals, setGoals] = useState<GoalWithValue[]>([])
  const [loading, setLoading] = useState(true)

  const loadGoals = () => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('goals')
        const goalsData = stored ? JSON.parse(stored) : []
        
        // Load today's values for each goal
        const goalsWithValues = goalsData.map((goal: Goal) => {
          const goalValueKey = `goal_value_${goal.id}`
          const storedValue = localStorage.getItem(goalValueKey)
          const todayValue = storedValue ? parseInt(storedValue) : null
          
          return {
            ...goal,
            todayValue
          }
        })
        
        setGoals(goalsWithValues)
      }
    } catch (error) {
      console.error('Error loading goals:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGoals()
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'goals' || (e.key && e.key.startsWith('goal_value_'))) {
        loadGoals()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Target className="w-4 h-4" />
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'paused':
        return <Pause className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Активная'
      case 'completed':
        return 'Завершена'
      case 'paused':
        return 'Приостановлена'
      default:
        return 'Неизвестно'
    }
  }

  const getProgressValue = (goal: GoalWithValue) => {
    if (!goal.todayValue) return 0
    return (goal.todayValue / 7) * 100
  }

  const getProgressColor = (goal: GoalWithValue) => {
    if (!goal.todayValue) return 'bg-gray-200'
    if (goal.todayValue >= 6) return 'bg-green-500'
    if (goal.todayValue >= 4) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-6 text-center text-muted-foreground">
          Загрузка целей...
        </CardContent>
      </Card>
    )
  }

  if (goals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Статус целей
          </CardTitle>
          <CardDescription>
            Отслеживайте прогресс ваших целей
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="text-muted-foreground mb-4">
              У вас пока нет целей
            </div>
            <Link 
              href="/goals" 
              className="text-primary hover:underline font-medium"
            >
              Создать первую цель
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Статус целей
        </CardTitle>
        <CardDescription>
          Прогресс ваших целей на сегодня
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link 
                  href={`/goals/${goal.id}`}
                  className="font-medium hover:underline"
                >
                  {goal.title}
                </Link>
                <Badge 
                  variant="outline" 
                  className={`${getStatusColor(goal.status)} border-0`}
                >
                  {getStatusIcon(goal.status)}
                  <span className="ml-1">{getStatusText(goal.status)}</span>
                </Badge>
              </div>
              {goal.todayValue && (
                <div className="text-sm font-medium text-muted-foreground">
                  {goal.todayValue}/7
                </div>
              )}
            </div>
            
            {goal.todayValue ? (
              <div className="space-y-1">
                <Progress 
                  value={getProgressValue(goal)} 
                  className="h-2"
                />
                <div className="text-xs text-muted-foreground">
                  Оценка на сегодня: {goal.todayValue} баллов
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Оценка не выбрана
              </div>
            )}
          </div>
        ))}
        
        <div className="pt-2 border-t">
          <Link 
            href="/goals" 
            className="text-sm text-primary hover:underline font-medium"
          >
            Управление целями →
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
