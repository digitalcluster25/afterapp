'use client'

import { useState, useEffect } from 'react'
import { Goal } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target } from "lucide-react"
import Link from 'next/link'
import GoalCard from './GoalCard'

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
      <div className="space-y-6">
        {/* Заголовок */}
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Статус целей
          </h2>
          <p className="text-muted-foreground mt-1">
            Прогресс ваших целей на сегодня
          </p>
        </div>

        {/* Пустое состояние */}
        <Card>
          <CardContent>
            <div className="text-center py-8">
              <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
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
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground">
          Статус целей
        </h2>
        <p className="text-muted-foreground mt-1">
          Прогресс ваших целей на сегодня
        </p>
      </div>

      {/* Виджеты целей */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
      
      {/* Ссылка на управление целями */}
      <div className="text-center pt-4">
        <Link 
          href="/goals" 
          className="text-sm text-primary hover:underline font-medium"
        >
          Управление целями →
        </Link>
      </div>
    </div>
  )
}
