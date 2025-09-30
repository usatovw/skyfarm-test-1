# 📋 ТЕХНИЧЕСКАЯ СПЕЦИФИКАЦИЯ: Новая Система Управления Контейнерами

## 🎯 Цель проекта
Реализовать планшетно-ориентированную систему управления контейнерами с иерархической навигацией (Контейнер → Ряд → Стойка → Поддон) и интеллектуальной системой планирования посадок.

---

## 📊 АРХИТЕКТУРА ДАННЫХ

### 1. Структура контейнера
```
Контейнер № 41-i2f
├── Ряд A (6 стоек × 7 поддонов = 42 поддона)
│   ├── Стойка 1 (7 поддонов вертикально)
│   ├── Стойка 2 (7 поддонов)
│   ├── ...
│   └── Стойка 6 (7 поддонов)
└── Ряд B (6 стоек × 7 поддонов = 42 поддона)
    ├── Стойка 1 (7 поддонов вертикально)
    └── ...

ИТОГО: 2 ряда × 6 стоек × 7 поддонов = 84 поддона
```

### 2. Статусы поддонов (8 состояний)

| № | Статус | Описание | Переход |
|---|--------|----------|---------|
| 1 | `empty` | Пустой поддон | → `planned` (через посадку) |
| 2 | `planned` | Запланирована посадка (черновик) | → `growing` (после применения) |
| 3 | `growing` | Активно растет | → `ready` (автоматически) или → `stop_pending` |
| 4 | `ready` | Готов к сбору урожая | → `harvested` (через сбор) |
| 5 | `harvested` | Собран, требует очистки | → `empty` (через очистку) |
| 6 | `stop_pending` | Помечен на прекращение выращивания | → `empty` (после применения) или ← `growing` (отмена) |
| 7 | `problem` | Проблема/ошибка в процессе роста | Требует внимания агронома |
| 8 | `no_data` | Не выбран ни один поддон | UI состояние (не в БД) |

### 3. Обновленные TypeScript типы

```typescript
// Расширенные статусы поддонов
export type TrayStatus =
  | 'empty'           // Пустой
  | 'planned'         // Запланировано (черновик)
  | 'growing'         // Растет
  | 'ready'           // Готов к сбору
  | 'harvested'       // Собран
  | 'stop_pending'    // На прекращение
  | 'problem'         // Проблема

export type TrayUIState = TrayStatus | 'no_data' | 'mixed_selection'

export interface Tray {
  id: string
  rackId: string
  position: number // 1-7 вертикально снизу вверх
  status: TrayStatus
  crop?: {
    cropId: string
    plantedDate?: Date
    currentStage: string      // germination, seedling, vegetation, harvest
    daysInStage: number
    totalDaysGrowing: number
    estimatedHarvestDate?: Date
    actualHarvestDate?: Date
    stageProgress: number     // 0-100%
    problems?: Problem[]
  }
}

export interface Problem {
  id: string
  type: 'climate' | 'nutrition' | 'disease' | 'other'
  severity: 'low' | 'medium' | 'high'
  description: string
  detectedAt: Date
}

export interface Rack {
  id: string
  rowId: string
  position: number // 1-6 в ряду
  trays: Tray[] // 7 поддонов
  status: 'empty' | 'partial' | 'full' // Визуальный статус
  hasProblems: boolean
  hasReadyToHarvest: boolean
}

export interface Row {
  id: string
  name: 'A' | 'B'
  racks: Rack[] // 6 стоек
  totalTrays: number // 42
  occupiedTrays: number
}

export interface Container {
  id: string
  name: string
  rows: Row[] // 2 ряда
  currentClimate: ClimateData
  stats: {
    totalTrays: number      // 84
    occupied: number        // Занято (не empty)
    occupiedPercent: number // %
    planned: number         // Размещено (planned)
    plannedPercent: number  // % от occupied
    growing: number         // Растет (growing)
    growingPercent: number  // % от occupied
    ready: number           // Готово (ready)
    readyPercent: number    // % от occupied
    free: number            // Свободно (empty)
    freePercent: number     // % от total
  }
}
```

### 4. Система черновиков (Draft System)

```typescript
export interface DraftAction {
  id: string
  type: 'plant' | 'harvest' | 'clear' | 'stop_growing' | 'cancel_stop'
  targetType: 'row' | 'rack' | 'tray'
  targetIds: string[]
  cropId?: string
  createdAt: Date
  affectedTrays: string[] // Список ID поддонов
}

export interface DraftState {
  actions: DraftAction[]
  selectedItems: {
    rows: Set<string>
    racks: Set<string>
    trays: Set<string>
  }
  mode: 'single' | 'multi' // Режим выбора
}

// Применение черновика
export interface ApplyDraftResult {
  success: boolean
  appliedActions: DraftAction[]
  failedActions: {action: DraftAction, reason: string}[]
  updatedTrays: Tray[]
}
```

