'use client'

import { useState, useEffect } from 'react'
import { Article } from '@/types'
import { getArticles } from '@/lib/directus'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react"

interface GoalArticleSelectorProps {
  onArticleSelect?: (article: Article) => void
  selectedArticleId?: number
  goalId: number
}

export default function GoalArticleSelector({ onArticleSelect, selectedArticleId, goalId }: GoalArticleSelectorProps) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const loadSelectedArticle = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`goal_article_${goalId}`)
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

  const saveSelectedArticle = (article: Article | null) => {
    if (typeof window !== 'undefined') {
      if (article) {
        localStorage.setItem(`goal_article_${goalId}`, JSON.stringify(article))
      } else {
        localStorage.removeItem(`goal_article_${goalId}`)
      }
    }
  }

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true)
        const articlesData = await getArticles()
        // Фильтруем только статьи из категории "Научные методы"
        const scientificMethodsArticles = articlesData.data.filter(
          (article: Article) => article.category === "Научные методы"
        )
        setArticles(scientificMethodsArticles)
        
        // Загружаем сохраненную статью
        loadSelectedArticle()
      } catch (error) {
        console.error('Error loading articles:', error)
      } finally {
        setLoading(false)
      }
    }

    loadArticles()
  }, [goalId])

  const handleArticleSelect = (articleId: string) => {
    const article = articles.find(a => a.id === parseInt(articleId))
    if (article) {
      setSelectedArticle(article)
      saveSelectedArticle(article)
      onArticleSelect?.(article)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-6 text-center">
          <div className="text-muted-foreground">Загрузка статей...</div>
        </CardContent>
      </Card>
    )
  }

  if (articles.length === 0) {
    return (
      <Card>
        <CardContent className="py-6 text-center">
          <div className="text-muted-foreground">
            Нет статей из категории "Научные методы"
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Связанная статья
        </CardTitle>
        <CardDescription>
          Выберите статью из категории "Научные методы" для отображения на странице цели
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select onValueChange={handleArticleSelect} value={selectedArticle?.id.toString() || ""}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите статью" />
          </SelectTrigger>
          <SelectContent>
            {articles.map((article) => (
              <SelectItem key={article.id} value={article.id.toString()}>
                {article.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedArticle && (
          <div className="border rounded-lg p-4 space-y-3">
            <div className="space-y-2">
              <h4 className="font-medium text-2xl">{selectedArticle.title}</h4>
              {selectedArticle.summary && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {selectedArticle.summary}
                </p>
              )}
            </div>
            
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="gap-2"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-3 w-3" />
                    Скрыть детали
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3" />
                    Показать детали
                  </>
                )}
              </Button>
            </div>

            {isExpanded && (
              <div className="pt-3 border-t">
                <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
                  {selectedArticle.content && (
                    <div dangerouslySetInnerHTML={{ __html: selectedArticle.content.replace(/\n/g, '<br>') }} />
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
