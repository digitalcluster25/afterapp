# Техническая спецификация проекта ":after"

## 1. АРХИТЕКТУРА ПРИЛОЖЕНИЯ

### 1.1 Технологический стек
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5.x
- **UI Library:** shadcn/ui + Tailwind CSS
- **State Management:** React Hooks + localStorage
- **Icons:** Lucide React
- **Markdown:** react-markdown + remark-gfm
- **Build Tool:** Webpack (Next.js)

### 1.2 Структура папок
```
after/
├── .cursor/
│   └── projectrules.md          # Правила проекта
├── public/                      # Статические файлы
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx          # Корневой layout
│   │   ├── page.tsx            # Главная страница
│   │   ├── globals.css         # Глобальные стили
│   │   ├── articles/           # Страницы блога
│   │   │   ├── page.tsx        # Список статей
│   │   │   └── [id]/
│   │   │       └── page.tsx    # Страница статьи
│   │   ├── goals/              # Страницы целей
│   │   │   ├── page.tsx        # Список целей
│   │   │   └── [id]/
│   │   │       ├── page.tsx    # Страница цели
│   │   │       └── GoalDetail.tsx
│   │   ├── wellness-tracker/   # Страницы трекера
│   │   │   ├── page.tsx        # Список параметров
│   │   │   └── parameter/
│   │   │       └── [id]/
│   │   │           ├── page.tsx
│   │   │           └── ParameterDetail.tsx
│   │   ├── public-offer/       # Публичная оферта
│   │   └── sitemap/            # Карта сайта
│   ├── components/             # React компоненты
│   │   ├── ui/                # shadcn/ui компоненты
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── select.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── navigation-menu.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── drawer.tsx
│   │   │   ├── command.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── label.tsx
│   │   │   └── progress.tsx
│   │   ├── Navigation.tsx      # Основная навигация
│   │   ├── Footer.tsx          # Футер
│   │   ├── PageHeader.tsx      # Заголовок страницы
│   │   ├── PageWrapper.tsx     # Обертка страницы
│   │   ├── Section.tsx         # Секция контента
│   │   ├── StatusSelector.tsx  # Селектор статуса
│   │   ├── WellnessDashboard.tsx # Дашборд
│   │   ├── ParameterWidgets.tsx # Виджеты параметров
│   │   ├── WellnessTracker.tsx # Трекер параметров
│   │   ├── GoalsModule.tsx     # Модуль целей
│   │   ├── GoalCard.tsx        # Карточка цели
│   │   ├── GoalsStatusWidget.tsx # Виджет статуса целей
│   │   ├── GoalMetricsSelector.tsx # Селектор метрик цели
│   │   ├── GoalMetricsHistory.tsx # История метрик цели
│   │   ├── GoalArticleSelector.tsx # Селектор статей для цели
│   │   ├── ArticlesModule.tsx  # Модуль статей
│   │   └── ArticleSelector.tsx # Селектор статей
│   ├── hooks/                  # Пользовательские хуки
│   │   ├── use-headings.ts    # Хук для заголовков
│   │   └── use-media-query.ts # Хук для медиа-запросов
│   ├── lib/                    # Утилиты и конфигурация
│   │   ├── utils.ts           # Утилиты (cn функция)
│   │   ├── directus.ts        # API клиент
│   │   └── heading-utils.ts   # Утилиты для заголовков
│   ├── types/                  # TypeScript типы
│   │   └── index.ts           # Основные типы
│   └── data/                   # Моковые данные
│       └── mockArticles.ts    # Статьи блога
├── components.json             # Конфигурация shadcn/ui
├── next.config.js             # Конфигурация Next.js
├── tailwind.config.ts         # Конфигурация Tailwind
├── tsconfig.json              # Конфигурация TypeScript
├── postcss.config.js          # Конфигурация PostCSS
├── package.json               # Зависимости проекта
└── README.md                  # Описание проекта
```

## 2. КОМПОНЕНТЫ И ИХ ДЕТАЛИ

### 2.1 Основные компоненты

#### Navigation.tsx
```typescript
interface NavigationProps {}
// Функциональность: Основная навигация
// Состояние: pathname (usePathname)
// Стили: shadcn/ui NavigationMenu
```

