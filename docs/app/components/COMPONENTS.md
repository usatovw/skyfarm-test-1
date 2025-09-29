# 🧩 Components Documentation

Документация всех React компонентов проекта SkyFarm.

## 📁 Структура компонентов

```
components/
├── dashboard/          # Dashboard компоненты
│   ├── FarmDashboard.tsx    # Главный дашборд (202 строки)
│   └── index.ts             # Экспорт
├── farm/               # Farm управление (9 компонентов)
│   ├── ChangesSummary.tsx        # Сводка изменений
│   ├── ContainerGrid.tsx         # Сетка контейнеров
│   ├── ContainerParameters.tsx   # Параметры контейнеров
│   ├── CropSelector.tsx          # Селектор культур
│   ├── FarmingTabs.tsx           # Табы управления
│   ├── GrowthManagement.tsx      # Управление ростом
│   ├── RackDetail.tsx            # Детали стойки
│   ├── StopGrowingConfirmation.tsx # Подтверждение остановки
│   ├── TrayDetail.tsx            # Детали лотка
│   └── index.ts                  # Экспорт
├── shared/             # Общие компоненты layout
│   ├── Header.tsx            # Верхняя панель
│   ├── Layout.tsx            # Основной лейаут (29 строк)
│   ├── Sidebar.tsx           # Боковая панель
│   └── index.ts              # Экспорт
├── ui/                 # UI библиотека (21 файл: 20 TSX + 1 TS hook)
│   ├── alert-dialog.tsx, alert.tsx, badge.tsx
│   ├── breadcrumb.tsx, button.tsx, calendar.tsx
│   ├── card.tsx, checkbox.tsx, context-menu.tsx
│   ├── dialog.tsx, dropdown-menu.tsx, input.tsx
│   ├── label.tsx, progress.tsx, select.tsx
│   ├── separator.tsx, skeleton.tsx, table.tsx
│   ├── tabs.tsx, textarea.tsx, use-mobile.ts (hook)
│   └── index.ts              # Экспорт всех UI компонентов
└── index.ts            # Главный экспорт всех компонентов
```

## 📊 Dashboard компоненты

### 🏠 FarmDashboard.tsx
**Назначение**: Центральный дашборд с real-time метриками фермы
**Размер**: 201 строка
**Функции**:
- Real-time метрики (обновление каждые 5 секунд)
- Статистика фермы (контейнеры, урожай, уведомления)
- Параметры окружающей среды (температура, влажность, освещение, энергопотребление)
- Быстрые действия (полив, освещение, проверка pH, сбор урожая)

**Используемые компоненты**:
- `Card`, `CardContent`, `CardDescription`, `CardHeader`, `CardTitle`
- `Badge`, `Progress`
- `Thermometer`, `Droplets`, `Sun`, `Zap`, `TrendingUp`, `AlertTriangle` (иконки)

## 🌱 Farm компоненты

### Управление жизненным циклом растений
- **ChangesSummary.tsx** - Отображение планируемых изменений в посадках
- **ContainerGrid.tsx** - Интерактивная сетка контейнеров с визуализацией
- **ContainerParameters.tsx** - Мониторинг и контроль параметров среды
- **CropSelector.tsx** - Селектор культур с проверкой совместимости
- **GrowthManagement.tsx** - Полное управление процессом выращивания
- **RackDetail.tsx** - Детальная информация о стойках (racks)
- **TrayDetail.tsx** - Детальная информация о лотках (trays)
- **StopGrowingConfirmation.tsx** - Подтверждение критических операций
- **FarmingTabs.tsx** - Навигация между режимами управления

## 🔄 Shared компоненты

### 🏗️ Layout.tsx (29 строк)
**Назначение**: Основной layout приложения
**Структура**:
```typescript
<div className="h-screen flex flex-col bg-background">
  <Header breadcrumbs={breadcrumbs} />
  <div className="flex flex-1 overflow-hidden">
    <Sidebar />
    <main className="flex-1 overflow-auto">
      <div className="p-6">{children}</div>
    </main>
  </div>
</div>
```

### 📱 Header.tsx
**Назначение**: Верхняя панель с breadcrumbs навигацией

### 📋 Sidebar.tsx
**Назначение**: Боковая навигационная панель

## 🎨 UI библиотека (21 файл)

### 20 Radix UI TSX компонентов + 1 TypeScript hook:
- **Диалоги**: `alert-dialog`, `dialog`
- **Формы**: `input`, `textarea`, `select`, `checkbox`, `label`
- **Навигация**: `breadcrumb`, `tabs`, `dropdown-menu`, `context-menu`
- **Отображение**: `card`, `badge`, `alert`, `progress`, `skeleton`, `table`
- **Интерактив**: `button`, `calendar`, `separator`
- **Утилиты**: `use-mobile.ts`

## 🔧 Соглашения по компонентам

### Именование
- **PascalCase** для имен компонентов
- **camelCase** для пропсов и функций
- **kebab-case** для CSS классов

### Структура файлов
- Каждая папка имеет `index.ts` для централизованного экспорта
- Компоненты используют TypeScript с строгой типизацией
- Стили через Tailwind CSS с `cn()` helper

### Импорты
```typescript
// Алиасы для импортов
import { ComponentName } from '@/components/category'
import { cn } from '@/lib/utils'
import { TypeName } from '@/types'
```

## 📈 Статистика компонентов

- **Всего файлов**: 34 (33 TSX компонента + 1 TS hook)
- **Dashboard**: 1 TSX компонент
- **Farm**: 9 TSX компонентов
- **Shared**: 3 TSX компонента
- **UI**: 21 файл (20 TSX + 1 TS hook)
- **Средний размер**: ~50-200 строк на компонент
- **Паттерн**: Functional Components + Hooks