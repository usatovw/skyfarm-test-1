// Типы данных для системы управления фермой

// ============= КУЛЬТУРЫ =============

export interface CropType {
  id: string;
  name: string;
  icon: string;
  color: string;
  image?: string;
  climateRequirements: {
    temperature: { min: number; max: number };
    humidity: { min: number; max: number };
    co2: { min: number; max: number };
    lighting: { min: number; max: number };
    ph: { min: number; max: number };
    ec: { min: number; max: number };
  };
  growthStages: GrowthStage[];
  totalGrowthDays: number;
}

export interface GrowthStage {
  id: string;
  name: string;
  duration: number; // дни
  description: string;
  icon: string;
  parameters?: {
    ph: { min: number; max: number };
    ec: { min: number; max: number };
    temperature: { min: number; max: number };
    humidity: { min: number; max: number };
  };
}

// ============= ПРОБЛЕМЫ =============

export interface Problem {
  id: string;
  type: 'climate' | 'nutrition' | 'disease' | 'equipment' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedAt: Date;
  resolvedAt?: Date;
}

// ============= СТАТУСЫ =============

// Статусы поддонов (8 основных состояний)
export type TrayStatus =
  | 'empty'           // Пустой
  | 'planned'         // Запланирован (черновик)
  | 'growing'         // Растет
  | 'ready'           // Готов к сбору
  | 'harvested'       // Собран, требует очистки
  | 'stop_pending'    // Помечен на прекращение выращивания
  | 'problem';        // Проблема/ошибка

// UI состояния (для отображения)
export type TrayUIState = TrayStatus | 'no_data' | 'mixed_selection';

// Статусы стоек
export type RackStatusType = 'empty' | 'partial' | 'full';

// ============= СТРУКТУРА КОНТЕЙНЕРА =============

export interface Tray {
  id: string;
  rackId: string;
  position: number; // 1-7 позиция в стойке (вертикально снизу вверх)
  status: TrayStatus;
  crop?: {
    cropId: string;
    plantedDate: Date;
    currentStage: string;           // germination, seedling, vegetation, harvest
    daysInStage: number;            // Дней в текущей стадии
    totalDaysGrowing: number;       // Общее количество дней роста
    estimatedHarvestDate: Date;     // Планируемая дата сбора
    actualHarvestDate?: Date;       // Фактическая дата сбора
    stageProgress: number;          // Прогресс стадии 0-100%
    problems?: Problem[];           // Проблемы
  };
}

export interface Rack {
  id: string;
  rowId: string;
  position: number; // 1-6 позиция в ряду
  trays: Tray[];    // 7 поддонов
  totalTrays: number;
  occupiedTrays: number;
  status: RackStatusType;
  hasProblems: boolean;
  hasReadyToHarvest: boolean;
}

export interface Row {
  id: string;
  name: 'A' | 'B';  // Только 2 ряда
  racks: Rack[];    // 6 стоек
  totalTrays: number;
  occupiedTrays: number;
}

export interface ClimateData {
  temperature: number;
  humidity: number;
  co2: number;
  lighting: number;
  ph?: number;
  ec?: number;
}

export interface ContainerStats {
  totalTrays: number;           // 84 (2×6×7)
  occupied: number;             // Занято (не empty)
  occupiedPercent: number;      // %
  planned: number;              // Размещено (planned)
  plannedPercent: number;       // % от total
  plannedPercentOfOccupied: number; // % от occupied
  growing: number;              // Растет (growing)
  growingPercent: number;       // % от total
  growingPercentOfOccupied: number; // % от occupied
  ready: number;                // Готово (ready)
  readyPercent: number;         // % от total
  readyPercentOfOccupied: number; // % от occupied
  harvested: number;            // Собрано (harvested)
  harvestedPercent: number;     // % от total
  stopPending: number;          // На прекращение (stop_pending)
  problems: number;             // С проблемами (problem)
  free: number;                 // Свободно (empty)
  freePercent: number;          // % от total
}