#### WellnessDashboard.tsx
```typescript
interface WellnessDashboardProps {}
// Функциональность: Главная страница с виджетами
// Зависимости: ParameterWidgets
// Стили: space-y-6
```

#### ParameterWidgets.tsx
```typescript
interface ParameterWidgetProps {
  parameter: ParameterWithValues
}

interface ParameterWithValues extends TrackedParameter {
  values: ParameterValue[]
  weekAverage: number
  weekData: { date: string; value: number }[]
  trend: 'up' | 'down' | 'stable'
  trendPercentage: number
}

// Функциональность: Виджеты параметров с аналитикой
// Состояние: parameters, loading
// Ключевые функции: getWeekData, calculateWeekAverage, calculateTrend
```

#### WellnessTracker.tsx
```typescript
interface WellnessTrackerProps {}
// Функциональность: Управление параметрами
// Состояние: parameters, newParameter, showAddForm
// localStorage: tracked_parameters
```

#### ParameterDetail.tsx
```typescript
interface ParameterDetailProps {
  goalId: number
}
// Функциональность: Детальная страница параметра
// Состояние: parameter, values, showAddForm, selectedArticle
// localStorage: parameter_values_${id}, parameter_article_${id}
```

#### GoalsModule.tsx
```typescript
interface GoalsModuleProps {}
// Функциональность: Список целей
// Состояние: goals, newGoal
// localStorage: goals
```

#### GoalDetail.tsx
```typescript
interface GoalDetailProps {
  goalId: number
}
// Функциональность: Детальная страница цели
// Состояние: goal, selectedMetrics, goalValue, selectedArticle
// localStorage: goals, goal_metrics_${id}, goal_value_${id}, goal_article_${id}
```

#### GoalCard.tsx
```typescript
interface GoalCardProps {
  goal: Goal & { todayValue?: number | null }
}
// Функциональность: Карточка цели
// Стили: hover:shadow-md transition-shadow
// Компоненты: Card, Badge, Progress
```

#### GoalsStatusWidget.tsx
```typescript
interface GoalsStatusWidgetProps {}
// Функциональность: Виджет статуса целей
// Состояние: goals, loading
// Сетка: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

### 2.2 UI компоненты (shadcn/ui)

#### Card
```typescript
// Использование: Основной контейнер для контента
// Варианты: default, hover:shadow-md
// Дочерние: CardHeader, CardTitle, CardDescription, CardContent, CardFooter
```

#### Button
```typescript
// Варианты: default, secondary, destructive, ghost, link, outline
// Размеры: default, sm, lg, icon
// Состояния: disabled, loading
```

#### Badge
```typescript
// Варианты: default, secondary, destructive, outline
// Стили: Цветовая индикация статусов
```

#### Progress
```typescript
// Использование: Прогресс-бары для целей
// Значения: 0-100 (вычисляется из 1-7 баллов)
// Стили: h-2, цветовая градация
```

#### Select
```typescript
// Использование: Выбор статей, параметров
// Компоненты: SelectTrigger, SelectContent, SelectItem, SelectValue
```

#### Tabs
```typescript
// Использование: История параметров (неделя/месяц/сезон/год)
// Компоненты: TabsList, TabsTrigger, TabsContent
```

## 3. УПРАВЛЕНИЕ СОСТОЯНИЕМ

### 3.1 localStorage структура
```typescript
// Параметры
'tracked_parameters': TrackedParameter[]
'parameter_values_${id}': ParameterValue[]
'parameter_article_${id}': Article

// Цели
'goals': Goal[]
'goal_metrics_${id}': TrackedParameter[]
'goal_value_${id}': number
'goal_article_${id}': Article
```

### 3.2 События обновления
```typescript
// Слушатели storage событий
window.addEventListener('storage', handleStorageChange)
document.addEventListener('visibilitychange', handleVisibilityChange)

// Диспетчинг событий
window.dispatchEvent(new StorageEvent('storage', {
  key: 'goals',
  newValue: JSON.stringify(updatedGoals),
  storageArea: localStorage
}))
```

## 4. СТИЛИ И ДИЗАЙН

### 4.1 Цветовая схема (Grayscale)
```css
/* Основные цвета */
--background: 0 0% 100%
--foreground: 0 0% 3.9%
--muted: 0 0% 96.1%
--muted-foreground: 0 0% 45.1%

