import { CropType } from '@/types/farming';

/**
 * Данные культур из Excel файла "Культуры.xlsx"
 * Параметры взяты из реальной таблицы выращивания
 */

export const crops: CropType[] = [
  {
    id: 'arugula',
    name: 'Руккола',
    icon: '🌿',
    image: '/images/crops/arugula.svg',
    color: '#16A34A',
    climateRequirements: {
      temperature: { min: 20, max: 22 },
      humidity: { min: 70, max: 75 },
      co2: { min: 800, max: 1200 },
      lighting: { min: 200, max: 400 },
      ph: { min: 5.8, max: 6.5 },
      ec: { min: 900, max: 1400 }
    },
    growthStages: [
      {
        id: 'germination',
        name: 'Проростки',
        duration: 4, // 3-5 дней (среднее 4)
        description: 'Прорастание семян',
        icon: '🌱',
        parameters: {
          ph: { min: 5.8, max: 6.2 },
          ec: { min: 900, max: 1200 },
          temperature: { min: 20, max: 22 },
          humidity: { min: 70, max: 75 }
        }
      },
      {
        id: 'vegetation',
        name: 'Вегетация',
        duration: 12, // 10-15 дней (среднее 12)
        description: 'Активный рост листьев',
        icon: '🌿',
        parameters: {
          ph: { min: 6.0, max: 6.5 },
          ec: { min: 900, max: 1200 },
          temperature: { min: 20, max: 22 },
          humidity: { min: 70, max: 75 }
        }
      },
      {
        id: 'maturation',
        name: 'Созревание',
        duration: 8, // 7-10 дней (среднее 8)
        description: 'Подготовка к сбору урожая',
        icon: '🍃',
        parameters: {
          ph: { min: 6.0, max: 6.5 },
          ec: { min: 1300, max: 1400 },
          temperature: { min: 20, max: 22 },
          humidity: { min: 70, max: 75 }
        }
      }
    ],
    totalGrowthDays: 24 // 4 + 12 + 8
  },
  {
    id: 'lollo_rossa',
    name: 'Лолло Росса',
    icon: '🥬',
    image: '/images/crops/lollo_rossa.svg',
    color: '#DC2626',
    climateRequirements: {
      temperature: { min: 20, max: 22 },
      humidity: { min: 70, max: 75 },
      co2: { min: 800, max: 1200 },
      lighting: { min: 200, max: 400 },
      ph: { min: 5.8, max: 6.3 },
      ec: { min: 900, max: 1400 }
    },
    growthStages: [
      {
        id: 'germination',
        name: 'Проростки',
        duration: 5, // 4-6 дней
        description: 'Прорастание семян',
        icon: '🌱',
        parameters: {
          ph: { min: 5.8, max: 6.2 },
          ec: { min: 900, max: 1200 },
          temperature: { min: 20, max: 22 },
          humidity: { min: 70, max: 75 }
        }
      },
      {
        id: 'vegetation',
        name: 'Вегетация',
        duration: 17, // 15-20 дней
        description: 'Формирование листьев',
        icon: '🌿',
        parameters: {
          ph: { min: 5.8, max: 6.3 },
          ec: { min: 900, max: 1400 },
          temperature: { min: 20, max: 22 },
          humidity: { min: 70, max: 75 }
        }
      },
      {
        id: 'maturation',
        name: 'Созревание',
        duration: 8, // 7-10 дней
        description: 'Окончательное созревание',
        icon: '🍃',
        parameters: {
          ph: { min: 6.0, max: 6.3 },
          ec: { min: 1300, max: 1400 },
          temperature: { min: 20, max: 22 },
          humidity: { min: 70, max: 75 }
        }
      }
    ],
    totalGrowthDays: 30 // 5 + 17 + 8
  },
  {
    id: 'romano',
    name: 'Романо',
    icon: '🥬',
    image: '/images/crops/romano.svg',
    color: '#059669',
    climateRequirements: {
      temperature: { min: 20, max: 22 },
      humidity: { min: 70, max: 75 },
      co2: { min: 800, max: 1200 },
      lighting: { min: 200, max: 400 },
      ph: { min: 5.8, max: 6.5 },
      ec: { min: 900, max: 1400 }
    },
    growthStages: [
      {
        id: 'germination',
        name: 'Проростки',
        duration: 6, // 5-7 дней
        description: 'Прорастание семян',
        icon: '🌱',
        parameters: {
          ph: { min: 5.8, max: 6.3 },
          ec: { min: 900, max: 1200 },
          temperature: { min: 20, max: 22 },
          humidity: { min: 70, max: 75 }
        }
      },
      {
        id: 'vegetation',
        name: 'Вегетация',
        duration: 22, // 20-25 дней
        description: 'Активный рост',
        icon: '🌿',
        parameters: {
          ph: { min: 5.8, max: 6.4 },
          ec: { min: 900, max: 1400 },
          temperature: { min: 20, max: 22 },
          humidity: { min: 70, max: 75 }
        }
      },
      {
        id: 'maturation',
        name: 'Созревание',
        duration: 12, // 10-14 дней
        description: 'Подготовка к сбору',
        icon: '🍃',
        parameters: {
          ph: { min: 6.0, max: 6.5 },
          ec: { min: 1300, max: 1400 },
          temperature: { min: 20, max: 22 },
          humidity: { min: 70, max: 75 }
        }
      }
    ],
    totalGrowthDays: 40 // 6 + 22 + 12
  },
  {
    id: 'endive',
    name: 'Эндивий',
    icon: '🥬',
    image: '/images/crops/endive.svg',
    color: '#10B981',
    climateRequirements: {
      temperature: { min: 20, max: 22 },
      humidity: { min: 70, max: 75 },
      co2: { min: 800, max: 1200 },
      lighting: { min: 200, max: 400 },
      ph: { min: 5.8, max: 6.5 },
      ec: { min: 900, max: 1400 }
    },
    growthStages: [
      {
        id: 'germination',
        name: 'Проростки',
        duration: 5, // 4-6 дней
        description: 'Прорастание семян',
        icon: '🌱',
        parameters: {
          ph: { min: 5.8, max: 6.3 },
          ec: { min: 900, max: 1200 },
          temperature: { min: 20, max: 22 },
          humidity: { min: 70, max: 75 }
        }
      },
      {
        id: 'vegetation',
        name: 'Вегетация',
        duration: 17, // 15-20 дней
        description: 'Формирование листьев',
        icon: '🌿',
        parameters: {
          ph: { min: 5.9, max: 6.4 },
          ec: { min: 900, max: 1400 },
          temperature: { min: 20, max: 22 },
          humidity: { min: 70, max: 75 }
        }
      },
      {
        id: 'maturation',
        name: 'Созревание',
        duration: 12, // 10-14 дней
        description: 'Окончательное созревание',
        icon: '🍃',
        parameters: {
          ph: { min: 6.0, max: 6.5 },
          ec: { min: 1300, max: 1400 },
          temperature: { min: 20, max: 22 },
          humidity: { min: 70, max: 75 }
        }
      }
    ],
    totalGrowthDays: 34 // 5 + 17 + 12
  },
  {
    id: 'basil',
    name: 'Базилик',
    icon: '🌿',
    image: '/images/crops/basil.svg',
    color: '#7C3AED',
    climateRequirements: {
      temperature: { min: 25, max: 30 }, // Несовместимая температура с другими
      humidity: { min: 50, max: 60 }, // Несовместимая влажность
      co2: { min: 1000, max: 1500 },
      lighting: { min: 300, max: 500 },
      ph: { min: 6.5, max: 7.5 }, // Несовместимый pH
      ec: { min: 1500, max: 2000 } // Несовместимая EC
    },
    growthStages: [
      {
        id: 'germination',
        name: 'Проростки',
        duration: 7, // 5-10 дней
        description: 'Прорастание семян',
        icon: '🌱',
        parameters: {
          ph: { min: 6.5, max: 7.0 },
          ec: { min: 1500, max: 1700 },
          temperature: { min: 25, max: 30 },
          humidity: { min: 50, max: 60 }
        }
      },
      {
        id: 'vegetation',
        name: 'Вегетация',
        duration: 21, // 20-25 дней
        description: 'Активный рост листьев',
        icon: '🌿',
        parameters: {
          ph: { min: 6.5, max: 7.5 },
          ec: { min: 1500, max: 1800 },
          temperature: { min: 25, max: 30 },
          humidity: { min: 50, max: 60 }
        }
      },
      {
        id: 'maturation',
        name: 'Созревание',
        duration: 14, // 12-16 дней
        description: 'Подготовка к сбору урожая',
        icon: '🍃',
        parameters: {
          ph: { min: 6.8, max: 7.5 },
          ec: { min: 1800, max: 2000 },
          temperature: { min: 25, max: 30 },
          humidity: { min: 50, max: 60 }
        }
      }
    ],
    totalGrowthDays: 42 // 7 + 21 + 14
  }
];

