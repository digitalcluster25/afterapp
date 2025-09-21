import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  className?: string
}

export default function PageHeader({ title, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-[30px] text-left", className)}>
      <h1 className="text-4xl font-bold text-foreground">
        {title}
      </h1>
    </div>
  )
}
