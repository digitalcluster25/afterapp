# Инструкции по воссозданию проекта ":after"

## 1. ПРЕДВАРИТЕЛЬНЫЕ ТРЕБОВАНИЯ

### 1.1 Системные требования
- **Node.js:** версия 18.0 или выше
- **npm:** версия 8.0 или выше
- **Git:** для клонирования репозитория
- **Браузер:** Chrome, Firefox, Safari, Edge (современные версии)

### 1.2 Рекомендуемые инструменты
- **IDE:** VS Code с расширениями для TypeScript и React
- **Терминал:** встроенный терминал IDE или отдельное приложение
- **Браузер:** Chrome DevTools для отладки

## 2. УСТАНОВКА И НАСТРОЙКА

### 2.1 Создание проекта
```bash
# Создание нового Next.js проекта
npx create-next-app@latest after --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Переход в директорию проекта
cd after

# Установка дополнительных зависимостей
npm install lucide-react react-markdown remark-gfm @radix-ui/react-progress
```

### 2.2 Настройка shadcn/ui
```bash
# Инициализация shadcn/ui
npx shadcn@latest init

# Установка необходимых компонентов
npx shadcn@latest add card button input badge select tabs dialog alert-dialog navigation-menu separator popover drawer command textarea label progress
```

### 2.3 Настройка TypeScript
Создать файл `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 2.4 Настройка Tailwind CSS
Создать файл `tailwind.config.ts`:
```typescript
import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
```

### 2.5 Настройка PostCSS
Создать файл `postcss.config.js`:
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## 3. СОЗДАНИЕ СТРУКТУРЫ ПРОЕКТА

### 3.1 Создание папок
```bash
# Создание структуры папок
mkdir -p src/components/ui
mkdir -p src/hooks
mkdir -p src/lib
mkdir -p src/types
mkdir -p src/data
mkdir -p .cursor
```

### 3.2 Создание основных файлов

#### src/lib/utils.ts
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

#### src/types/index.ts
```typescript
export interface TrackedParameter {
  id: number
  name: string
  unit: string
  createdAt: number
}

export interface ParameterValue {
  id: number
  value: string
  date: string
  time: string
  notes?: string
}

export interface Goal {
  id: number
  title: string
  status: 'active' | 'completed' | 'paused'
  createdAt: number
}

export interface Article {
  id: number
  title: string
  summary?: string
  content?: string
  category?: string
  publishedAt?: string
  author?: string
  description?: string
}
```

#### .cursor/projectrules.md
```markdown
# Project Rules

## Core Principles
1. Minimalism: Strive for the simplest possible solution
2. Quality: Ensure code is clean, readable, maintainable
3. Adherence to Instructions: Strictly follow all user instructions
4. Shadcn/ui First: Prioritize shadcn/ui components

## Critical Operational Rules
1. Complete Instruction Execution: ALWAYS execute ALL parts of a user's instruction
2. Comprehensive Search: Perform comprehensive search for renames/changes
3. Full Verification: Thoroughly verify all aspects are implemented
4. No Partial Implementation: Avoid committing if any part is pending

## FATAL ERROR PREVENTION RULES
1. NEVER modify existing content without explicit permission
2. NEVER break existing functionality without explicit user consent
3. ALWAYS ask before major changes
4. PRESERVE data integrity
5. VERIFY before implementing

## UI/UX Design Rules
### Component Library
- ONLY use shadcn/ui library for all UI components
- Use shadcn/ui MCP server for adding new components
- Use Tailwind CSS utilities when shadcn/ui doesn't provide suitable component

### Color Scheme
- Grayscale color palette ONLY for entire interface
- Use only shades of gray, black, and white
- Apply grayscale colors to ALL elements
- Icons must be black, white, or grayscale only

