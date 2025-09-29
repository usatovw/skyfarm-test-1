// Application constants

export const APP_CONFIG = {
  NAME: 'SkyFarm Management System',
  VERSION: '1.0.0',
  DESCRIPTION: 'Система управления автоматизированной фермой',
} as const;

export const ROUTES = {
  DASHBOARD: '/',
  FARM: '/farm',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
} as const;

export const CONTAINER_LIMITS = {
  MAX_ROWS: 4,
  MAX_RACKS_PER_ROW: 10,
  MAX_TRAYS_PER_RACK: 10,
} as const;

export const TRAY_STATUSES = {
  EMPTY: 'empty',
  PLANNED: 'planned',
  GROWING: 'growing',
  READY: 'ready',
  HARVESTED: 'harvested',
  ERROR: 'error',
} as const;

export const RACK_STATUSES = {
  EMPTY: 'empty',
  PARTIAL: 'partial',
  FULL: 'full',
} as const;

export const GROWTH_STAGES = {
  GERMINATION: 'germination',
  SEEDLING: 'seedling',
  VEGETATION: 'vegetation',
  HARVEST: 'harvest',
} as const;

export const CLIMATE_DEFAULTS = {
  TEMPERATURE: { MIN: 15, MAX: 30 },
  HUMIDITY: { MIN: 40, MAX: 80 },
  CO2: { MIN: 400, MAX: 1500 },
  LIGHTING: { MIN: 100, MAX: 500 },
} as const;

export const TIME_RANGES = [
  { label: '7 дней', value: '7d', days: 7 },
  { label: '1 месяц', value: '1m', days: 30 },
  { label: '3 месяца', value: '3m', days: 90 },
  { label: '6 месяцев', value: '6m', days: 180 },
] as const;