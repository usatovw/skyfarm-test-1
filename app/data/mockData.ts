import { CropType, ContainerStatus, RowStatus, RackStatus, TrayStatus } from '@/types/farming';

// Мок данные культур
export const mockCrops: CropType[] = [
  {
    id: 'basil',
    name: 'Базилик',
    icon: '🌿',
    color: '#22C55E',
    climateRequirements: {
      temperature: { min: 20, max: 25 },
      humidity: { min: 60, max: 70 },
      co2: { min: 800, max: 1200 },
      lighting: { min: 200, max: 400 }
    },
    growthStages: [
      { id: 'germination', name: 'Проращивание', duration: 7, description: 'Прорастание семян', icon: '🌱' },
      { id: 'seedling', name: 'Рассада', duration: 14, description: 'Развитие рассады', icon: '🌿' },
      { id: 'vegetation', name: 'Вегетация', duration: 21, description: 'Активный рост', icon: '🍃' },
      { id: 'harvest', name: 'Сбор урожая', duration: 30, description: 'Готов к сбору', icon: '✂️' }
    ],
    totalGrowthDays: 72
  },
  {
    id: 'lettuce',
    name: 'Салат',
    icon: '🥬',
    color: '#10B981',
    climateRequirements: {
      temperature: { min: 16, max: 22 },
      humidity: { min: 50, max: 65 },
      co2: { min: 600, max: 1000 },
      lighting: { min: 150, max: 300 }
    },
    growthStages: [
      { id: 'germination', name: 'Проращивание', duration: 5, description: 'Прорастание семян', icon: '🌱' },
      { id: 'seedling', name: 'Рассада', duration: 10, description: 'Развитие рассады', icon: '🌿' },
      { id: 'vegetation', name: 'Вегетация', duration: 25, description: 'Формирование листьев', icon: '🥬' },
      { id: 'harvest', name: 'Сбор урожая', duration: 5, description: 'Готов к сбору', icon: '✂️' }
    ],
    totalGrowthDays: 45
  },
  {
    id: 'spinach',
    name: 'Шпинат',
    icon: '🥬',
    color: '#059669',
    climateRequirements: {
      temperature: { min: 15, max: 20 },
      humidity: { min: 55, max: 70 },
      co2: { min: 700, max: 1100 },
      lighting: { min: 180, max: 350 }
    },
    growthStages: [
      { id: 'germination', name: 'Проращивание', duration: 6, description: 'Прорастание семян', icon: '🌱' },
      { id: 'seedling', name: 'Рассада', duration: 12, description: 'Развитие рассады', icon: '🌿' },
      { id: 'vegetation', name: 'Вегетация', duration: 20, description: 'Активный рост', icon: '🍃' },
      { id: 'harvest', name: 'Сбор урожая', duration: 7, description: 'Готов к сбору', icon: '✂️' }
    ],
    totalGrowthDays: 45
  },
  {
    id: 'arugula',
    name: 'Руккола',
    icon: '🌿',
    color: '#16A34A',
    climateRequirements: {
      temperature: { min: 18, max: 24 },
      humidity: { min: 60, max: 75 },
      co2: { min: 800, max: 1200 },
      lighting: { min: 200, max: 400 }
    },
    growthStages: [
      { id: 'germination', name: 'Проращивание', duration: 4, description: 'Прорастание семян', icon: '🌱' },
      { id: 'seedling', name: 'Рассада', duration: 8, description: 'Развитие рассады', icon: '🌿' },
      { id: 'vegetation', name: 'Вегетация', duration: 18, description: 'Активный рост', icon: '🍃' },
      { id: 'harvest', name: 'Сбор урожая', duration: 5, description: 'Готов к сбору', icon: '✂️' }
    ],
    totalGrowthDays: 35
  }
];

