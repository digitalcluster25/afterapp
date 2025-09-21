'use client'

import Link from 'next/link'
import { Article } from '@/types'

interface ArticlesModuleProps {
  articles?: Article[]
}

export default function ArticlesModule({ articles }: ArticlesModuleProps) {
  // Ensure articles is an array
  const safeArticles = Array.isArray(articles) ? articles : []

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Дата не указана'
    try {
      return new Date(dateString).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (error) {
      return 'Неверная дата'
    }
  }

  return (
    <div className="space-y-6">
      {/* Articles grid */}
      <div className="space-y-8">
        {safeArticles.map((article) => (
          <article
            key={article.id}
            className="group cursor-pointer"
          >
            <Link href={`/articles/${article.id}`} className="block">
              <div className="flex flex-col lg:flex-row gap-6 items-start">
                {/* Content Section */}
                <div className="flex-1 space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors leading-tight">
                    {article.title || 'Без названия'}
                  </h3>
                  
                  {article.summary && (
                    <p className="text-gray-600 text-base leading-relaxed">
                      {article.summary}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="font-medium">{article.author || 'Автор не указан'}</span>
                    <span>•</span>
                    <time>
                      {formatDate(article.publishedAt || article.date_created || '')}
                    </time>
                  </div>
                  
                  <div className="flex items-center text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                    Читать больше
                    <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                
                {/* Graphic Section */}
                <div className="w-full lg:w-80 flex-shrink-0">
                  <div className="bg-gray-100 rounded-lg p-8 h-48 flex items-center justify-center">
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                      <div className="w-16 h-16 bg-gray-400 rounded-lg flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {safeArticles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Статьи не найдены</p>
        </div>
      )}
    </div>
  )
}
