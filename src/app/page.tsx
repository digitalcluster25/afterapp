'use client'

import WellnessDashboard from '@/components/WellnessDashboard'
import PageHeader from '@/components/PageHeader'
import PageWrapper from '@/components/PageWrapper'
import Section from '@/components/Section'

export default function HomePage() {
  return (
    <Section>
      <PageWrapper>
        <PageHeader title="Дашборд" />
        <WellnessDashboard />
      </PageWrapper>
    </Section>
  )
}