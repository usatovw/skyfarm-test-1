# 🔧 Lib Documentation

Документация утилит и констант проекта SkyFarm.

## 📁 Структура lib

```
lib/
├── constants.ts        # Константы приложения (55 строк)
└── utils.ts            # Tailwind utilities (5 строк)
```

## 🛠️ utils.ts (5 строк)

### cn() функция
**Назначение**: Объединение и оптимизация Tailwind CSS классов
**Библиотеки**: `clsx` + `tailwind-merge`

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Использование cn():
```typescript
// Базовое использование
const buttonClass = cn(
  'px-4 py-2 rounded',
  'bg-blue-500 text-white',
  isActive && 'bg-blue-700',
  className
);

// Разрешение конфликтов Tailwind
const cardClass = cn(
  'p-4 bg-white',   // базовые стили
  'p-6',            // tailwind-merge автоматически оставит p-6
  className         // пользовательские классы
);

// Условные классы
const statusClass = cn(
  'badge',
  {
    'badge-success': status === 'good',
    'badge-warning': status === 'warning',
    'badge-error': status === 'error'
  }
);
```

## 📋 constants.ts (55 строк)

### 🏗️ APP_CONFIG
**Назначение**: Основная конфигурация приложения
```typescript
export const APP_CONFIG = {
  NAME: 'SkyFarm Management System',
  VERSION: '1.0.0',
  DESCRIPTION: 'Система управления автоматизированной фермой',
} as const;
```

### 🗺️ ROUTES
**Назначение**: Централизованное управление маршрутами
```typescript
export const ROUTES = {
  DASHBOARD: '/',
  FARM: '/farm',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
} as const;
```

### 📏 CONTAINER_LIMITS
**Назначение**: Физические ограничения контейнера
```typescript
export const CONTAINER_LIMITS = {
  MAX_ROWS: 4,                  // Максимум рядов (A, B, C, D)
  MAX_RACKS_PER_ROW: 10,        // Максимум стоек в ряду
  MAX_TRAYS_PER_RACK: 10,       // Максимум лотков в стойке
} as const;

// Общая вместимость: 4 × 10 × 10 = 400 лотков
```

### 🏷️ TRAY_STATUSES
**Назначение**: Возможные статусы лотков
```typescript
export const TRAY_STATUSES = {
  EMPTY: 'empty',               // Пустой лоток
  PLANNED: 'planned',           // Запланирована посадка
  GROWING: 'growing',           // Растение растет
  READY: 'ready',               // Готово к сбору
  HARVESTED: 'harvested',       // Собрано
  ERROR: 'error',               // Ошибка/проблема
} as const;
```

### 📦 RACK_STATUSES
**Назначение**: Статусы заполненности стоек
```typescript
export const RACK_STATUSES = {
  EMPTY: 'empty',               // Все лотки пустые
  PARTIAL: 'partial',           // Частично заполнена
  FULL: 'full',                 // Все лотки заняты
} as const;
```

### 🌱 GROWTH_STAGES
**Назначение**: Стадии роста растений
```typescript
export const GROWTH_STAGES = {
  GERMINATION: 'germination',   // Проращивание
  SEEDLING: 'seedling',         // Рассада
  VEGETATION: 'vegetation',     // Вегетация
  HARVEST: 'harvest',           // Сбор урожая
} as const;
```

### 🌡️ CLIMATE_DEFAULTS
**Назначение**: Диапазоны климатических параметров по умолчанию
```typescript
export const CLIMATE_DEFAULTS = {
  TEMPERATURE: { MIN: 15, MAX: 30 },    // Температура в °C
  HUMIDITY: { MIN: 40, MAX: 80 },       // Влажность в %
  CO2: { MIN: 400, MAX: 1500 },         // CO2 в ppm
  LIGHTING: { MIN: 100, MAX: 500 },     // Освещение в µmol/m²/s
} as const;
```

### 📊 TIME_RANGES
**Назначение**: Временные диапазоны для аналитики
```typescript
export const TIME_RANGES = [
  { label: '7 дней', value: '7d', days: 7 },
  { label: '1 месяц', value: '1m', days: 30 },
  { label: '3 месяца', value: '3m', days: 90 },
  { label: '6 месяцев', value: '6m', days: 180 },
] as const;
```

## 🎯 Использование констант

### Импорт констант
```typescript
import {
  APP_CONFIG,
  ROUTES,
  CONTAINER_LIMITS,
  TRAY_STATUSES,
  CLIMATE_DEFAULTS
} from '@/lib/constants';
```

### Примеры использования

#### В компонентах
```typescript
// Навигация
const handleNavigate = () => {
  router.push(ROUTES.FARM);
};

// Проверка лимитов
const canAddRow = container.rows.length < CONTAINER_LIMITS.MAX_ROWS;

// Проверка статуса
if (tray.status === TRAY_STATUSES.READY) {
  // Готов к сбору урожая
}

// Валидация климата
const isValidTemperature = temp >= CLIMATE_DEFAULTS.TEMPERATURE.MIN &&
                          temp <= CLIMATE_DEFAULTS.TEMPERATURE.MAX;
```

#### В утилитах
```typescript
// Функция генерации статуса стойки
function calculateRackStatus(occupiedTrays: number): string {
  if (occupiedTrays === 0) return RACK_STATUSES.EMPTY;
  if (occupiedTrays === CONTAINER_LIMITS.MAX_TRAYS_PER_RACK) return RACK_STATUSES.FULL;
  return RACK_STATUSES.PARTIAL;
}

// Функция проверки готовности к сбору
function isReadyForHarvest(tray: TrayStatus): boolean {
  return tray.status === TRAY_STATUSES.READY ||
         tray.status === TRAY_STATUSES.GROWING && /* условие по времени */;
}
```

#### В типах
```typescript
// Использование в типизации
type TrayStatusType = typeof TRAY_STATUSES[keyof typeof TRAY_STATUSES];
type RackStatusType = typeof RACK_STATUSES[keyof typeof RACK_STATUSES];
type GrowthStageType = typeof GROWTH_STAGES[keyof typeof GROWTH_STAGES];
```

## 🔧 Паттерны использования

### as const
Все константы используют `as const` для:
- Строгой типизации
- Предотвращения мутаций
- Получения literal типов вместо string

### Именование
- **UPPER_SNAKE_CASE** для констант объектов
- **PascalCase** для экспортируемых объектов
- **UPPER_CASE** для ключей в объектах констант

### Структурирование
- Группировка логически связанных констант
- Комментарии для пояснения назначения
- Единообразие структуры объектов

## 📈 Статистика lib

- **Файлов**: 2 (constants.ts, utils.ts)
- **Строк кода**: 62 строки общих
- **Констант групп**: 7 основных групп
- **Функций**: 1 утилитарная функция (cn)
- **Зависимостей**: clsx, tailwind-merge
- **Типов**: Все константы строго типизированы