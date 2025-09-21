import { notFound } from 'next/navigation'
import { getArticles } from '@/lib/directus'
import PageHeader from '@/components/PageHeader'
import PageWrapper from '@/components/PageWrapper'
import Section from '@/components/Section'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, User } from "lucide-react"

interface ArticlePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const resolvedParams = await params
  const articleId = parseInt(resolvedParams.id)

  if (isNaN(articleId)) {
    notFound()
  }

  const articlesData = await getArticles()
  const article = articlesData.data.find((art: any) => art.id === articleId)

  if (!article) {
    notFound()
  }

  return (
    <Section>
      <PageWrapper>
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
                <span>{new Date(article.date_created).toLocaleDateString('ru-RU')}</span>
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
