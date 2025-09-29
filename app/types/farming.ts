// Типы данных для системы управления фермой

export interface CropType {
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

export interface GrowthStage {
  id: string;
  name: string;
  duration: number; // дни
  description: string;
  icon: string;
}

export interface TrayStatus {
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

export interface RackStatus {
  id: string;
  rowId: string;
  position: number; // 1-10 позиция в ряду
  trays: TrayStatus[];
  totalTrays: number;
  occupiedTrays: number;
  status: 'empty' | 'partial' | 'full';
}

export interface RowStatus {
  id: string;
  name: string; // A, B, C, D
  racks: RackStatus[];
  totalTrays: number;
  occupiedTrays: number;
}

export interface ContainerStatus {
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
  type: 'plant' | 'harvest' | 'clear' | 'stop_growing';
  targetType: 'row' | 'rack' | 'tray';
  targetIds: string[];
  cropId?: string;
  scheduledDate?: Date;
  forceStop?: boolean; // для принудительной остановки
}

export interface SelectionState {
  selectedRows: Set<string>;
  selectedRacks: Set<string>;
  selectedTrays: Set<string>;
  mode: 'none' | 'selecting' | 'contextMenu';
}

export interface ViewMode {
  current: 'overview' | 'rack-detail' | 'tray-detail';
  selectedRackId?: string;
  selectedTrayId?: string;
}