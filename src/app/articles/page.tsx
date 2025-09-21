import ArticlesModule from '@/components/ArticlesModule'
import { getArticles } from '@/lib/directus'
import PageHeader from '@/components/PageHeader'
import PageWrapper from '@/components/PageWrapper'
import Section from '@/components/Section'

export default async function ArticlesPage() {
  const articlesData = await getArticles()

  return (
    <Section>
      <PageWrapper>
        <PageHeader title="Онлайн журнал" />
        <ArticlesModule articles={articlesData.data} />
      </PageWrapper>
    </Section>
  )
}