// Export all types
export * from './farming';

// Additional UI types
export interface UIToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export interface NavigationItem {
  id: string;
  title: string;
  icon: string;
  href: string;
  isActive?: boolean;
}

export interface BreadcrumbItem {
  title: string;
  href?: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  timestamp: string;
}

export interface TimeRange {
  label: string;
  value: string;
  days: number;
}