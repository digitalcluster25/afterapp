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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {safeArticles.map((article) => (
          <article
            key={article.id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow animate-fade"
          >
            <div className="p-6">
              <div className="mb-3">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                  {article.category}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {article.title || 'Без названия'}
              </h3>
              
              {article.summary && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {article.summary}
                </p>
              )}
              
              <div className="flex justify-between items-center">
                <time className="text-xs text-gray-500">
                  {formatDate(article.publishedAt || article.date_created)}
                </time>
                
                <Link
                  href={`/articles/${article.id}`}
                  className="text-sm text-gray-700 hover:text-gray-900 font-medium"
                >
                  Читать →
                </Link>
              </div>
            </div>
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
