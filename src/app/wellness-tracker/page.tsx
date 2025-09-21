import WellnessTracker from '@/components/WellnessTracker'
import PageHeader from '@/components/PageHeader'
import PageWrapper from '@/components/PageWrapper'
import Section from '@/components/Section'

export default function WellnessTrackerPage() {
  return (
    <Section>
      <PageWrapper>
        <PageHeader title="Дашборд" />
        <WellnessTracker />
      </PageWrapper>
    </Section>
  )
}