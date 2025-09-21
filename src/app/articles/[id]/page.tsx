'use client'

import { useState, useEffect } from 'react'
import { notFound, useParams } from 'next/navigation'
import { getArticles } from '@/lib/directus'
import PageHeader from '@/components/PageHeader'
import PageWrapper from '@/components/PageWrapper'
import Section from '@/components/Section'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, User, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function ArticlePage() {
  const params = useParams()
  const [article, setArticle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const articleId = parseInt(params.id as string)
        if (isNaN(articleId)) {
          setError('Неверный ID статьи')
          return
        }

        setLoading(true)
        const articlesData = await getArticles()
        const foundArticle = articlesData.data.find((art: any) => art.id === articleId)

        if (!foundArticle) {
          setError('Статья не найдена')
          return
        }

        setArticle(foundArticle)
      } catch (err) {
        console.error('Error loading article:', err)
        setError('Ошибка загрузки статьи')
      } finally {
        setLoading(false)
      }
    }

    loadArticle()
  }, [params.id])

  if (loading) {
    return (
      <Section>
        <PageWrapper>
          <div className="mb-4">
            <Link href="/articles">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Назад к статьям
              </Button>
            </Link>
          </div>
          <PageHeader title="Загрузка..." />
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-muted-foreground">Загрузка статьи...</div>
            </CardContent>
          </Card>
        </PageWrapper>
      </Section>
    )
  }

  if (error || !article) {
    return (
      <Section>
        <PageWrapper>
          <div className="mb-4">
            <Link href="/articles">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Назад к статьям
              </Button>
            </Link>
          </div>
          <PageHeader title="Ошибка" />
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="text-destructive text-lg font-medium">
                  {error || 'Статья не найдена'}
                </div>
                <Link href="/articles">
                  <Button>Вернуться к статьям</Button>
                </Link>
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
        <div className="mb-4">
          <Link href="/articles">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Назад к статьям
            </Button>
          </Link>
        </div>
        
        <PageHeader title={article.title} />
        
        <Card>
          <CardContent className="p-8">
            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
              {article.category && (
                <Badge variant="secondary">{article.category}</Badge>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(article.date_created || article.publishedAt).toLocaleDateString('ru-RU')}</span>
              </div>
              {article.author && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{article.author}</span>
                </div>
              )}
            </div>

            <Separator className="mb-6" />

            {/* Article Content */}
            <div className="prose prose-gray max-w-none">
              {article.content ? (
                <div 
                  dangerouslySetInnerHTML={{ __html: article.content }}
                  className="text-foreground leading-relaxed"
                />
              ) : (
                <p className="text-muted-foreground">Содержание статьи недоступно</p>
              )}
            </div>

            {/* Article Description */}
            {article.description && (
              <>
                <Separator className="my-6" />
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Описание</h3>
                  <p className="text-muted-foreground">{article.description}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </PageWrapper>
    </Section>
  )
}
