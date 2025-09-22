'use client'

import { useState, useEffect } from 'react'
import { Article } from '@/types'
import { getArticles } from '@/lib/directus'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BookOpen, ExternalLink, ChevronDown, ChevronUp } from "lucide-react"
import Link from 'next/link'

interface ArticleSelectorProps {
  onArticleSelect?: (article: Article) => void
  selectedArticleId?: number
}

export default function ArticleSelector({ onArticleSelect, selectedArticleId }: ArticleSelectorProps) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true)
        const articlesData = await getArticles()
        // Фильтруем только статьи из категории "Анализ состояния здоровья"
        const healthAnalysisArticles = articlesData.data.filter(
          (article: Article) => article.category === "Анализ состояния здоровья"
        )
        setArticles(healthAnalysisArticles)
        
        // Если есть предварительно выбранная статья, устанавливаем её
        if (selectedArticleId) {
          const preSelected = healthAnalysisArticles.find((a: Article) => a.id === selectedArticleId)
          if (preSelected) {
            setSelectedArticle(preSelected)
          }
        }
      } catch (error) {
        console.error('Error loading articles:', error)
      } finally {
        setLoading(false)
      }
    }

    loadArticles()
  }, [selectedArticleId])

  const handleArticleSelect = (articleId: string) => {
    const article = articles.find(a => a.id === parseInt(articleId))
    if (article) {
      setSelectedArticle(article)
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
            Нет статей из категории "Анализ состояния здоровья"
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
          Выберите статью из категории "Анализ состояния здоровья" для отображения на странице параметра
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
            
            <div className="flex justify-between items-center">
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
              
              <Link href={`/articles/${selectedArticle.id}`} target="_blank">
                <Button variant="outline" size="sm" className="gap-2">
                  <ExternalLink className="h-3 w-3" />
                  Открыть статью
                </Button>
              </Link>
            </div>

            {isExpanded && (
              <div className="pt-3 border-t space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {selectedArticle.category}
                  </Badge>
                  {selectedArticle.author && (
                    <span className="text-xs text-muted-foreground">
                      {selectedArticle.author}
                    </span>
                  )}
                </div>
                {selectedArticle.description && (
                  <p className="text-xs text-muted-foreground">
                    {selectedArticle.description}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
