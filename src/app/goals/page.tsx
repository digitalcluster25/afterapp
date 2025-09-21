import GoalsModule from '@/components/GoalsModule'
import PageHeader from '@/components/PageHeader'
import PageWrapper from '@/components/PageWrapper'
import Section from '@/components/Section'

export default function GoalsPage() {
  return (
    <Section>
      <PageWrapper>
        <PageHeader title="Цели" />
        <GoalsModule />
      </PageWrapper>
    </Section>
  )
}