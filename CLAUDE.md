# 🌱 SkyFarm - Система Управления Автоматизированной Фермой

## 🎯 **ПРОЕКТ OVERVIEW**

**SkyFarm** - это передовая система управления автоматизированной фермой, построенная на современном технологическом стеке. Проект представляет собой веб-приложение для мониторинга и управления гидропонными фермами с интеллектуальными контейнерами.

### ✨ **Ключевые особенности:**
- 🌱 **Интеллектуальное управление**: Автоматизированный мониторинг роста растений
- 📊 **Real-time аналитика**: Данные о температуре, влажности, освещении в реальном времени
- 🎯 **Многокультурное выращивание**: Поддержка совместимости различных культур
- 📱 **Responsive UI**: Современный интерфейс с адаптивным дизайном
- 🏗️ **Модульная архитектура**: Масштабируемая система компонентов

---

## 🏗️ **АРХИТЕКТУРА ПРОЕКТА**

### 📊 **Актуальная структура проекта:**
```
skyfarm/
├── app/                        # Next.js 14 App Router
│   ├── components/             # React компоненты по категориям
│   │   ├── dashboard/          # Компоненты дашборда
│   │   │   ├── FarmDashboard.tsx    # Главный дашборд с метриками
│   │   │   └── index.ts             # Экспорт компонентов
│   │   ├── farm/               # Фермерские компоненты
│   │   │   ├── ChangesSummary.tsx        # Сводка изменений
│   │   │   ├── ContainerGrid.tsx         # Сетка контейнеров
│   │   │   ├── ContainerParameters.tsx   # Параметры контейнеров
│   │   │   ├── CropSelector.tsx          # Селектор культур
│   │   │   ├── FarmingTabs.tsx           # Табы управления
│   │   │   ├── GrowthManagement.tsx      # Управление ростом
│   │   │   ├── RackDetail.tsx            # Детали стойки
│   │   │   ├── StopGrowingConfirmation.tsx # Подтверждение остановки
│   │   │   ├── TrayDetail.tsx            # Детали лотка
│   │   │   └── index.ts                  # Экспорт компонентов
│   │   ├── shared/             # Общие компоненты layout
│   │   │   ├── Header.tsx              # Верхняя панель
│   │   │   ├── Layout.tsx              # Основной лейаут
│   │   │   ├── Sidebar.tsx             # Боковая панель
│   │   │   └── index.ts                # Экспорт компонентов
│   │   ├── ui/                 # UI библиотека (22 компонента)
│   │   │   ├── alert-dialog.tsx, alert.tsx, badge.tsx
│   │   │   ├── breadcrumb.tsx, button.tsx, calendar.tsx
│   │   │   ├── card.tsx, checkbox.tsx, context-menu.tsx
│   │   │   ├── dialog.tsx, dropdown-menu.tsx, input.tsx
│   │   │   ├── label.tsx, progress.tsx, select.tsx
│   │   │   ├── separator.tsx, skeleton.tsx, table.tsx
│   │   │   ├── tabs.tsx, textarea.tsx, use-mobile.ts
│   │   │   └── index.ts                # Экспорт всех UI компонентов
│   │   └── index.ts            # Главный экспорт компонентов
│   ├── data/                   # Данные и mock API
│   │   └── mockData.ts         # Моковые данные фермы (260 строк)
│   ├── farm/                   # Страница фермы
│   │   └── page.tsx            # Farm management interface
│   ├── lib/                    # Утилиты и константы
│   │   ├── constants.ts        # Константы приложения
│   │   └── utils.ts            # Tailwind utilities (cn функция)
│   ├── types/                  # TypeScript типы
│   │   ├── farming.ts          # Основные типы (104 строки)
│   │   └── index.ts            # UI типы и экспорт
│   ├── globals.css             # Глобальные стили и CSS переменные
│   ├── layout.tsx              # Root layout с метаданными
│   └── page.tsx                # Главная страница (Dashboard)
├── docs/                       # Детальная документация
│   ├── DOCS.md                 # Обзор документации
│   └── app/                    # Документация по app/
│       ├── APP.md              # App Directory (53 файла)
│       ├── components/         # Документация компонентов
│       │   └── COMPONENTS.md   # React компоненты (34 файла)
│       ├── data/               # Документация данных
│       │   └── DATA.md         # Данные и API (259 строк)
│       ├── lib/                # Документация утилит
│       │   └── LIB.md          # Утилиты и константы (60 строк)
│       └── types/              # Документация типов
│           └── TYPES.md        # TypeScript типы (103 строки)
├── public/                     # Статические файлы (пустая папка)
├── CLAUDE.md                   # Техническая документация
├── README.md                   # Пользовательская документация
├── next.config.js              # Next.js конфигурация
├── package.json                # Зависимости и скрипты
├── postcss.config.js           # PostCSS конфигурация
├── tailwind.config.ts          # Tailwind CSS конфигурация
└── tsconfig.json               # TypeScript конфигурация
```

