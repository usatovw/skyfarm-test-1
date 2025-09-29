# 🗄️ Data Documentation

Документация системы данных и mock API для проекта SkyFarm.

## 📁 Структура данных

```
data/
└── mockData.ts         # Моковые данные фермы (259 строк)
```

## 📊 Основной файл: mockData.ts (259 строк)

### 🌱 Данные культур

#### mockCrops: CropType[] (4 вида культур)

```typescript
export const mockCrops: CropType[] = [
  {
    id: 'basil',
    name: 'Базилик',
    icon: '🌿',
    color: '#22C55E',
    totalGrowthDays: 72,        // Самый долгий
    climateRequirements: {
      temperature: { min: 20, max: 25 },
      humidity: { min: 60, max: 70 },
      co2: { min: 800, max: 1200 },
      lighting: { min: 200, max: 400 }
    },
    growthStages: [
      { id: 'germination', name: 'Проращивание', duration: 7, ... },
      { id: 'seedling', name: 'Рассада', duration: 14, ... },
      { id: 'vegetation', name: 'Вегетация', duration: 21, ... },
      { id: 'harvest', name: 'Сбор урожая', duration: 30, ... }
    ]
  },
  // lettuce (45 дней), spinach (45 дней), arugula (35 дней)
];
```

### 🏗️ Структура контейнера

#### mockContainerData: ContainerStatus

```typescript
export const mockContainerData: ContainerStatus = {
  id: 'container_41_i2f',
  name: 'Контейнер № 41-i2f',
  rows: generateMockRows(),      // 4 ряда (A, B, C, D)
  currentClimate: {
    temperature: 22.5,
    humidity: 65,
    co2: 950,
    lighting: 250
  },
  activeMode: {
    cropId: 'basil',
    parameters: { ... }
  }
};
```

### Математика структуры:
- **4 ряда** (A, B, C, D)
- **10 стоек** в каждом ряду
- **10 лотков** в каждой стойке
- **Итого**: 4 × 10 × 10 = **400 лотков**

## 🔧 Функции генерации данных

### generateMockTrays(rackId: string): TrayStatus[]
**Назначение**: Генерация 10 лотков для одной стойки
**Алгоритм**:
- 70% заполненность (случайная)
- Случайный выбор культур из ['basil', 'lettuce', 'spinach']
- Случайная дата посадки (до 30 дней назад)
- Автоматический расчет даты сбора урожая

```typescript
function generateMockTrays(rackId: string): TrayStatus[] {
  const trays: TrayStatus[] = [];

  for (let i = 1; i <= 10; i++) {
    const random = Math.random();
    let status: TrayStatus['status'] = 'empty';
    let crop = undefined;

    if (random > 0.3) { // 70% заполненности
      status = 'growing';
      const selectedCrop = cropTypes[Math.floor(Math.random() * cropTypes.length)];
      const plantedDaysAgo = Math.floor(Math.random() * 30);

      crop = {
        cropId: selectedCrop,
        plantedDate: new Date(Date.now() - plantedDaysAgo * 24 * 60 * 60 * 1000),
        currentStage: 'seedling',
        daysInStage: plantedDaysAgo % 14,
        harvestDate: new Date(Date.now() + (45 - plantedDaysAgo) * 24 * 60 * 60 * 1000)
      };
    }
    // ... создание лотка
  }
  return trays;
}
```

### generateMockRacks(rowId: string): RackStatus[]
**Назначение**: Генерация 10 стоек для одного ряда
**Логика статусов**:
- `full`: occupiedTrays === 10
- `partial`: occupiedTrays > 0 && < 10
- `empty`: occupiedTrays === 0

### generateMockRows(): RowStatus[]
**Назначение**: Генерация 4 рядов (A, B, C, D)
**Подсчет статистики**:
- totalTrays = сумма лотков во всех стойках ряда
- occupiedTrays = сумма занятых лотков

## 🧠 Функции совместимости культур

### checkCropCompatibility(crop1Id, crop2Id): boolean
**Назначение**: Проверка климатической совместимости двух культур
**Алгоритм**:
1. Находим пересечение диапазонов температуры
2. Находим пересечение диапазонов влажности
3. Находим пересечение диапазонов CO2
4. Культуры совместимы, если есть пересечения во ВСЕХ параметрах

