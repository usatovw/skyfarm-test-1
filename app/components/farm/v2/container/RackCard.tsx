import { Rack } from '@/types/farming';
import { Card } from '@/components/ui/card';
import { AlertCircle, Leaf } from 'lucide-react';
import { useLongPress } from '../hooks/useLongPress';
import { cn } from '@/lib/utils';
import { crops } from '@/data/cropsData';

interface RackCardProps {
  rack: Rack;
  isSelected: boolean;
  mode: 'single' | 'multi';
  onShortPress: () => void;
  onLongPress: (e: React.MouseEvent | React.TouchEvent) => void;
}

export function RackCard({ rack, isSelected, mode, onShortPress, onLongPress }: RackCardProps) {
  const longPressHandlers = useLongPress({
    onShortPress,
    onLongPress,
    delay: 500
  });

  const getStatusColor = () => {
    if (rack.status === 'full') return 'bg-green-300 border-green-500';
    if (rack.status === 'partial') return 'bg-blue-200 border-blue-400';
    return 'bg-gray-100 border-gray-300';
  };

  const getTrayColor = (status: string) => {
    switch (status) {
      case 'empty': return 'bg-gray-300';
      case 'planned': return 'bg-blue-400';
      case 'growing': return 'bg-green-400';
      case 'ready': return 'bg-emerald-500';
      case 'harvested': return 'bg-yellow-400';
      case 'stop_pending': return 'bg-orange-400';
      case 'problem': return 'bg-red-400';
      default: return 'bg-gray-300';
    }
  };

  return (
    <Card
      {...longPressHandlers}
      className={cn(
        'relative p-4 cursor-pointer transition-all hover:scale-105 min-w-[120px] min-h-[90px]',
        getStatusColor(),
        isSelected && 'ring-4 ring-primary'
      )}
    >
      <div className="text-lg font-bold mb-1">{rack.position}</div>
      <div className="text-sm text-muted-foreground mb-2">{rack.occupiedTrays}/7</div>

      {/* Мини-индикаторы поддонов */}
      <div className="flex gap-1 mt-2 flex-wrap">
        {rack.trays.map((tray) => {
          const crop = tray.crop ? crops.find(c => c.id === tray.crop!.cropId) : null;
          const showIcon = tray.status === 'growing' && crop;

          return (
            <div
              key={tray.id}
              className={cn(
                'flex items-center justify-center rounded-full',
                showIcon ? 'w-4 h-4 text-xs' : 'w-2 h-2',
                getTrayColor(tray.status)
              )}
              title={`Поддон ${tray.position}: ${tray.status}${crop ? ` (${crop.name})` : ''}`}
            >
              {showIcon && (
                <span className="text-xs leading-none">{crop.icon}</span>
              )}
            </div>
          );
        })}
      </div>

      {rack.hasProblems && (
        <AlertCircle className="absolute top-2 right-2 h-5 w-5 text-red-600" />
      )}
      {rack.hasReadyToHarvest && (
        <Leaf className="absolute bottom-2 right-2 h-5 w-5 text-green-600" />
      )}
    </Card>
  );
}