---

## 🛠️ **ТЕХНОЛОГИЧЕСКИЙ СТЕК**

### ⚡ **Frontend Framework:**
- **Next.js 14** - App Router, Server Components
- **React 18.2** - Functional Components, Hooks
- **TypeScript 5.2** - Строгая типизация

### 🎨 **UI/UX Stack:**
- **Tailwind CSS 3.3** - Utility-first CSS
- **Radix UI** - Headless UI компоненты (22 компонента)
- **Lucide React** - Иконки
- **Recharts 3.2** - Графики и диаграммы
- **CSS Variables** - Темизация

### 🔧 **Development Tools:**
- **ESLint** - Линтинг кода
- **PostCSS** - CSS обработка
- **TypeScript** - Статическая типизация

---

## 🧩 **КОМПОНЕНТНАЯ АРХИТЕКТУРА**

### 📊 **Dashboard компоненты (`/app/components/dashboard/`):**
- **FarmDashboard.tsx** (201 строка) - Центральный дашборд с real-time метриками
  - Метрики окружающей среды (температура, влажность, освещение, энергопотребление)
  - Статистика фермы (активные контейнеры, урожай, уведомления)
  - Быстрые действия (полив, освещение, проверка pH, сбор урожая)
  - Real-time обновление данных каждые 5 секунд

### 🌱 **Farm компоненты (`/app/components/farm/`):**
- **ChangesSummary.tsx** - Сводка планируемых изменений в посадках
- **ContainerGrid.tsx** - Интерактивная сетка контейнеров
- **ContainerParameters.tsx** - Мониторинг и контроль параметров
- **CropSelector.tsx** - Селектор культур с проверкой совместимости
- **FarmingTabs.tsx** - Навигация между режимами управления
- **GrowthManagement.tsx** - Управление жизненным циклом растений
- **RackDetail.tsx** - Детальная информация о стойках (racks)
- **StopGrowingConfirmation.tsx** - Подтверждение остановки выращивания
- **TrayDetail.tsx** - Детальная информация о лотках (trays)

### 🎨 **UI библиотека (`/app/components/ui/`):**
**21 файл (20 Radix UI TSX компонентов + 1 TS hook):**
```typescript
// TSX компоненты:
alert-dialog, alert, badge, breadcrumb, button, calendar,
card, checkbox, context-menu, dialog, dropdown-menu,
input, label, progress, select, separator, skeleton,
table, tabs, textarea
// TS hook:
use-mobile
```

### 🔄 **Shared компоненты (`/app/components/shared/`):**
- **Layout.tsx** (29 строк) - Основной layout с header, sidebar и main
- **Sidebar.tsx** - Боковая навигационная панель
- **Header.tsx** - Верхняя панель с breadcrumbs

---

## 📝 **СИСТЕМА ТИПОВ**

