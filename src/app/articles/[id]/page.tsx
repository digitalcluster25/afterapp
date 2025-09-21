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

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Дата не указана'
    try {
      return new Date(dateString).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (error) {
      return 'Неверная дата'
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/articles" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к статьям
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            {article.title}
          </h1>
          
          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8">
            {article.author && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-medium">{article.author}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time>{formatDate(article.publishedAt || article.date_created)}</time>
            </div>
          </div>

          {/* Summary */}
          {article.summary && (
            <p className="text-xl text-gray-600 leading-relaxed">
              {article.summary}
            </p>
          )}
        </header>

        {/* Article Content */}
        <article className="prose prose-lg prose-gray max-w-none">
          {article.content ? (
            <div 
              dangerouslySetInnerHTML={{ __html: article.content }}
              className="text-gray-800 leading-relaxed space-y-6"
            />
          ) : (
            <p className="text-gray-500 italic">Содержание статьи недоступно</p>
          )}
        </article>

        {/* Back to Articles */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <Link href="/articles" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Вернуться к статьям
          </Link>
        </div>
      </div>
    </div>
  )
}
