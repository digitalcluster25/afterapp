'use client'

import ParameterWidgets from './ParameterWidgets'

export default function WellnessDashboard() {
  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground">
          Обзор параметров
        </h2>
        <p className="text-muted-foreground mt-1">
          Аналитика ваших отслеживаемых показателей за последнюю неделю
        </p>
      </div>

      {/* Виджеты параметров */}
      <ParameterWidgets />
    </div>
  )
}