### 🌾 **Основные типы (`/app/types/farming.ts` - 103 строки):**
```typescript
// Типы культур и стадий роста
interface CropType {
  id: string;
  name: string;
  icon: string;
  color: string;
  climateRequirements: {
    temperature: { min: number; max: number };
    humidity: { min: number; max: number };
    co2: { min: number; max: number };
    lighting: { min: number; max: number };
  };
  growthStages: GrowthStage[];
  totalGrowthDays: number;
}

interface GrowthStage {
  id: string;
  name: string;
  duration: number; // дни
  description: string;
  icon: string;
}

// Иерархия контейнеров: Container → Row → Rack → Tray
interface TrayStatus {
  id: string;
  rackId: string;
  position: number; // 1-10 позиция в стойке
  status: 'empty' | 'planned' | 'growing' | 'ready' | 'harvested' | 'error';
  crop?: {
    cropId: string;
    plantedDate?: Date;
    currentStage?: string;
    daysInStage?: number;
    harvestDate?: Date;
  };
}

interface RackStatus {
  id: string;
  rowId: string;
  position: number; // 1-10 позиция в ряду
  trays: TrayStatus[];
  totalTrays: number;
  occupiedTrays: number;
  status: 'empty' | 'partial' | 'full';
}

interface RowStatus {
  id: string;
  name: string; // A, B, C, D
  racks: RackStatus[];
  totalTrays: number;
  occupiedTrays: number;
}

interface ContainerStatus {
  id: string;
  name: string;
  rows: RowStatus[];
  currentClimate: {
    temperature: number;
    humidity: number;
    co2: number;
    lighting: number;
  };
  activeMode?: {
    cropId: string;
    parameters: any;
  };
}

// Типы для управления изменениями
interface ChangesDraft {
  selectedItems: {
    rows: string[];
    racks: string[];
    trays: string[];
  };
  plannedActions: PlannedAction[];
}

interface PlannedAction {
  id: string;
  type: 'plant' | 'harvest' | 'clear' | 'stop_growing';
  targetType: 'row' | 'rack' | 'tray';
  targetIds: string[];
  cropId?: string;
  scheduledDate?: Date;
  forceStop?: boolean;
}
```

### 🎨 **UI типы (`/app/types/index.ts`):**
```typescript
interface UIToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface NavigationItem {
  id: string;
  title: string;
  icon: string;
  href: string;
  isActive?: boolean;
}

interface BreadcrumbItem {
  title: string;
  href?: string;
}
```

---

## 📊 **СИСТЕМА ДАННЫХ**

### 🗄️ **Mock Data (`/app/data/mockData.ts` - 259 строк):**
```typescript
// Основные данные культур (4 вида):
export const mockCrops: CropType[] = [
  {
    id: 'basil',     // Базилик - 72 дня роста
    id: 'lettuce',   // Салат - 45 дней роста
    id: 'spinach',   // Шпинат - 45 дней роста
    id: 'arugula'    // Руккола - 35 дней роста
  }
];

// Основной контейнер с полной иерархией:
export const mockContainerData: ContainerStatus = {
  id: 'container_41_i2f',
  name: 'Контейнер № 41-i2f',
  rows: [/* 4 ряда (A, B, C, D) */],
  currentClimate: {
    temperature: 22.5, humidity: 65,
    co2: 950, lighting: 250
  }
};

// Структура: 4 ряда × 10 стоек × 10 лотков = 400 лотков всего
// Заполненность: ~70% (случайная генерация)
```

### 🔧 **Функции совместимости культур:**
```typescript
// Проверка климатической совместимости
export function checkCropCompatibility(crop1Id: string, crop2Id: string): boolean

// Получение совместимых культур
export function getCompatibleCrops(baseCropId: string): CropType[]

// Получение доступных культур для контейнера
export function getAvailableCropsForContainer(containerData: ContainerStatus): CropType[]

// Получение существующих культур в контейнере
export function getExistingCropsInContainer(containerData: ContainerStatus): string[]
```