---

## 🎨 КОМПОНЕНТНАЯ АРХИТЕКТУРА

### Компоненты для реализации

```
app/components/farm/v2/  (новые компоненты)
├── container/
│   ├── ContainerView.tsx           # Главный срез контейнера
│   ├── ContainerStats.tsx          # 6 виджетов статистики
│   ├── ContainerSchema.tsx         # Схема рядов и стоек
│   ├── RowButton.tsx               # Кнопка выбора ряда
│   └── RackCard.tsx                # Карточка стойки (long/short press)
│
├── rack/
│   ├── RackView.tsx                # Срез стойки
│   ├── RackStats.tsx               # Статистика стойки
│   ├── RackSchema.tsx              # Вертикальная схема 7 поддонов
│   └── TrayCard.tsx                # Карточка поддона в стойке
│
├── tray/
│   ├── TrayPreview.tsx             # Превью поддона (8 состояний)
│   ├── TrayPreviewEmpty.tsx        # Пустой поддон
│   ├── TrayPreviewPlanned.tsx      # Запланированный
│   ├── TrayPreviewGrowing.tsx      # Растущий
│   ├── TrayPreviewReady.tsx        # Готовый
│   ├── TrayPreviewHarvested.tsx    # Собранный
│   ├── TrayPreviewStopPending.tsx  # На прекращение
│   ├── TrayPreviewProblem.tsx      # С проблемой
│   └── TrayPreviewNoData.tsx       # Не выбран
│
├── actions/
│   ├── MultiSelectPanel.tsx        # Нижняя панель массовых действий
│   ├── ContextMenu.tsx             # Контекстное меню (long press)
│   ├── CropSelectorModal.tsx       # Селектор культур с фильтрацией
│   └── ApplyChangesModal.tsx       # Модальное окно применения изменений
│
├── hooks/
│   ├── useLongPress.ts             # Hook для long press
│   ├── useSelection.ts             # Hook для управления выбором
│   ├── useDraftActions.ts          # Hook для черновиков
│   └── useCompatibility.ts         # Hook для проверки совместимости
│
└── utils/
    ├── calculateStats.ts           # Расчет статистики
    ├── filterCompatibleCrops.ts   # Фильтрация культур
    └── validateActions.ts          # Валидация действий
```

---

## 🎯 МЕХАНИКА ВЗАИМОДЕЙСТВИЯ

### 1. SHORT PRESS (Одиночное нажатие)

#### Режим SINGLE (одиночный):
- **Стойка**: переход в срез стойки
- **Поддон**: показ превью справа

#### Режим MULTI (множественный выбор):
- **Стойка**: добавление/удаление из выбранных
- **Поддон**: добавление/удаление из выбранных

### 2. LONG PRESS (Долгое нажатие)

Открывает контекстное меню с действиями:

#### Для стойки:
```typescript
interface RackContextMenu {
  actions: [
    { id: 'enter', label: 'Перейти в стойку', icon: 'ArrowRight' },
    { id: 'select', label: 'Выбрать', icon: 'Check' }, // Переход в multi mode
    { id: 'plant', label: 'Запланировать посадку', icon: 'Sprout', disabled: !hasEmptyTrays },
    { id: 'harvest', label: 'Собрать урожай', icon: 'Scissors', disabled: !hasReadyTrays },
    { id: 'clear', label: 'Очистить посадку', icon: 'Trash', disabled: !hasPlannedTrays },
    { id: 'stop', label: 'Прекратить выращивание', icon: 'StopCircle', disabled: !hasGrowingTrays },
    { id: 'cancel_stop', label: 'Отменить прекращение', icon: 'Undo', disabled: !hasStopPendingTrays }
  ]
}
```

#### Для поддона:
```typescript
interface TrayContextMenu {
  actions: [
    { id: 'enter', label: 'Перейти в поддон', icon: 'ArrowRight' },
    { id: 'select', label: 'Выбрать', icon: 'Check' },
    // Действия в зависимости от статуса:
    { id: 'plant', label: 'Засадить', enabled: status === 'empty' },
    { id: 'clear_plan', label: 'Отменить посадку', enabled: status === 'planned' },
    { id: 'stop', label: 'Прекратить выращивание', enabled: status === 'growing' },
    { id: 'cancel_stop', label: 'Отменить прекращение', enabled: status === 'stop_pending' },
    { id: 'harvest', label: 'Собрать урожай', enabled: status === 'ready' },
    { id: 'clear', label: 'Очистить поддон', enabled: status === 'harvested' }
  ]
}
```

