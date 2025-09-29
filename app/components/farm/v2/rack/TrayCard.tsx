'use client';

import { Tray, TrayStatus } from '@/types/farming';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useLongPress } from '../hooks/useLongPress';

interface TrayCardProps {
  tray: Tray;
  isSelected: boolean;
  onClick: () => void;
  onLongPress?: (e: React.MouseEvent | React.TouchEvent) => void;
  mode?: 'single' | 'multi';
}

const STATUS_COLORS: Record<TrayStatus, string> = {
  empty: 'bg-gray-100 border-gray-300',
  planned: 'bg-blue-200 border-blue-400',
  growing: 'bg-green-300 border-green-500',
  ready: 'bg-emerald-400 border-emerald-600',
  harvested: 'bg-yellow-300 border-yellow-500',
  stop_pending: 'bg-orange-300 border-orange-500',
  problem: 'bg-red-300 border-red-500'
};

const STATUS_LABELS: Record<TrayStatus, string> = {
  empty: 'Пусто',
  planned: 'Размещено',
  growing: 'Растет',
  ready: 'Готово',
  harvested: 'Собрано',
  stop_pending: 'На прекращение',
  problem: 'Проблема'
};

export function TrayCard({ tray, isSelected, onClick, onLongPress, mode = 'single' }: TrayCardProps) {
  const longPressHandlers = onLongPress
    ? useLongPress({
        onShortPress: onClick,
        onLongPress: onLongPress,
        delay: 500
      })
    : {};

  return (
    <Card
      {...(onLongPress ? longPressHandlers : { onClick })}
      className={cn(
        'p-4 cursor-pointer transition-all hover:scale-102',
        STATUS_COLORS[tray.status],
        isSelected && 'ring-4 ring-primary'
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="font-bold">Поддон {tray.position}</div>
          <div className="text-sm">{STATUS_LABELS[tray.status]}</div>
        </div>
        {tray.crop && (
          <div className="text-xl">
            {tray.crop.cropId === 'arugula' && '🌿'}
            {tray.crop.cropId === 'lollo_rossa' && '🥬'}
            {tray.crop.cropId === 'romano' && '🥬'}
            {tray.crop.cropId === 'endive' && '🥬'}
          </div>
        )}
      </div>
    </Card>
  );
}