### 📈 **Генерация данных:**
- **generateMockTrays()** - Создание 10 лотков для стойки (70% заполненность)
- **generateMockRacks()** - Создание 10 стоек для ряда
- **generateMockRows()** - Создание 4 рядов (A, B, C, D)

---

## 🛠️ **УТИЛИТЫ И КОНСТАНТЫ**

### 🔧 **Lib utilities (`/app/lib/utils.ts` - 6 строк):**
```typescript
// Единственная утилита - объединение классов Tailwind
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 📋 **Константы (`/app/lib/constants.ts` - 55 строк):**
```typescript
// Конфигурация приложения
export const APP_CONFIG = {
  NAME: 'SkyFarm Management System',
  VERSION: '1.0.0',
  DESCRIPTION: 'Система управления автоматизированной фермой'
} as const;

// Маршруты приложения
export const ROUTES = {
  DASHBOARD: '/',
  FARM: '/farm',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings'
} as const;

// Лимиты контейнера
export const CONTAINER_LIMITS = {
  MAX_ROWS: 4,                  // Максимум рядов
  MAX_RACKS_PER_ROW: 10,        // Максимум стоек в ряду
  MAX_TRAYS_PER_RACK: 10        // Максимум лотков в стойке
} as const;

// Статусы элементов
export const TRAY_STATUSES = {
  EMPTY: 'empty', PLANNED: 'planned', GROWING: 'growing',
  READY: 'ready', HARVESTED: 'harvested', ERROR: 'error'
} as const;

export const RACK_STATUSES = {
  EMPTY: 'empty', PARTIAL: 'partial', FULL: 'full'
} as const;

// Стадии роста
export const GROWTH_STAGES = {
  GERMINATION: 'germination', SEEDLING: 'seedling',
  VEGETATION: 'vegetation', HARVEST: 'harvest'
} as const;

// Климатические параметры по умолчанию
export const CLIMATE_DEFAULTS = {
  TEMPERATURE: { MIN: 15, MAX: 30 },
  HUMIDITY: { MIN: 40, MAX: 80 },
  CO2: { MIN: 400, MAX: 1500 },
  LIGHTING: { MIN: 100, MAX: 500 }
} as const;

// Временные диапазоны для аналитики
export const TIME_RANGES = [
  { label: '7 дней', value: '7d', days: 7 },
  { label: '1 месяц', value: '1m', days: 30 },
  { label: '3 месяца', value: '3m', days: 90 },
  { label: '6 месяцев', value: '6m', days: 180 }
] as const;
```

---

## 🎨 **ДИЗАЙН СИСТЕМА И КОНФИГУРАЦИЯ**

### 🌈 **CSS переменные (`/app/globals.css`):**
```css
/* Светлая тема */
:root {
  --background: 0 0% 100%;           /* Белый фон */
  --foreground: 222.2 84% 4.9%;      /* Темный текст */
  --primary: 222.2 47.4% 11.2%;      /* Основной цвет */
  --secondary: 210 40% 96%;          /* Вторичный цвет */
  --muted: 210 40% 96%;              /* Приглушенный цвет */
  --accent: 210 40% 96%;             /* Акцентный цвет */
  --destructive: 0 84.2% 60.2%;      /* Красный для ошибок */
  --border: 214.3 31.8% 91.4%;       /* Цвет границ */
  --radius: 0.5rem;                  /* Радиус скругления */
}

/* Темная тема */
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... остальные переменные для темной темы */
}
```

### 🎯 **Tailwind алиасы (`tsconfig.json`):**
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./app/*"],
      "@/components/*": ["./app/components/*"],
      "@/lib/*": ["./app/lib/*"],
      "@/types/*": ["./app/types/*"],
      "@/data/*": ["./app/data/*"]
    }
  }
}
```

### ⚙️ **Tailwind конфигурация (`tailwind.config.ts`):**
- Расширенная цветовая палитра на основе CSS переменных
- Анимации с помощью `tailwindcss-animate`
- Кастомные шрифты с Inter
- Responsive брейкпоинты