### 3. Переход в режим MULTI

**Способы активации:**
1. Long press → "Выбрать" в контекстном меню
2. Клик по кнопке "Ряд A" или "Ряд B" (выбирается весь ряд)
3. Программно через action

**В режиме MULTI:**
- Появляется нижняя панель массовых действий
- Short press добавляет/убирает из выбора
- Отображается счетчик выбранных элементов
- Доступны массовые операции

---

## 📐 ВИДЖЕТЫ СТАТИСТИКИ КОНТЕЙНЕРА

### 6 виджетов на срезе контейнера:

```typescript
interface ContainerStatsWidgets {
  total: {
    value: 84,
    label: 'Всего поддонов',
    description: 'Общая вместимость контейнера'
  },
  occupied: {
    value: 60,
    percent: 71,
    label: 'Занято',
    description: 'Поддоны в использовании (не empty)'
  },
  planned: {
    value: 20,
    percent: 24, // от total
    percentOfOccupied: 33, // от occupied
    label: 'Размещено',
    description: 'Запланировано к посадке'
  },
  growing: {
    value: 35,
    percent: 42, // от total
    percentOfOccupied: 58, // от occupied
    label: 'Растет',
    description: 'Активно выращивается'
  },
  ready: {
    value: 5,
    percent: 6, // от total
    percentOfOccupied: 8, // от occupied
    label: 'Готово',
    description: 'Готово к сбору урожая'
  },
  free: {
    value: 24,
    percent: 29,
    label: 'Свободно',
    description: 'Пустые поддоны'
  }
}
```

**Формулы расчета:**
```typescript
const occupied = planned + growing + ready + harvested + stop_pending + problem
const free = total - occupied
const occupiedPercent = (occupied / total) * 100
const plannedPercent = (planned / total) * 100
const growingPercent = (growing / total) * 100
const readyPercent = (ready / total) * 100
const freePercent = (free / total) * 100
```

---

## 🌱 СИСТЕМА КУЛЬТУР

### Культуры из Excel:

```typescript
export const crops = [
  {
    id: 'arugula',
    name: 'Руккола',
    icon: '🌿',
    stages: [
      { name: 'Проростки', duration: 4, ph: [5.8, 6.2], ec: [900, 1200], temp: [20, 22], humidity: [70, 75] },
      { name: 'Вегетация', duration: 11, ph: [6.0, 6.5], ec: [900, 1200], temp: [20, 22], humidity: [70, 75] },
      { name: 'Созревание', duration: 8, ph: [6.0, 6.5], ec: [1300, 1400], temp: [20, 22], humidity: [70, 75] }
    ],
    totalDays: 23 // 3-5 + 10-15 + 7-10 = ~23 (средние значения)
  },
  {
    id: 'lollo_rossa',
    name: 'Лолло Росса',
    icon: '🥬',
    stages: [
      { name: 'Проростки', duration: 5, ph: [5.8, 6.2], ec: [900, 1200], temp: [20, 22], humidity: [70, 75] },
      { name: 'Вегетация', duration: 17, ph: [5.8, 6.3], ec: [900, 1400], temp: [20, 22], humidity: [70, 75] },
      { name: 'Созревание', duration: 8, ph: [6.0, 6.3], ec: [1300, 1400], temp: [20, 22], humidity: [70, 75] }
    ],
    totalDays: 30
  },
  {
    id: 'romano',
    name: 'Романо',
    icon: '🥬',
    stages: [
      { name: 'Проростки', duration: 6, ph: [5.8, 6.3], ec: [900, 1200], temp: [20, 22], humidity: [70, 75] },
      { name: 'Вегетация', duration: 22, ph: [5.8, 6.4], ec: [900, 1400], temp: [20, 22], humidity: [70, 75] },
      { name: 'Созревание', duration: 12, ph: [6.0, 6.5], ec: [1300, 1400], temp: [20, 22], humidity: [70, 75] }
    ],
    totalDays: 40
  },
  {
    id: 'endive',
    name: 'Эндивий',
    icon: '🥬',
    stages: [
      { name: 'Проростки', duration: 5, ph: [5.8, 6.3], ec: [900, 1200], temp: [20, 22], humidity: [70, 75] },
      { name: 'Вегетация', duration: 17, ph: [5.9, 6.4], ec: [900, 1400], temp: [20, 22], humidity: [70, 75] },
      { name: 'Созревание', duration: 12, ph: [6.0, 6.5], ec: [1300, 1400], temp: [20, 22], humidity: [70, 75] }
    ],
    totalDays: 34
  }
]
```

