'use client'

import { useState, useEffect } from 'react'
import ArticlesModule from '@/components/ArticlesModule'
import { getArticles } from '@/lib/directus'
import PageHeader from '@/components/PageHeader'
import PageWrapper from '@/components/PageWrapper'
import Section from '@/components/Section'
import { Card, CardContent } from '@/components/ui/card'
import { Article } from '@/types'

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const articlesData = await getArticles()
        const articlesArray = articlesData?.data || []
        
        setArticles(articlesArray)
        
        if (articlesArray.length === 0) {
          setError('Статьи не найдены')
        }
      } catch (err) {
        console.error('Error loading articles:', err)
        setError('Ошибка загрузки статей')
        setArticles([])
      } finally {
        setLoading(false)
      }
    }

    loadArticles()
  }, [])

  if (loading) {
    return (
      <Section>
        <PageWrapper>
          <PageHeader title="Блог" />
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-muted-foreground">Загрузка статей...</div>
            </CardContent>
          </Card>
        </PageWrapper>
      </Section>
    )
  }

  if (error && articles.length === 0) {
    return (
      <Section>
        <PageWrapper>
          <PageHeader title="Блог" />
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="text-destructive text-lg font-medium">{error}</div>
                <div className="text-muted-foreground">
                  Попробуйте обновить страницу или зайти позже
                </div>
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
        <PageHeader title="Онлайн журнал" />
        <ArticlesModule articles={articles} />
      </PageWrapper>
    </Section>
  )
}