---

## 🚀 **КЛЮЧЕВЫЕ ФУНКЦИИ И ВОЗМОЖНОСТИ**

### 📊 **Dashboard функциональность (Главная страница `/`):**
- ⚡ **Real-time метрики**: Обновление каждые 5 секунд
  - Температура, влажность, освещение, энергопотребление
  - Цветовая индикация статуса (good/warning/critical)
  - Графики трендов (up/down/stable)
- 📈 **Статистика фермы**:
  - Активные контейнеры (12 из 15)
  - Общий урожай (847 кг, +12% за месяц)
  - Уведомления (3 требуют внимания)
- ⚡ **Быстрые действия**:
  - Запустить полив всех контейнеров
  - Включить дневное освещение
  - Автоматическая проверка pH
  - Сбор готового урожая

### 🌱 **Farm Management (страница `/farm`):**
- 🎛️ **Управление параметрами**: Мониторинг климата контейнеров
- 🌾 **Управление выращиванием**: Полный lifecycle от посадки до урожая
  - Иерархическая структура: Контейнер → Ряд → Стойка → Лоток
  - 4 ряда × 10 стоек × 10 лотков = 400 позиций
  - Статусы лотков: empty, planned, growing, ready, harvested, error
- 📋 **Интеллектуальное планирование**:
  - Проверка совместимости культур по климатическим требованиям
  - Автоматическое определение доступных культур
  - Планирование массовых действий (посадка, сбор, очистка)
- 🎯 **Селекция и управление**:
  - Множественный выбор рядов, стоек, лотков
  - Batch операции над выбранными элементами
  - Подтверждение критических действий (остановка роста)

### 🌿 **Система культур (4 вида):**
- **🌿 Базилик**: 72 дня, температура 20-25°C, влажность 60-70%
- **🥬 Салат**: 45 дней, температура 16-22°C, влажность 50-65%
- **🥬 Шпинат**: 45 дней, температура 15-20°C, влажность 55-70%
- **🌿 Руккола**: 35 дней, температура 18-24°C, влажность 60-75%

### 🎨 **UI/UX возможности:**
- 📱 **Responsive дизайн**: Адаптивная сетка для всех устройств
- 🌙 **Темная тема**: Готовая поддержка CSS переменных
- ⚡ **Плавные анимации**: Tailwind Animate + transitions
- 🎯 **Современный интерфейс**: Radix UI компоненты
- 🔄 **Real-time обновления**: Симуляция live данных
- 📊 **Интерактивные элементы**: Progress bars, badges, карточки метрик

---

## 🔧 **КОМАНДЫ РАЗРАБОТКИ**

### 🏃‍♂️ **Основные команды:**
```bash
# Установка зависимостей
npm install

# Разработка
npm run dev              # Запуск dev сервера (http://localhost:3000)

# Сборка
npm run build           # Production сборка
npm run start           # Запуск production версии

# Проверка кода
npm run lint            # ESLint проверка
npm run type-check      # TypeScript проверка
```

### 📁 **Полезные пути:**
```bash
# Компоненты
app/components/dashboard/    # Dashboard компоненты
app/components/farm/         # Farm компоненты
app/components/ui/           # UI библиотека
app/components/shared/       # Общие компоненты

# Типы и данные
app/types/                   # TypeScript типы
app/data/                    # Данные и API
app/lib/                     # Утилиты
```

---

## 🎯 **АРХИТЕКТУРНЫЕ РЕШЕНИЯ**

### ✅ **Принятые решения:**
- **📁 Модульная структура**: Компоненты разделены по функциональности
- **🔄 Единые index.ts**: Централизованный экспорт в каждой папке
- **🎨 Radix UI**: Консистентная UI библиотека
- **📊 Mock данные**: Полная симуляция реальной работы фермы
- **🔧 TypeScript**: Строгая типизация для всех интерфейсов
- **⚡ Next.js App Router**: Современная архитектура маршрутизации