// Генерация мок данных для поддонов
function generateMockTrays(rackId: string): TrayStatus[] {
  const trays: TrayStatus[] = [];

  for (let i = 1; i <= 10; i++) {
    const trayId = `${rackId}_tray_${i}`;
    const random = Math.random();

    let status: TrayStatus['status'] = 'empty';
    let crop = undefined;

    if (random > 0.3) { // 70% заполненности
      status = 'growing';
      const cropTypes = ['basil', 'lettuce', 'spinach'];
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

    trays.push({
      id: trayId,
      rackId,
      position: i,
      status,
      crop
    });
  }

  return trays;
}

// Генерация мок данных для стоек
function generateMockRacks(rowId: string): RackStatus[] {
  const racks: RackStatus[] = [];

  for (let i = 1; i <= 10; i++) {
    const rackId = `${rowId}_rack_${i}`;
    const trays = generateMockTrays(rackId);
    const occupiedTrays = trays.filter(t => t.status !== 'empty').length;

    let status: RackStatus['status'] = 'empty';
    if (occupiedTrays === 10) status = 'full';
    else if (occupiedTrays > 0) status = 'partial';

    racks.push({
      id: rackId,
      rowId,
      position: i,
      trays,
      totalTrays: 10,
      occupiedTrays,
      status
    });
  }

  return racks;
}

// Генерация мок данных для рядов
function generateMockRows(): RowStatus[] {
  const rowNames = ['A', 'B', 'C', 'D'];
  return rowNames.map(name => {
    const rowId = `row_${name}`;
    const racks = generateMockRacks(rowId);
    const totalTrays = racks.reduce((sum, rack) => sum + rack.totalTrays, 0);
    const occupiedTrays = racks.reduce((sum, rack) => sum + rack.occupiedTrays, 0);

    return {
      id: rowId,
      name,
      racks,
      totalTrays,
      occupiedTrays
    };
  });
}

// Основные мок данные контейнера
export const mockContainerData: ContainerStatus = {
  id: 'container_41_i2f',
  name: 'Контейнер № 41-i2f',
  rows: generateMockRows(),
  currentClimate: {
    temperature: 22.5,
    humidity: 65,
    co2: 950,
    lighting: 250
  },
  activeMode: {
    cropId: 'basil',
    parameters: {
      temperature: { min: 20, max: 25 },
      humidity: { min: 60, max: 70 }
    }
  }
};

// Функция для проверки совместимости культур
export function checkCropCompatibility(crop1Id: string, crop2Id: string): boolean {
  const crop1 = mockCrops.find(c => c.id === crop1Id);
  const crop2 = mockCrops.find(c => c.id === crop2Id);

  if (!crop1 || !crop2) return false;

  // Проверяем пересечение климатических требований
  const tempOverlap = Math.max(0, Math.min(crop1.climateRequirements.temperature.max, crop2.climateRequirements.temperature.max) -
                              Math.max(crop1.climateRequirements.temperature.min, crop2.climateRequirements.temperature.min));

  const humidityOverlap = Math.max(0, Math.min(crop1.climateRequirements.humidity.max, crop2.climateRequirements.humidity.max) -
                                  Math.max(crop1.climateRequirements.humidity.min, crop2.climateRequirements.humidity.min));

  const co2Overlap = Math.max(0, Math.min(crop1.climateRequirements.co2.max, crop2.climateRequirements.co2.max) -
                             Math.max(crop1.climateRequirements.co2.min, crop2.climateRequirements.co2.min));

  // Культуры совместимы если есть пересечения во всех параметрах
  return tempOverlap > 0 && humidityOverlap > 0 && co2Overlap > 0;
}

// Alias для checkCropCompatibility для удобства использования в других компонентах
export const checkClimateCompatibility = checkCropCompatibility;

// Функция для получения совместимых культур
export function getCompatibleCrops(baseCropId: string): CropType[] {
  return mockCrops.filter(crop =>
    crop.id === baseCropId || checkCropCompatibility(baseCropId, crop.id)
  );
}

// Функция для получения всех культур, уже растущих в контейнере
export function getExistingCropsInContainer(containerData: ContainerStatus): string[] {
  const existingCrops = new Set<string>();

  containerData.rows.forEach(row => {
    row.racks.forEach(rack => {
      rack.trays.forEach(tray => {
        if (tray.crop && (tray.status === 'growing' || tray.status === 'planned')) {
          existingCrops.add(tray.crop.cropId);
        }
      });
    });
  });

  return Array.from(existingCrops);
}

// Функция для получения культур, совместимых с уже растущими в контейнере
export function getAvailableCropsForContainer(containerData: ContainerStatus): CropType[] {
  const existingCrops = getExistingCropsInContainer(containerData);

  // Если в контейнере ничего не растет, доступны все культуры
  if (existingCrops.length === 0) {
    return mockCrops;
  }

  // Если есть активный режим, используем его как базу
  if (containerData.activeMode?.cropId) {
    return getCompatibleCrops(containerData.activeMode.cropId);
  }

  // Иначе найдем пересечение совместимых культур для всех существующих
  let compatibleCrops = mockCrops;

  existingCrops.forEach(existingCropId => {
    const currentCompatible = getCompatibleCrops(existingCropId);
    compatibleCrops = compatibleCrops.filter(crop =>
      currentCompatible.some(cc => cc.id === crop.id)
    );
  });

  return compatibleCrops;
}