### Проверка совместимости:

```typescript
function checkCropCompatibility(crop1: Crop, crop2: Crop): boolean {
  // Проверяем пересечение температурных диапазонов
  const tempOverlap = Math.max(0,
    Math.min(crop1.maxTemp, crop2.maxTemp) -
    Math.max(crop1.minTemp, crop2.minTemp)
  )

  // Проверяем пересечение влажности
  const humidityOverlap = Math.max(0,
    Math.min(crop1.maxHumidity, crop2.maxHumidity) -
    Math.max(crop1.minHumidity, crop2.minHumidity)
  )

  // Проверяем pH
  const phOverlap = Math.max(0,
    Math.min(crop1.maxPh, crop2.maxPh) -
    Math.max(crop1.minPh, crop2.minPh)
  )

  // Проверяем EC
  const ecOverlap = Math.max(0,
    Math.min(crop1.maxEc, crop2.maxEc) -
    Math.max(crop1.minEc, crop2.minEc)
  )

  // Совместимы если есть пересечения ВСЕХ параметров
  return tempOverlap > 0 && humidityOverlap > 0 && phOverlap > 0.1 && ecOverlap > 50
}
```

**Правило:** При планировании посадки показываются только те культуры, которые совместимы со ВСЕМИ уже растущими культурами в контейнере.

---

## 🔄 СЦЕНАРИЙ РАБОТЫ АГРОНОМА

### Сценарий 1: Посадка новой культуры

```
1. Агроном открывает Контейнер № 41-i2f
2. Видит статистику: 24 свободных поддона
3. Нажимает кнопку "Ряд A" → весь ряд выделяется (6 стоек)
4. Появляется нижняя панель: "Выбрано стоек: 6"
5. Нажимает кнопку "Засадить" → открывается CropSelector
6. Система показывает только совместимые культуры (Руккола заблокирована, т.к. уже растет Романо с другими параметрами)
7. Выбирает "Лолло Росса"
8. Система создает draft action: plant → 42 поддона → lollo_rossa
9. Виджет "Размещено" меняется: 20 → 62 (+42)
10. Агроном нажимает "Применить изменения"
11. Система показывает список всех изменений с чекбоксами
12. Агроном подтверждает → статус поддонов меняется: empty → planned → growing
```

### Сценарий 2: Прекращение выращивания

```
1. Агроном провалился в Стойку 3 ряда B
2. Видит 7 поддонов вертикально
3. Long press на Поддон 4 → контекстное меню
4. Выбирает "Прекратить выращивание"
5. Открывается модалка подтверждения с предупреждением
6. Агроном подтверждает → поддон помечается stop_pending (оранжевый)
7. Действие добавляется в черновик
8. После "Применить изменения" → поддон переходит в empty
```

### Сценарий 3: Сбор урожая

```
1. Агроном на срезе контейнера
2. Виджет "Готово" показывает: 5 поддонов (6%)
3. Long press на Стойку 2 ряда A (у нее иконка "Готово к сбору" 🌿)
4. Контекстное меню → "Собрать урожай"
5. Система автоматически выбирает только поддоны со статусом ready
6. После применения → статус меняется: ready → harvested
7. Агроном может очистить: harvested → empty
```

---

## 🎨 UI/UX ТРЕБОВАНИЯ

### Цветовая схема статусов:

| Статус | Цвет | Описание |
|--------|------|----------|
| `empty` | `bg-gray-100` | Серый, свободный |
| `planned` | `bg-blue-200` | Голубой, размещено |
| `growing` | `bg-green-300` | Зеленый, растет |
| `ready` | `bg-emerald-400` | Ярко-зеленый, готово |
| `harvested` | `bg-yellow-300` | Желтый, собрано |
| `stop_pending` | `bg-orange-300` | Оранжевый, на прекращение |
| `problem` | `bg-red-300` | Красный, проблема |

### Иконки индикаторов:

- **Проблема** `⚠️`: Красный кружок с восклицательным знаком
- **Готово к сбору** `🌿`: Зеленая иконка растения
- **Заполнено полностью** `●`: Темно-зеленый круг
- **Частично заполнено** `◐`: Половинчатый круг
- **Пусто** `○`: Пустой круг

### Анимации:

