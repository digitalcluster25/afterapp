import { notFound } from 'next/navigation'
import ParameterDetail from './ParameterDetail'

interface ParameterPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ParameterPage({ params }: ParameterPageProps) {
  const resolvedParams = await params // Fix for Next.js 15 params resolution
  const parameterId = parseInt(resolvedParams.id)

  if (isNaN(parameterId)) {
    notFound()
  }

  return <ParameterDetail parameterId={parameterId} />
}