```typescript
export function checkCropCompatibility(crop1Id: string, crop2Id: string): boolean {
  const crop1 = mockCrops.find(c => c.id === crop1Id);
  const crop2 = mockCrops.find(c => c.id === crop2Id);

  if (!crop1 || !crop2) return false;

  // Проверяем пересечение климатических требований
  const tempOverlap = Math.max(0,
    Math.min(crop1.climateRequirements.temperature.max, crop2.climateRequirements.temperature.max) -
    Math.max(crop1.climateRequirements.temperature.min, crop2.climateRequirements.temperature.min)
  );

  const humidityOverlap = Math.max(0,
    Math.min(crop1.climateRequirements.humidity.max, crop2.climateRequirements.humidity.max) -
    Math.max(crop1.climateRequirements.humidity.min, crop2.climateRequirements.humidity.min)
  );

  const co2Overlap = Math.max(0,
    Math.min(crop1.climateRequirements.co2.max, crop2.climateRequirements.co2.max) -
    Math.max(crop1.climateRequirements.co2.min, crop2.climateRequirements.co2.min)
  );

  // Культуры совместимы если есть пересечения во всех параметрах
  return tempOverlap > 0 && humidityOverlap > 0 && co2Overlap > 0;
}
```

### getCompatibleCrops(baseCropId): CropType[]
**Назначение**: Получение всех культур, совместимых с базовой культурой

### getAvailableCropsForContainer(containerData): CropType[]
**Назначение**: Получение культур, доступных для посадки в контейнере
**Логика**:
1. Если контейнер пустой → доступны все культуры
2. Если есть activeMode → используем его как базу
3. Иначе → пересечение совместимых культур для всех существующих

### getExistingCropsInContainer(containerData): string[]
**Назначение**: Получение списка культур, уже растущих в контейнере

## 📊 Примеры данных

### Климатические требования культур:
```typescript
// Базилик - самые высокие требования
temperature: { min: 20, max: 25 }    // Узкий диапазон
humidity: { min: 60, max: 70 }       // Средняя влажность
co2: { min: 800, max: 1200 }         // Высокий CO2

// Салат - умеренные требования
temperature: { min: 16, max: 22 }    // Более прохладный
humidity: { min: 50, max: 65 }       // Меньше влажности
co2: { min: 600, max: 1000 }         // Меньше CO2

// Шпинат - холодолюбивый
temperature: { min: 15, max: 20 }    // Самый прохладный
humidity: { min: 55, max: 70 }
co2: { min: 700, max: 1100 }

// Руккола - быстрорастущая
temperature: { min: 18, max: 24 }    // Средний диапазон
humidity: { min: 60, max: 75 }       // Высокая влажность
co2: { min: 800, max: 1200 }         // Высокий CO2
```

### Совместимость культур:
- **Базилик ↔ Руккола**: ✅ Совместимы (пересечение: 20-24°C, 60-70%, 800-1200 CO2)
- **Салат ↔ Шпинат**: ✅ Совместимы (пересечение: 16-20°C, 55-65%, 700-1000 CO2)
- **Базилик ↔ Салат**: ❌ Несовместимы (нет пересечения по температуре)

## 🎯 Использование в компонентах

```typescript
// Импорт данных
import {
  mockContainerData,
  mockCrops,
  getAvailableCropsForContainer,
  checkCropCompatibility
} from '@/data/mockData';

// Использование в компонентах
const availableCrops = getAvailableCropsForContainer(containerData);
const isCompatible = checkCropCompatibility('basil', 'lettuce');
```

## 📈 Статистика данных

- **Файлов**: 1 основной файл (260 строк)
- **Культур**: 4 вида с полными характеристиками
- **Контейнеров**: 1 полностью настроенный контейнер
- **Лотков**: 400 позиций (70% заполненность = ~280 растущих растений)
- **Функций**: 6 функций для работы с данными
- **Алгоритмов**: Автоматическая генерация, проверка совместимости