/* Акцентные цвета */
--primary: 0 0% 9%
--primary-foreground: 0 0% 98%

/* Статусы */
--destructive: 0 84.2% 60.2%
--destructive-foreground: 0 0% 98%
```

### 4.2 Типографика
```css
/* Заголовки */
.text-2xl { font-size: 1.5rem; line-height: 2rem; }
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }

/* Основной текст */
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.text-base { font-size: 1rem; line-height: 1.5rem; }
```

### 4.3 Отступы и размеры
```css
/* Контейнеры */
.space-y-6 > * + * { margin-top: 1.5rem; }
.space-y-4 > * + * { margin-top: 1rem; }
.space-y-2 > * + * { margin-top: 0.5rem; }

/* Сетки */
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.md:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.lg:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
```

## 5. АДАПТИВНОСТЬ

### 5.1 Breakpoints
```css
/* Tailwind CSS breakpoints */
sm: 640px   /* Планшеты */
md: 768px   /* Небольшие ноутбуки */
lg: 1024px  /* Ноутбуки */
xl: 1280px  /* Десктопы */
2xl: 1536px /* Большие экраны */
```

### 5.2 Адаптивные компоненты
- **Навигация:** Горизонтальное меню на всех устройствах
- **Карточки:** 1 колонка на мобильных, 2-3 на десктопах
- **Формы:** Полная ширина на мобильных, ограниченная на десктопах
- **Текст:** Адаптивные размеры шрифтов

## 6. ПРОИЗВОДИТЕЛЬНОСТЬ

### 6.1 Оптимизации
- **Code Splitting:** Автоматический в Next.js
- **Image Optimization:** Next.js Image компонент
- **Bundle Analysis:** Встроенные инструменты Next.js
- **localStorage:** Локальное хранение для быстрого доступа

### 6.2 Ленивая загрузка
```typescript
// Динамические импорты
const ArticleNavigation = dynamic(() => import('./ArticleNavigation'), {
  ssr: false
})

// Условный рендеринг
{showMetricsHistory && <GoalMetricsHistory />}
```

## 7. БЕЗОПАСНОСТЬ

### 7.1 Валидация данных
```typescript
// Валидация форм
if (!editingTitle.trim()) {
  alert('Название цели не может быть пустым')
  return
}

// Проверка типов
const value = storedValue ? parseInt(storedValue) : null
```

### 7.2 Санитизация
```typescript
// Очистка HTML контента
<div dangerouslySetInnerHTML={{ 
  __html: selectedArticle.content.replace(/\n/g, '<br>') 
}} />
```

## 8. ТЕСТИРОВАНИЕ

### 8.1 Unit тесты
```typescript
// Пример теста компонента
describe('ParameterWidget', () => {
  it('should display parameter name and value', () => {
    const parameter = { name: 'Test', weekAverage: 5.5, unit: 'kg' }
    render(<ParameterWidget parameter={parameter} />)
    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('5.5 kg')).toBeInTheDocument()
  })
})
```

### 8.2 Integration тесты
```typescript
// Тест взаимодействия компонентов
describe('Goal Management', () => {
  it('should create and display new goal', () => {
    // Создание цели
    // Проверка отображения
    // Проверка localStorage
  })
})
```

## 9. РАЗВЕРТЫВАНИЕ

### 9.1 Сборка
```bash
# Установка зависимостей
npm install

# Сборка для продакшена
npm run build

# Запуск в продакшене
npm start

# Запуск в разработке
npm run dev
```

### 9.2 Переменные окружения
```env
# .env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000
DIRECTUS_URL=https://api.example.com
```

### 9.3 Docker (опционально)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 10. МОНИТОРИНГ И ЛОГИРОВАНИЕ

### 10.1 Консольные логи
```typescript
// Отладочная информация
console.log('Loading today\'s parameter values for metrics:', selectedMetrics)
console.error('Error loading parameters:', error)
```

### 10.2 Обработка ошибок
```typescript
try {
  const data = JSON.parse(stored)
  setParameters(data)
} catch (error) {
  console.error('Error parsing data:', error)
  setParameters([])
}
```

---

**Версия:** 1.0  
**Дата:** 2024  
**Статус:** Актуальная
