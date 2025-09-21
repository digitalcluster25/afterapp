import React from 'react'
import { cn } from "@/lib/utils"

interface SectionProps {
  children: React.ReactNode
  className?: string
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  background?: 'none' | 'muted' | 'card'
}

export default function Section({ 
  children, 
  className,
  spacing = 'md',
  background = 'none'
}: SectionProps) {
  const spacingClasses = {
    none: '',
    sm: 'py-4 sm:py-6',
    md: 'py-6 sm:py-8 lg:py-12',
    lg: 'py-8 sm:py-12 lg:py-16',
    xl: 'py-12 sm:py-16 lg:py-20'
  }

  const backgroundClasses = {
    none: '',
    muted: 'bg-muted/30',
    card: 'bg-card border rounded-lg'
  }

  return (
    <section className={cn(
      spacingClasses[spacing],
      backgroundClasses[background],
      className
    )}>
      {children}
    </section>
  )
}
