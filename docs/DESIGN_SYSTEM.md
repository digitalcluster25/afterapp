# Дизайн-система проекта ":after"

## 🎨 Общие принципы

### Философия дизайна
- **Минимализм**: Чистый, простой интерфейс без лишних элементов
- **Функциональность**: Каждый элемент имеет четкое назначение
- **Консистентность**: Единообразие во всех компонентах и страницах
- **Доступность**: Интерфейс удобен для всех пользователей

## 🧩 Библиотека компонентов

### shadcn/ui - Основная библиотека
- **ИСПОЛЬЗУЙТЕ ТОЛЬКО shadcn/ui** для всех UI компонентов и элементов
- Не создавайте кастомные компоненты, если есть эквиваленты в shadcn/ui
- Используйте MCP сервер shadcn/ui для добавления новых компонентов: `npx shadcn@latest add @shadcn/component-name`
- Когда shadcn/ui не предоставляет нужный компонент, используйте Tailwind CSS утилиты для стилизации

### Доступные компоненты
- **Card** - Основной контейнер для контента
- **Button** - Кнопки всех типов и размеров
- **Input** - Поля ввода
- **Badge** - Значки и метки
- **Select** - Выпадающие списки
- **Tabs** - Вкладки для навигации
- **Dialog** - Модальные окна
- **AlertDialog** - Диалоги подтверждения
- **NavigationMenu** - Навигационное меню
- **Separator** - Разделители
- **Popover** - Всплывающие окна
- **Drawer** - Выдвижные панели
- **Command** - Командная палитра
- **Textarea** - Многострочные поля ввода
- **Label** - Подписи к полям
- **Progress** - Индикаторы прогресса

## 🎨 Цветовая схема

### Grayscale палитра
**ИСПОЛЬЗУЙТЕ ТОЛЬКО GRAYSCALE** для всего интерфейса:
- Оттенки серого, черный, белый
- Никаких цветных элементов (синий, зеленый, красный и т.д.)
- Исключение: семантические значения (состояния успеха/ошибки)

### Применение цветов
Применяйте grayscale цвета ко ВСЕМ элементам:
- **Текст и типографика** - различные оттенки серого
- **Фоны и поверхности** - белый, светло-серый
- **Границы и разделители** - серый
- **Кнопки и интерактивные элементы** - черный, серый
- **Иконки и графика** - черный, белый, grayscale
- **Графики и визуализация данных** - grayscale

### CSS переменные
```css
:root {
  --background: 0 0% 100%;        /* Белый фон */
  --foreground: 0 0% 3.9%;        /* Темно-серый текст */
  --muted: 0 0% 96.1%;            /* Светло-серый */
  --muted-foreground: 0 0% 45.1%; /* Серый текст */
  --primary: 0 0% 9%;             /* Черный акцент */
  --primary-foreground: 0 0% 98%; /* Белый на черном */
  --border: 0 0% 89.8%;           /* Серая граница */
  --input: 0 0% 89.8%;            /* Серая граница ввода */
}
```

## 📝 Типографика

### Шрифты
- **Основной шрифт**: Sans-serif (аналогично Helvetica Pro)
- **Системные шрифты**: system-ui, -apple-system, BlinkMacSystemFont
- **Fallback**: "Segoe UI", Roboto, "Helvetica Neue", Arial

### Размеры и веса
```css
/* Заголовки */
.text-2xl { font-size: 1.5rem; line-height: 2rem; font-weight: 600; }
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; font-weight: 600; }

/* Основной текст */
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.text-base { font-size: 1rem; line-height: 1.5rem; }

/* Веса шрифтов */
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
```

### Иерархия текста
- **H1**: Главные заголовки страниц (text-3xl)
- **H2**: Заголовки секций (text-2xl)
- **H3**: Подзаголовки (text-xl)
- **Body**: Основной текст (text-base)
- **Small**: Вторичный текст (text-sm)

## 📐 Отступы и размеры

### Система отступов
```css
/* Вертикальные отступы */
.space-y-1 > * + * { margin-top: 0.25rem; }  /* 4px */
.space-y-2 > * + * { margin-top: 0.5rem; }   /* 8px */
.space-y-4 > * + * { margin-top: 1rem; }     /* 16px */
.space-y-6 > * + * { margin-top: 1.5rem; }   /* 24px */
.space-y-8 > * + * { margin-top: 2rem; }     /* 32px */

/* Горизонтальные отступы */
.space-x-2 > * + * { margin-left: 0.5rem; }  /* 8px */
.space-x-4 > * + * { margin-left: 1rem; }    /* 16px */
```

### Размеры контейнеров
```css
/* Ширина контейнеров */
.w-full { width: 100%; }
.max-w-4xl { max-width: 56rem; }
.max-w-6xl { max-width: 72rem; }

/* Высота элементов */
.h-10 { height: 2.5rem; }    /* Кнопки */
.h-12 { height: 3rem; }      /* Большие кнопки */
.h-16 { height: 4rem; }      /* Заголовки */
```

## 🎭 Анимации и переходы

