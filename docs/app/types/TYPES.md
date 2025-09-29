# 📝 Types Documentation

Документация системы типов TypeScript для проекта SkyFarm.

## 📁 Структура типов

```
types/
├── farming.ts          # Основные типы фермы (103 строки)
└── index.ts            # UI типы и экспорт всех типов
```

## 🌾 Основные типы (farming.ts)

### 🌱 Типы культур и роста

#### CropType
```typescript
interface CropType {
  id: string;                    // Уникальный ID культуры
  name: string;                  // Название (Базилик, Салат, etc.)
  icon: string;                  // Эмодзи иконка (🌿, 🥬)
  color: string;                 // Цвет для UI (#22C55E)
  climateRequirements: {         // Климатические требования
    temperature: { min: number; max: number };
    humidity: { min: number; max: number };
    co2: { min: number; max: number };
    lighting: { min: number; max: number };
  };
  growthStages: GrowthStage[];   // Стадии роста
  totalGrowthDays: number;       // Общее время выращивания
}
```

#### GrowthStage
```typescript
interface GrowthStage {
  id: string;                    // ID стадии
  name: string;                  // Название стадии
  duration: number;              // Длительность в днях
  description: string;           // Описание стадии
  icon: string;                  // Иконка стадии
}
```

### 🏗️ Иерархия контейнеров

#### Структура: Container → Row → Rack → Tray

#### TrayStatus (Лоток)
```typescript
interface TrayStatus {
  id: string;                    // Уникальный ID лотка
  rackId: string;                // ID родительской стойки
  position: number;              // Позиция в стойке (1-10)
  status: 'empty' | 'planned' | 'growing' | 'ready' | 'harvested' | 'error';
  crop?: {                       // Информация о культуре (если растет)
    cropId: string;
    plantedDate?: Date;
    currentStage?: string;
    daysInStage?: number;
    harvestDate?: Date;
  };
}
```

#### RackStatus (Стойка)
```typescript
interface RackStatus {
  id: string;                    // Уникальный ID стойки
  rowId: string;                 // ID родительского ряда
  position: number;              // Позиция в ряду (1-10)
  trays: TrayStatus[];           // Массив лотков (10 штук)
  totalTrays: number;            // Общее количество лотков
  occupiedTrays: number;         // Занятые лотки
  status: 'empty' | 'partial' | 'full';
}
```

#### RowStatus (Ряд)
```typescript
interface RowStatus {
  id: string;                    // Уникальный ID ряда
  name: string;                  // Название ряда (A, B, C, D)
  racks: RackStatus[];           // Массив стоек (10 штук)
  totalTrays: number;            // Общее количество лотков в ряду
  occupiedTrays: number;         // Занятые лотки в ряду
}
```

#### ContainerStatus (Контейнер)
```typescript
interface ContainerStatus {
  id: string;                    // Уникальный ID контейнера
  name: string;                  // Название контейнера
  rows: RowStatus[];             // Массив рядов (4 штуки: A, B, C, D)
  currentClimate: {              // Текущие климатические параметры
    temperature: number;
    humidity: number;
    co2: number;
    lighting: number;
  };
  activeMode?: {                 // Активный режим выращивания
    cropId: string;
    parameters: any;
  };
}
```

### ⚙️ Типы управления изменениями

#### ChangesDraft
```typescript
interface ChangesDraft {
  selectedItems: {               // Выбранные элементы для действий
    rows: string[];
    racks: string[];
    trays: string[];
  };
  plannedActions: PlannedAction[]; // Запланированные действия
}
```

#### PlannedAction
```typescript
interface PlannedAction {
  id: string;                    // ID действия
  type: 'plant' | 'harvest' | 'clear' | 'stop_growing';
  targetType: 'row' | 'rack' | 'tray';
  targetIds: string[];           // ID целевых элементов
  cropId?: string;               // ID культуры (для посадки)
  scheduledDate?: Date;          // Запланированная дата
  forceStop?: boolean;           // Принудительная остановка
}
```

#### SelectionState
```typescript
interface SelectionState {
  selectedRows: Set<string>;     // Выбранные ряды
  selectedRacks: Set<string>;    // Выбранные стойки
  selectedTrays: Set<string>;    // Выбранные лотки
  mode: 'none' | 'selecting' | 'contextMenu';
}
```

#### ViewMode
```typescript
interface ViewMode {
  current: 'overview' | 'rack-detail' | 'tray-detail';
  selectedRackId?: string;
  selectedTrayId?: string;
}
```

## 🎨 UI типы (index.ts)

### UIToastMessage
```typescript
interface UIToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}
```

### NavigationItem
```typescript
interface NavigationItem {
  id: string;
  title: string;
  icon: string;
  href: string;
  isActive?: boolean;
}
```

### BreadcrumbItem
```typescript
interface BreadcrumbItem {
  title: string;
  href?: string;
}
```

### ChartDataPoint
```typescript
interface ChartDataPoint {
  name: string;
  value: number;
  timestamp: string;
}
```

### TimeRange
```typescript
interface TimeRange {
  label: string;
  value: string;
  days: number;
}
```

## 🔧 Использование типов

### Импорт типов
```typescript
// Импорт всех типов
import {
  CropType,
  ContainerStatus,
  TrayStatus,
  PlannedAction
} from '@/types/farming';

// Импорт UI типов
import {
  UIToastMessage,
  BreadcrumbItem
} from '@/types';
```

### Примеры использования
```typescript
// Использование в компонентах
const [container, setContainer] = useState<ContainerStatus | null>(null);
const [crops, setCrops] = useState<CropType[]>([]);
const [changes, setChanges] = useState<ChangesDraft>({
  selectedItems: { rows: [], racks: [], trays: [] },
  plannedActions: []
});

// Типизация пропсов
interface ComponentProps {
  container: ContainerStatus;
  onTraySelect: (tray: TrayStatus) => void;
  breadcrumbs?: BreadcrumbItem[];
}
```

## 📊 Статистика типов

- **Всего интерфейсов**: 15 основных типов
- **Основные типы**: 11 в `farming.ts`
- **UI типы**: 5 в `index.ts`
- **Строк кода**: 104 строки в `farming.ts`
- **Union типы**: Статусы, стадии роста, типы действий
- **Опциональные поля**: Гибкость для разных состояний

## 🎯 Ключевые концепции

### Иерархия данных
**Container** (1) → **Row** (4) → **Rack** (10) → **Tray** (10) = **400 лотков**

### Статусы элементов
- **Tray**: empty, planned, growing, ready, harvested, error
- **Rack**: empty, partial, full
- **Action**: plant, harvest, clear, stop_growing

### Совместимость культур
Проверяется по пересечению климатических требований (температура, влажность, CO2, освещение)