export interface Container {
  id: string;
  name: string;
  rows: Row[];              // 2 ряда (A, B)
  currentClimate: ClimateData;
  stats: ContainerStats;
  activeMode?: {
    cropId: string;
    parameters: any;
  };
}

// ============= СИСТЕМА ЧЕРНОВИКОВ =============

export interface DraftAction {
  id: string;
  type: 'plant' | 'harvest' | 'clear' | 'stop_growing' | 'cancel_stop';
  targetType: 'row' | 'rack' | 'tray';
  targetIds: string[];
  cropId?: string;
  createdAt: Date;
  affectedTrays: string[];  // Список ID поддонов, которые будут затронуты
  description?: string;
}

export interface DraftState {
  actions: DraftAction[];
  selectedItems: {
    rows: Set<string>;
    racks: Set<string>;
    trays: Set<string>;
  };
  mode: 'single' | 'multi'; // Режим выбора
}

export interface ApplyDraftResult {
  success: boolean;
  appliedActions: DraftAction[];
  failedActions: { action: DraftAction; reason: string }[];
  updatedTrays: Tray[];
}

// ============= СОСТОЯНИЕ ВЫБОРА =============

export interface SelectionState {
  selectedRows: Set<string>;
  selectedRacks: Set<string>;
  selectedTrays: Set<string>;
  mode: 'single' | 'multi';
  contextMenuOpen: boolean;
  contextMenuPosition?: { x: number; y: number };
  contextMenuTarget?: { type: 'row' | 'rack' | 'tray'; id: string };
}

// ============= РЕЖИМЫ ПРОСМОТРА =============

export type ViewType = 'container' | 'rack' | 'tray';

export interface ViewState {
  current: ViewType;
  selectedRackId?: string;
  selectedTrayId?: string;
  breadcrumbs: { label: string; view: ViewType; id?: string }[];
}

// ============= КОНТЕКСТНОЕ МЕНЮ =============

export interface ContextMenuItem {
  id: string;
  label: string;
  icon: string;
  disabled: boolean;
  disabledReason?: string;
  action: () => void;
}

// ============= СОВМЕСТИМОСТЬ =============

export interface CompatibilityCheck {
  compatible: boolean;
  reasons?: string[];
  overlaps?: {
    temperature: number;
    humidity: number;
    ph: number;
    ec: number;
  };
}

// ============= LEGACY (для совместимости со старым кодом) =============

export interface LegacyTray {
  id: string;
  rackId: string;
  position: number;
  status: 'empty' | 'planned' | 'growing' | 'ready' | 'harvested' | 'stop_pending' | 'error';
  crop?: {
    cropId: string;
    plantedDate?: Date;
    currentStage?: string;
    daysInStage?: number;
    harvestDate?: Date;
  };
}

export interface LegacyRack {
  id: string;
  rowId: string;
  position: number;
  trays: LegacyTray[];
  totalTrays: number;
  occupiedTrays: number;
  status: 'empty' | 'partial' | 'full';
}

export interface LegacyRow {
  id: string;
  name: string;
  racks: LegacyRack[];
  totalTrays: number;
  occupiedTrays: number;
}

export interface ContainerStatus {
  id: string;
  name: string;
  rows: LegacyRow[];
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

export interface ChangesDraft {
  selectedItems: {
    rows: string[];
    racks: string[];
    trays: string[];
  };
  plannedActions: PlannedAction[];
}

export interface PlannedAction {
  id: string;
  type: 'plant' | 'harvest' | 'clear' | 'stop_growing' | 'cancel_stop';
  targetType: 'row' | 'rack' | 'tray';
  targetIds: string[];
  cropId?: string;
  scheduledDate?: Date;
  forceStop?: boolean;
}

export interface ViewMode {
  current: 'overview' | 'rack-detail' | 'tray-detail';
  selectedRackId?: string;
  selectedTrayId?: string;
}