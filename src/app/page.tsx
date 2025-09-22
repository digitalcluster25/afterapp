'use client'

import WellnessDashboard from '@/components/WellnessDashboard'
import GoalsStatusWidget from '@/components/GoalsStatusWidget'
import PageHeader from '@/components/PageHeader'
import PageWrapper from '@/components/PageWrapper'
import Section from '@/components/Section'

export default function HomePage() {
  return (
    <Section>
      <PageWrapper>
        <PageHeader title="Дашборд" />
        <div className="space-y-8">
          <WellnessDashboard />
          <GoalsStatusWidget />
        </div>
      </PageWrapper>
    </Section>
  )
}