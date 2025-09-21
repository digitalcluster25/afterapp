'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import PageWrapper from "@/components/PageWrapper"
import { cn } from "@/lib/utils"

export default function Footer() {
  return (
    <footer className="bg-background border-t mt-16">
      <PageWrapper className="py-8">
        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
              <p className="text-sm text-muted-foreground">
                © 2024 :after. Система управления здоровьем.
              </p>
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <Link href="/public-offer" className="hover:text-foreground transition-colors">
                  Публичная оферта
                </Link>
                <Link href="/sitemap" className="hover:text-foreground transition-colors">
                  Карта сайта
                </Link>
                <span>Версия 1.0</span>
              </div>
            </div>
          </div>
          
        </div>
      </PageWrapper>
    </footer>
  )
}