### Принципы анимации
- **Плавные и мягкие** анимации
- **Без теней** для анимаций
- **Короткие** переходы (200-300ms)
- **Естественные** easing функции

### Типы анимаций
```css
/* Fade анимации */
.fade-in { animation: fadeIn 0.2s ease-out; }
.fade-out { animation: fadeOut 0.2s ease-out; }

/* Hover эффекты */
.hover:scale-105 { transform: scale(1.05); }
.hover:opacity-80 { opacity: 0.8; }

/* Переходы */
.transition-all { transition: all 0.2s ease-in-out; }
.transition-colors { transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out; }
```

### Запрещенные анимации
- ❌ Тени для анимаций
- ❌ Слишком быстрые переходы (< 100ms)
- ❌ Резкие изменения размеров
- ❌ Сложные 3D трансформации

## 📱 Адаптивность

### Breakpoints
```css
/* Tailwind CSS breakpoints */
sm: 640px   /* Планшеты */
md: 768px   /* Небольшие ноутбуки */
lg: 1024px  /* Ноутбуки */
xl: 1280px  /* Десктопы */
2xl: 1536px /* Большие экраны */
```

### Адаптивные компоненты
- **Навигация**: Горизонтальное меню на всех устройствах
- **Карточки**: 1 колонка на мобильных, 2-3 на десктопах
- **Формы**: Полная ширина на мобильных, ограниченная на десктопах
- **Текст**: Адаптивные размеры шрифтов

### Мобильная оптимизация
```css
/* Мобильные стили */
@media (max-width: 640px) {
  .text-3xl { font-size: 1.5rem; }
  .space-y-6 > * + * { margin-top: 1rem; }
  .px-4 { padding-left: 1rem; padding-right: 1rem; }
}
```

## 🎯 Состояния компонентов

### Интерактивные состояния
```css
/* Кнопки */
.btn-primary {
  @apply bg-primary text-primary-foreground hover:bg-primary/90;
}

.btn-secondary {
  @apply bg-secondary text-secondary-foreground hover:bg-secondary/80;
}

/* Поля ввода */
.input {
  @apply border border-input bg-background hover:border-primary focus:border-primary;
}

/* Карточки */
.card {
  @apply bg-card text-card-foreground hover:shadow-md transition-shadow;
}
```

### Состояния загрузки
```css
.loading {
  @apply opacity-50 pointer-events-none;
}

.skeleton {
  @apply animate-pulse bg-muted;
}
```

## 🎨 Иконки и графика

### Библиотека иконок
- **Lucide React** - основная библиотека иконок
- **Только grayscale** иконки (черный, белый, серый)
- **Консистентный размер** для одинаковых типов элементов

### Размеры иконок
```css
.icon-sm { width: 1rem; height: 1rem; }      /* 16px */
.icon-md { width: 1.25rem; height: 1.25rem; } /* 20px */
.icon-lg { width: 1.5rem; height: 1.5rem; }   /* 24px */
.icon-xl { width: 2rem; height: 2rem; }       /* 32px */
```

### Использование иконок
```tsx
// Правильно
<Button size="sm">
  <Plus className="h-4 w-4" />
  Добавить
</Button>

// Неправильно - цветные иконки
<Button size="sm">
  <Plus className="h-4 w-4 text-blue-500" />
  Добавить
</Button>
```

## 📊 Визуализация данных

### Графики и диаграммы
- **Grayscale палитра** для всех графиков
- **Четкие линии** и границы
- **Контрастные** значения для читаемости

### Цветовая индикация
```css
/* Статусы (только для семантики) */
.status-success { color: hsl(142, 76%, 36%); }  /* Зеленый для успеха */
.status-error { color: hsl(0, 84%, 60%); }      /* Красный для ошибки */
.status-warning { color: hsl(38, 92%, 50%); }   /* Желтый для предупреждения */

/* Прогресс-бары */
.progress-low { background-color: hsl(0, 0%, 60%); }    /* Серый */
.progress-medium { background-color: hsl(0, 0%, 40%); } /* Темно-серый */
.progress-high { background-color: hsl(0, 0%, 20%); }   /* Очень темно-серый */
```

## 🔧 Утилиты Tailwind CSS

### Часто используемые классы
```css
/* Flexbox */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.gap-4 { gap: 1rem; }

/* Grid */
.grid { display: grid; }
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }

/* Отступы */
.p-4 { padding: 1rem; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
.m-4 { margin: 1rem; }
.mx-auto { margin-left: auto; margin-right: auto; }
```

## ✅ Чек-лист дизайна

### Перед публикацией проверьте:
- [ ] Все элементы используют grayscale цвета
- [ ] Иконки черные, белые или серые
- [ ] Анимации плавные и без теней
- [ ] Адаптивность на всех устройствах
- [ ] Консистентность отступов и размеров
- [ ] Читаемость текста на всех фонах
- [ ] Интерактивные элементы имеют hover состояния
- [ ] Формы имеют правильную валидацию

---

**Версия:** 1.0  
**Дата создания:** 2024  
**Статус:** Актуальная  
**Применение:** Обязательно для всех компонентов проекта
