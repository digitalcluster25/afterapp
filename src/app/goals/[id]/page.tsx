import { notFound } from 'next/navigation'
import GoalDetail from './GoalDetail'

interface GoalPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function GoalPage({ params }: GoalPageProps) {
  const resolvedParams = await params // Fix for Next.js 15 params resolution
  const goalId = parseInt(resolvedParams.id)

  if (isNaN(goalId)) {
    notFound()
  }

  return <GoalDetail goalId={goalId} />
}
