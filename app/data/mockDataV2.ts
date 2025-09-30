import { Container, Row, Rack, Tray, TrayStatus, ContainerStats } from '@/types/farming';
import { crops } from './cropsData';

// Генерация поддонов (7 штук на стойку) - СТАТИЧЕСКИЕ ДАННЫЕ для устранения hydration error
function generateTrays(rackId: string): Tray[] {
  const trays: Tray[] = [];

  // Предопределенный паттерн для каждой позиции стойки (основанный на позиции стойки и поддона)
  const rackNumber = parseInt(rackId.split('_')[2]) || 1;

  for (let i = 1; i <= 7; i++) {
    // Используем детерминированную логику вместо Math.random()
    const seed = rackNumber * 7 + i;
    let status: TrayStatus = 'empty';
    let crop = undefined;

    // Детерминированная заполненность (~70%)
    if (seed % 10 >= 3) {
      const statusSeed = seed % 100;
      if (statusSeed < 10) status = 'planned';
      else if (statusSeed < 70) status = 'growing';
      else if (statusSeed < 85) status = 'ready';
      else if (statusSeed < 95) status = 'harvested';
      else status = 'stop_pending';

      const cropIndex = seed % crops.length;
      const selectedCrop = crops[cropIndex];
      const daysGrowing = seed % selectedCrop.totalGrowthDays;

      crop = {
        cropId: selectedCrop.id,
        plantedDate: new Date(Date.now() - daysGrowing * 24 * 60 * 60 * 1000),
        currentStage: 'vegetation',
        daysInStage: daysGrowing % 10,
        totalDaysGrowing: daysGrowing,
        estimatedHarvestDate: new Date(Date.now() + (selectedCrop.totalGrowthDays - daysGrowing) * 24 * 60 * 60 * 1000),
        stageProgress: (daysGrowing / selectedCrop.totalGrowthDays) * 100
      };
    }

    trays.push({
      id: `${rackId}_tray_${i}`,
      rackId,
      position: i,
      status,
      crop
    });
  }

  return trays;
}

// Генерация стоек (6 штук на ряд)
function generateRacks(rowId: string): Rack[] {
  const racks: Rack[] = [];

  for (let i = 1; i <= 6; i++) {
    const rackId = `${rowId}_rack_${i}`;
    const trays = generateTrays(rackId);
    const occupiedTrays = trays.filter(t => t.status !== 'empty').length;
    const hasProblems = trays.some(t => t.status === 'problem');
    const hasReadyToHarvest = trays.some(t => t.status === 'ready');

    let status: 'empty' | 'partial' | 'full' = 'empty';
    if (occupiedTrays === 7) status = 'full';
    else if (occupiedTrays > 0) status = 'partial';

    racks.push({
      id: rackId,
      rowId,
      position: i,
      trays,
      totalTrays: 7,
      occupiedTrays,
      status,
      hasProblems,
      hasReadyToHarvest
    });
  }

  return racks;
}

// Генерация рядов (2 ряда: A и B)
function generateRows(): Row[] {
  return (['A', 'B'] as const).map(name => {
    const rowId = `row_${name}`;
    const racks = generateRacks(rowId);
    const totalTrays = racks.reduce((sum, r) => sum + r.totalTrays, 0);
    const occupiedTrays = racks.reduce((sum, r) => sum + r.occupiedTrays, 0);

    return {
      id: rowId,
      name,
      racks,
      totalTrays,
      occupiedTrays
    };
  });
}

// Расчет статистики
export function calculateStats(rows: Row[]): ContainerStats {
  let totalTrays = 0;
  let empty = 0;
  let planned = 0;
  let growing = 0;
  let ready = 0;
  let harvested = 0;
  let stopPending = 0;
  let problems = 0;

  rows.forEach(row => {
    row.racks.forEach(rack => {
      rack.trays.forEach(tray => {
        totalTrays++;
        switch (tray.status) {
          case 'empty': empty++; break;
          case 'planned': planned++; break;
          case 'growing': growing++; break;
          case 'ready': ready++; break;
          case 'harvested': harvested++; break;
          case 'stop_pending': stopPending++; break;
          case 'problem': problems++; break;
        }
      });
    });
  });

  const occupied = totalTrays - empty;
  const occupiedPercent = (occupied / totalTrays) * 100;
  const plannedPercent = (planned / totalTrays) * 100;
  const plannedPercentOfOccupied = occupied > 0 ? (planned / occupied) * 100 : 0;
  const growingPercent = (growing / totalTrays) * 100;
  const growingPercentOfOccupied = occupied > 0 ? (growing / occupied) * 100 : 0;
  const readyPercent = (ready / totalTrays) * 100;
  const readyPercentOfOccupied = occupied > 0 ? (ready / occupied) * 100 : 0;
  const harvestedPercent = (harvested / totalTrays) * 100;
  const freePercent = (empty / totalTrays) * 100;

  return {
    totalTrays,
    occupied,
    occupiedPercent,
    planned,
    plannedPercent,
    plannedPercentOfOccupied,
    growing,
    growingPercent,
    growingPercentOfOccupied,
    ready,
    readyPercent,
    readyPercentOfOccupied,
    harvested,
    harvestedPercent,
    stopPending,
    problems,
    free: empty,
    freePercent
  };
}

// Главный объект контейнера
const rows = generateRows();

export const containerV2: Container = {
  id: 'container_41_i2f',
  name: 'Контейнер № 41-i2f',
  rows,
  currentClimate: {
    temperature: 21,
    humidity: 72,
    co2: 1050,
    lighting: 400,
    ph: 6.1,
    ec: 1050
  },
  stats: calculateStats(rows)
};