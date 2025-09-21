'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Goal } from '@/types'
import { createGoal, getGoals } from '@/lib/directus'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function GoalsModule() {
  const [goals, setGoals] = useState<Goal[]>([])

  const loadGoals = async () => {
    const data = await getGoals()
    setGoals(data.data)
  }

  useEffect(() => {
    loadGoals()
    
    // Обновляем данные при возврате на страницу
    const handleFocus = () => {
      loadGoals()
    }
    
    // Обновляем при изменении localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'goals') {
        loadGoals()
      }
    }
    
    // Обновляем при возврате видимости страницы
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadGoals()
      }
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
  const [showAddForm, setShowAddForm] = useState(false)
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAddGoal = async () => {
    if (!title.trim()) {
      alert('Пожалуйста, введите название цели')
      return
    }

    try {
      setLoading(true)
      
      const newGoal = await createGoal({
        title: title.trim(),
        status: 'active',
        isCustom: true,
        userId: 'user_1'
      })

      setGoals([...goals, newGoal.data])
      setTitle('')
      setShowAddForm(false)
    } catch (error) {
      console.error('Error creating goal:', error)
      alert('Ошибка при создании цели')
    } finally {
      setLoading(false)
    }
  }

  const handleEditGoal = (goal: Goal) => {
    const newTitle = prompt('Введите новое название цели:', goal.title)
    if (newTitle && newTitle.trim() !== goal.title) {
      // TODO: Implement update functionality
      setGoals(goals.map(g => 
        g.id === goal.id ? { ...g, title: newTitle.trim() } : g
      ))
    }
  }


  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'active': return 'default'
      case 'completed': return 'secondary'
      case 'paused': return 'outline'
      case 'cancelled': return 'destructive'
      default: return 'secondary'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активная'
      case 'completed': return 'Выполнена'
      case 'paused': return 'Приостановлена'
      case 'cancelled': return 'Отменена'
      default: return status
    }
  }

  return (
    <div className="space-y-6">
      {/* Add goal button */}
      <div className="flex justify-end items-center">
        <Button
          onClick={() => setShowAddForm(true)}
        >
          + Добавить цель
        </Button>
      </div>

      {/* Add goal form */}
      {showAddForm && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">
              Добавить цель
            </h3>
            
            <div className="max-w-md">
              <Label htmlFor="goal-title" className="text-sm font-medium mb-2">
                Название цели
              </Label>
              <Input
                id="goal-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Введите название цели"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleAddGoal}
                disabled={loading}
              >
                {loading ? 'Сохранение...' : 'Добавить'}
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

      {/* Goals list */}
      {goals.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">Нет поставленных целей</p>
            <Button
              onClick={() => setShowAddForm(true)}
            >
              Добавить первую цель
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            {goals.map((goal, index) => (
              <div key={goal.id}>
                <div className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-4 flex-1">
                    <h3 className="text-lg font-medium">
                      {goal.title}
                    </h3>
                    <Badge variant={getStatusVariant(goal.status)}>
                      {getStatusText(goal.status)}
                    </Badge>
                  </div>
                  
                  <Link href={`/goals/${goal.id}`}>
                    <Button variant="ghost" size="sm" className="gap-2">
                      Подробнее
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
                {index < goals.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