### 🚀 **Возможности расширения:**
- **🌐 IoT интеграция**: Готовые типы для подключения реальных датчиков
- **📱 Mobile app**: Responsive дизайн как основа для мобильной версии
- **🤖 AI аналитика**: Готовая структура данных для ML моделей
- **🏢 Multi-farm**: Масштабируемая архитектура контейнеров
- **🔄 Real-time sync**: WebSocket интеграция для live обновлений
- **📈 Analytics**: Готовые типы временных диапазонов и графиков

---

## 📞 **КОНТЕКСТ ДЛЯ CLAUDE CODE**

### 🎯 **При работе с проектом используй:**

1. **Алиасы импортов** (настроены в `tsconfig.json`):
   ```typescript
   import { Button } from '@/components/ui/button'
   import { ContainerStatus, CropType } from '@/types/farming'
   import { cn } from '@/lib/utils'
   import { mockContainerData, mockCrops } from '@/data/mockData'
   import { APP_CONFIG, CONTAINER_LIMITS } from '@/lib/constants'
   ```

2. **Структуру компонентов**:
   - Dashboard → `@/components/dashboard/FarmDashboard`
   - Farm → `@/components/farm/` (9 компонентов)
   - UI → `@/components/ui/` (21 файл: 20 TSX + 1 hook)
   - Shared → `@/components/shared/` (Layout, Header, Sidebar)

3. **Ключевые файлы для понимания**:
   - `app/types/farming.ts` - Все типы данных (103 строки)
   - `app/data/mockData.ts` - Моковые данные (259 строк)
   - `app/lib/constants.ts` - Константы приложения (55 строк)
   - `app/components/dashboard/FarmDashboard.tsx` - Главный дашборд (201 строка)

4. **Паттерны кода**:
   - **TypeScript**: Строгая типизация с as const
   - **React**: Functional components + useState/useEffect hooks
   - **Tailwind CSS**: Utility-first стили + cn() helper
   - **Radix UI**: Headless компоненты для сложной UI
   - **Export patterns**: index.ts в каждой папке компонентов

5. **Ключевые концепции**:
   - **Иерархия**: Container → Row → Rack → Tray (400 позиций)
   - **Культуры**: 4 вида с климатическими требованиями
   - **Совместимость**: Автоматическая проверка по климату
   - **Статусы**: empty/planned/growing/ready/harvested/error
   - **Real-time**: Симуляция live данных с интервалами

### 🔗 **Навигация по документации:**
- **Центральная документация**: `CLAUDE.md` (этот файл)
- **Пользовательская документация**: `README.md`
- **Детальная документация**:
  - [`docs/DOCS.md`](docs/DOCS.md) - Обзор документации
  - [`docs/app/APP.md`](docs/app/APP.md) - App Directory (53 файла)
  - [`docs/app/components/COMPONENTS.md`](docs/app/components/COMPONENTS.md) - React компоненты (34 файла)
  - [`docs/app/types/TYPES.md`](docs/app/types/TYPES.md) - TypeScript типы (103 строки)
  - [`docs/app/data/DATA.md`](docs/app/data/DATA.md) - Данные и API (259 строк)
  - [`docs/app/lib/LIB.md`](docs/app/lib/LIB.md) - Утилиты и константы (60 строк)

---

## 📊 **СТАТИСТИКА ПРОЕКТА**

- **Общие файлы**: 59 файлов (исключая node_modules, .next)
- **Компоненты**: 34 файла (33 TSX компонента + 1 TS hook)
- **Строки кода**: ~2000+ строк TypeScript/TSX
- **Типы**: 15 основных интерфейсов
- **UI компоненты**: 21 файл (20 Radix UI TSX + 1 TS hook)
- **Зависимости**: 37 production + 4 dev зависимости

**Статус**: ✅ Полностью функциональная система управления фермой
**Последнее обновление**: 29 сентября 2024
**Версия**: 1.0.0