### Visual Design
- Clean, minimalist aesthetic
- Consistent spacing and typography
- Smooth, gentle animations (fade, contour, background animations)
- No shadows for animations
- Sans-serif fonts (similar to Helvetica Pro)
- Professional, modern appearance
```

## 4. СОЗДАНИЕ КОМПОНЕНТОВ

### 4.1 Создание UI компонентов
Следуйте инструкциям shadcn/ui для создания каждого компонента:

```bash
# Создание каждого компонента
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add badge
npx shadcn@latest add select
npx shadcn@latest add tabs
npx shadcn@latest add dialog
npx shadcn@latest add alert-dialog
npx shadcn@latest add navigation-menu
npx shadcn@latest add separator
npx shadcn@latest add popover
npx shadcn@latest add drawer
npx shadcn@latest add command
npx shadcn@latest add textarea
npx shadcn@latest add label
npx shadcn@latest add progress
```

### 4.2 Создание основных компонентов
Создайте файлы согласно структуре проекта, используя код из документации.

## 5. НАСТРОЙКА ДАННЫХ

### 5.1 Создание моковых данных
Создайте файл `src/data/mockArticles.ts` с примерами статей:

```typescript
import { Article } from '@/types'

export const mockArticles: Article[] = [
  {
    id: 1,
    title: "Научно обоснованный инструмент оценки восстановления спортсмена",
    summary: "Мониторинг восстановления является краеугольным камнем современной спортивной науки.",
    content: "# Научно обоснованный инструмент...",
    category: "Научные методы",
    publishedAt: "2024-01-20",
    author: "Спортивный физиолог",
    description: "Полное руководство по научно обоснованной системе оценки восстановления"
  }
  // Добавьте больше статей
]
```

### 5.2 Настройка API клиента
Создайте файл `src/lib/directus.ts`:

```typescript
import { Article } from '@/types'
import { mockArticles } from '@/data/mockArticles'

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://api.example.com'

export async function getArticles(): Promise<{ data: Article[] }> {
  try {
    // В реальном проекте здесь был бы запрос к API
    // Пока используем моковые данные
    return { data: mockArticles }
  } catch (error) {
    console.error('Error loading articles:', error)
    return { data: mockArticles }
  }
}
```

## 6. НАСТРОЙКА СТИЛЕЙ

### 6.1 Глобальные стили
Обновите `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 3.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

## 7. ЗАПУСК ПРОЕКТА

### 7.1 Разработка
```bash
# Запуск в режиме разработки
npm run dev

# Открытие в браузере
# http://localhost:3000
```

### 7.2 Сборка для продакшена
```bash
# Сборка проекта
npm run build

# Запуск в продакшене
npm start
```

## 8. ТЕСТИРОВАНИЕ

### 8.1 Функциональное тестирование
1. Создайте параметр и добавьте значения
2. Создайте цель и оцените её
3. Прочитайте статью в блоге
4. Проверьте навигацию между разделами
5. Проверьте сохранение данных в localStorage

### 8.2 Адаптивность
1. Протестируйте на мобильных устройствах
2. Проверьте работу на планшетах
3. Убедитесь в корректности на десктопах

### 8.3 Производительность
1. Проверьте время загрузки
2. Убедитесь в плавности анимаций
3. Проверьте работу с большими объемами данных

## 9. РАЗВЕРТЫВАНИЕ

### 9.1 Vercel (рекомендуется)
```bash
# Установка Vercel CLI
npm i -g vercel

# Деплой
vercel

# Следовать инструкциям в терминале
```

### 9.2 Netlify
```bash
# Установка Netlify CLI
npm i -g netlify-cli

# Сборка и деплой
npm run build
netlify deploy --prod --dir=out
```

### 9.3 Docker
Создайте `Dockerfile`:
```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

## 10. ОТЛАДКА И ПОДДЕРЖКА

### 10.1 Частые проблемы
- **Ошибки TypeScript:** Проверьте типы в `src/types/index.ts`
- **Проблемы с shadcn/ui:** Убедитесь в правильной установке компонентов
- **Ошибки localStorage:** Проверьте поддержку браузера
- **Проблемы с Tailwind:** Убедитесь в правильной конфигурации

### 10.2 Логирование
```typescript
// Добавьте логирование для отладки
console.log('Debug info:', data)
console.error('Error:', error)
```

### 10.3 Мониторинг
- Используйте браузерные DevTools
- Проверяйте консоль на ошибки
- Мониторьте производительность в Network tab

---

**Версия:** 1.0  
**Дата:** 2024  
**Статус:** Актуальная