/**
 * Проверка совместимости двух культур по климатическим параметрам
 * Культуры совместимы если есть пересечение во ВСЕХ параметрах
 */
export function checkCropCompatibility(
  crop1: CropType,
  crop2: CropType
): { compatible: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // Проверяем пересечение температуры
  const tempOverlap = Math.max(
    0,
    Math.min(crop1.climateRequirements.temperature.max, crop2.climateRequirements.temperature.max) -
      Math.max(crop1.climateRequirements.temperature.min, crop2.climateRequirements.temperature.min)
  );
  if (tempOverlap <= 0) {
    reasons.push(
      `Несовместимые температуры: ${crop1.name} (${crop1.climateRequirements.temperature.min}-${crop1.climateRequirements.temperature.max}°C) и ${crop2.name} (${crop2.climateRequirements.temperature.min}-${crop2.climateRequirements.temperature.max}°C)`
    );
  }

  // Проверяем пересечение влажности
  const humidityOverlap = Math.max(
    0,
    Math.min(crop1.climateRequirements.humidity.max, crop2.climateRequirements.humidity.max) -
      Math.max(crop1.climateRequirements.humidity.min, crop2.climateRequirements.humidity.min)
  );
  if (humidityOverlap <= 0) {
    reasons.push(
      `Несовместимая влажность: ${crop1.name} (${crop1.climateRequirements.humidity.min}-${crop1.climateRequirements.humidity.max}%) и ${crop2.name} (${crop2.climateRequirements.humidity.min}-${crop2.climateRequirements.humidity.max}%)`
    );
  }

  // Проверяем пересечение pH
  const phOverlap = Math.max(
    0,
    Math.min(crop1.climateRequirements.ph.max, crop2.climateRequirements.ph.max) -
      Math.max(crop1.climateRequirements.ph.min, crop2.climateRequirements.ph.min)
  );
  if (phOverlap < 0.1) {
    reasons.push(
      `Несовместимый pH: ${crop1.name} (${crop1.climateRequirements.ph.min}-${crop1.climateRequirements.ph.max}) и ${crop2.name} (${crop2.climateRequirements.ph.min}-${crop2.climateRequirements.ph.max})`
    );
  }

  // Проверяем пересечение EC
  const ecOverlap = Math.max(
    0,
    Math.min(crop1.climateRequirements.ec.max, crop2.climateRequirements.ec.max) -
      Math.max(crop1.climateRequirements.ec.min, crop2.climateRequirements.ec.min)
  );
  if (ecOverlap < 50) {
    reasons.push(
      `Несовместимая EC: ${crop1.name} (${crop1.climateRequirements.ec.min}-${crop1.climateRequirements.ec.max} µS/см) и ${crop2.name} (${crop2.climateRequirements.ec.min}-${crop2.climateRequirements.ec.max} µS/см)`
    );
  }

  const compatible = reasons.length === 0;

  return { compatible, reasons };
}