- Переход между срезами: `slide-in-right` (300ms)
- Выбор элемента: `scale(1.05)` + border highlight
- Long press: Вибрация (на поддерживаемых устройствах) + haptic feedback
- Появление панели действий: `slide-up` (250ms)

---

## 📱 АДАПТАЦИЯ ПОД ПЛАНШЕТ

### Touch события:

```typescript
// useLongPress.ts
export function useLongPress(
  onLongPress: () => void,
  onShortPress: () => void,
  delay = 500
) {
  const timerRef = useRef<NodeJS.Timeout>()
  const isLongPressRef = useRef(false)

  const start = useCallback(() => {
    isLongPressRef.current = false
    timerRef.current = setTimeout(() => {
      isLongPressRef.current = true
      onLongPress()
      // Вибрация на планшете
      if (window.navigator.vibrate) {
        window.navigator.vibrate(50)
      }
    }, delay)
  }, [onLongPress, delay])

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
  }, [])

  const end = useCallback(() => {
    cancel()
    if (!isLongPressRef.current) {
      onShortPress()
    }
  }, [cancel, onShortPress])

  return {
    onMouseDown: start,
    onMouseUp: end,
    onMouseLeave: cancel,
    onTouchStart: start,
    onTouchEnd: end,
    onTouchMove: cancel,
  }
}
```

### Размеры элементов для планшета:

- Минимальный размер кнопки/карточки: `64px × 64px`
- Карточка стойки: `120px × 80px`
- Карточка поддона: `100px × 60px`
- Панель действий: высота `80px`
- Контекстное меню: ширина `280px`

---

## ✅ КРИТЕРИИ ПРИЕМКИ

### Функциональные требования:

- [x] Корректная структура 2 ряда × 6 стоек × 7 поддонов
- [ ] Работает long press с контекстным меню
- [ ] Работает short press для навигации и выбора
- [ ] Режимы single/multi переключаются корректно
- [ ] Виджеты статистики рассчитываются правильно
- [ ] Система черновиков работает
- [ ] Применение изменений обновляет статусы
- [ ] Проверка совместимости культур работает
- [ ] Все 8 состояний превью поддонов реализованы
- [ ] Навигация между срезами работает

### UI/UX требования:

- [ ] Дизайн соответствует container.png
- [ ] Анимации плавные (60fps)
- [ ] Long press срабатывает через 500ms
- [ ] Вибрация на планшетах работает
- [ ] Цветовая схема соблюдена
- [ ] Размеры элементов подходят для touch
- [ ] Responsive на всех разрешениях

### Производительность:

- [ ] Рендер контейнера < 100ms
- [ ] Переключение срезов < 300ms
- [ ] Расчет статистики < 50ms
- [ ] Нет лагов при скролле

---

## 🚀 ПЛАН РЕАЛИЗАЦИИ

### Этап 1: Фундамент (День 1)
1. ✅ Обновить типы данных (farming.ts)
2. ✅ Добавить культуры из Excel
3. ✅ Создать useLongPress hook
4. ✅ Создать useSelection hook
5. ✅ Обновить mockData (2×6×7)

### Этап 2: Компоненты контейнера (День 2)
6. [ ] ContainerView.tsx
7. [ ] ContainerStats.tsx
8. [ ] ContainerSchema.tsx
9. [ ] RackCard.tsx с long/short press

### Этап 3: Компоненты стойки (День 3)
10. [ ] RackView.tsx
11. [ ] RackSchema.tsx (вертикальная)
12. [ ] TrayCard.tsx
13. [ ] TrayPreview (8 вариантов)

### Этап 4: Интерактив (День 4)
14. [ ] MultiSelectPanel.tsx
15. [ ] ContextMenu.tsx
16. [ ] CropSelectorModal.tsx
17. [ ] ApplyChangesModal.tsx

### Этап 5: Логика (День 5)
18. [ ] useDraftActions hook
19. [ ] useCompatibility hook
20. [ ] Функции валидации
21. [ ] Система применения изменений

### Этап 6: Тестирование (День 6)
22. [ ] Тестирование всех сценариев
23. [ ] Исправление багов
24. [ ] Оптимизация производительности
25. [ ] Финальная полировка

---

## 📊 МЕТРИКИ УСПЕХА

- **Функциональность**: 100% сценариев работают
- **Производительность**: < 100ms рендер
- **UX**: Long press работает интуитивно
- **Совместимость**: Корректная фильтрация культур
- **Стабильность**: 0 критических багов

---

**Статус**: 🟡 В разработке
**Версия**: 2.0.0
**Дата**: 2024-09-30