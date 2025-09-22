'use client'

import { Goal } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, CheckCircle, Pause, Clock } from "lucide-react"
import Link from 'next/link'

interface GoalCardProps {
  goal: Goal & {
    todayValue?: number | null
  }
}

export default function GoalCard({ goal }: GoalCardProps) {
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

  const getProgressValue = () => {
    if (!goal.todayValue) return 0
    return (goal.todayValue / 7) * 100
  }

  const getProgressColor = () => {
    if (!goal.todayValue) return 'bg-gray-200'
    if (goal.todayValue >= 6) return 'bg-green-500'
    if (goal.todayValue >= 4) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">
              <Link 
                href={`/goals/${goal.id}`}
                className="hover:underline"
              >
                {goal.title}
              </Link>
            </CardTitle>
            <CardDescription>
              Прогресс на сегодня
            </CardDescription>
          </div>
          <Badge 
            variant="outline" 
            className={`${getStatusColor(goal.status)} border-0`}
          >
            {getStatusIcon(goal.status)}
            <span className="ml-1">{getStatusText(goal.status)}</span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {goal.todayValue ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Оценка</span>
              <span className="font-medium">{goal.todayValue}/7 баллов</span>
            </div>
            <Progress 
              value={getProgressValue()} 
              className="h-2"
            />
            <div className="text-xs text-muted-foreground">
              {goal.todayValue >= 6 ? 'Отличный прогресс!' : 
               goal.todayValue >= 4 ? 'Хороший прогресс' : 
               'Требует внимания'}
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="text-muted-foreground text-sm">
              Оценка не выбрана
            </div>
            <Link 
              href={`/goals/${goal.id}`}
              className="text-xs text-primary hover:underline mt-1 inline-block"
            >
              Оценить цель
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