/**
 * Получить культуры, совместимые с указанной
 */
export function getCompatibleCrops(baseCropId: string): CropType[] {
  const baseCrop = crops.find((c) => c.id === baseCropId);
  if (!baseCrop) return [];

  return crops.filter((crop) => {
    if (crop.id === baseCropId) return true;
    const check = checkCropCompatibility(baseCrop, crop);
    return check.compatible;
  });
}

/**
 * Получить культуры, доступные для посадки в контейнере
 * Учитывает уже растущие культуры
 */
export function getAvailableCropsForContainer(existingCropIds: string[]): {
  available: CropType[];
  blocked: { crop: CropType; reasons: string[] }[];
} {
  // Если контейнер пуст, доступны все культуры
  if (existingCropIds.length === 0) {
    return {
      available: crops,
      blocked: []
    };
  }

  const existingCrops = crops.filter((c) => existingCropIds.includes(c.id));

  const available: CropType[] = [];
  const blocked: { crop: CropType; reasons: string[] }[] = [];

  crops.forEach((crop) => {
    // Если культура уже растет, она доступна
    if (existingCropIds.includes(crop.id)) {
      available.push(crop);
      return;
    }

    // Проверяем совместимость со ВСЕМИ существующими культурами
    let compatible = true;
    const allReasons: string[] = [];

    for (const existingCrop of existingCrops) {
      const check = checkCropCompatibility(crop, existingCrop);
      if (!check.compatible) {
        compatible = false;
        allReasons.push(...check.reasons);
      }
    }

    if (compatible) {
      available.push(crop);
    } else {
      blocked.push({ crop, reasons: allReasons });
    }
  });

  return { available, blocked };
}

/**
 * Получить культуру по ID
 */
export function getCropById(cropId: string): CropType | undefined {
  return crops.find((c) => c.id === cropId);
}

/**
 * Получить текущую стадию роста по количеству дней
 */
export function getCurrentGrowthStage(
  crop: CropType,
  daysGrowing: number
): { stage: typeof crop.growthStages[0]; stageIndex: number; daysInStage: number; progress: number } | null {
  let accumulatedDays = 0;

  for (let i = 0; i < crop.growthStages.length; i++) {
    const stage = crop.growthStages[i];
    const stageEnd = accumulatedDays + stage.duration;

    if (daysGrowing < stageEnd) {
      const daysInStage = daysGrowing - accumulatedDays;
      const progress = (daysInStage / stage.duration) * 100;

      return {
        stage,
        stageIndex: i,
        daysInStage,
        progress
      };
    }

    accumulatedDays = stageEnd;
  }

  // Если превышено время роста, возвращаем последнюю стадию
  const lastStage = crop.growthStages[crop.growthStages.length - 1];
  return {
    stage: lastStage,
    stageIndex: crop.growthStages.length - 1,
    daysInStage: lastStage.duration,
    progress: 100
  };
}