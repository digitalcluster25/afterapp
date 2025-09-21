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
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useHeadings } from '@/hooks/use-headings'
import ArticleNavigation from '@/components/ArticleNavigation'

export default function ArticlePage() {
  const params = useParams()
  const [article, setArticle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const headings = useHeadings(article?.content || '')

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
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="relative grid grid-cols-12 gap-6 lg:grid">
          {/* Main Content */}
          <div className="col-span-12 lg:col-span-8">
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
            <div className="text-gray-800 leading-relaxed">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                h1: ({ children }) => {
                  const baseId = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').trim()
                  const id = baseId || 'heading-1'
                  return (
                    <section id={id} className="prose dark:prose-invert my-8">
                      <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8 first:mt-0">{children}</h1>
                    </section>
                  )
                },
                h2: ({ children }) => {
                  const baseId = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').trim()
                  const id = baseId || 'heading-2'
                  return (
                    <section id={id} className="prose dark:prose-invert mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{children}</h2>
                    </section>
                  )
                },
                h3: ({ children }) => {
                  const baseId = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').trim()
                  const id = baseId || 'heading-3'
                  return (
                    <section id={id} className="prose dark:prose-invert mb-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">{children}</h3>
                    </section>
                  )
                },
                h4: ({ children }) => {
                  const baseId = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').trim()
                  const id = baseId || 'heading-4'
                  return (
                    <section id={id} className="prose dark:prose-invert mb-8">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 mt-4">{children}</h4>
                    </section>
                  )
                },
                p: ({ children }) => <p className="mb-4 text-gray-800 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="mb-4 ml-6 space-y-2">{children}</ul>,
                ol: ({ children }) => <ol className="mb-4 ml-6 space-y-2">{children}</ol>,
                li: ({ children }) => <li className="text-gray-800">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
                blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-300 pl-4 my-6 italic text-gray-600">{children}</blockquote>,
                code: ({ children }) => <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{children}</code>,
                pre: ({ children }) => <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto my-6">{children}</pre>,
                table: ({ children }) => <table className="w-full border-collapse border border-gray-300 my-6">{children}</table>,
                th: ({ children }) => <th className="border border-gray-300 px-4 py-2 bg-gray-50 font-semibold text-left">{children}</th>,
                td: ({ children }) => <td className="border border-gray-300 px-4 py-2">{children}</td>,
                hr: () => <hr className="my-8 border-gray-200" />,
              }}
            >
              {article.content}
            </ReactMarkdown>
            </div>
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

          {/* Navigation Sidebar */}
          <ArticleNavigation headings={headings} />
        </div>
      </div>
    </div>
  )
}
