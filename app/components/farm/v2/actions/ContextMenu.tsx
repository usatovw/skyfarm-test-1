'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, Sprout, Scissors, Trash2, StopCircle, Undo2 } from 'lucide-react';

interface ContextMenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  disabled: boolean;
  onClick: () => void;
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  position: { x: number; y: number };
  onClose: () => void;
}

export function ContextMenu({ items, position, onClose }: ContextMenuProps) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <Card
        className="fixed z-50 p-2 min-w-[280px] shadow-lg"
        style={{ top: position.y, left: position.x }}
      >
        <div className="space-y-1">
          {items.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className="w-full justify-start"
              disabled={item.disabled}
              onClick={() => {
                item.onClick();
                onClose();
              }}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Button>
          ))}
        </div>
      </Card>
    </>
  );
}

export function getRackContextMenuItems(
  rack: any,
  onEnter: () => void,
  onSelect: () => void,
  onPlant: () => void,
  onHarvest: () => void,
  onClear: () => void,
  onStop: () => void,
  onCancelStop: () => void
): ContextMenuItem[] {
  const hasEmptyTrays = rack.trays.some((t: any) => t.status === 'empty');
  const hasPlannedTrays = rack.trays.some((t: any) => t.status === 'planned');
  const hasGrowingTrays = rack.trays.some((t: any) => t.status === 'growing');
  const hasReadyTrays = rack.trays.some((t: any) => t.status === 'ready');
  const hasStopPendingTrays = rack.trays.some((t: any) => t.status === 'stop_pending');

  return [
    {
      id: 'enter',
      label: 'Перейти в стойку',
      icon: <ArrowRight className="h-4 w-4" />,
      disabled: false,
      onClick: onEnter
    },
    {
      id: 'select',
      label: 'Выбрать',
      icon: <Check className="h-4 w-4" />,
      disabled: false,
      onClick: onSelect
    },
    {
      id: 'plant',
      label: 'Запланировать посадку',
      icon: <Sprout className="h-4 w-4" />,
      disabled: !hasEmptyTrays,
      onClick: onPlant
    },
    {
      id: 'harvest',
      label: 'Собрать урожай',
      icon: <Scissors className="h-4 w-4" />,
      disabled: !hasReadyTrays,
      onClick: onHarvest
    },
    {
      id: 'clear',
      label: 'Очистить посадку',
      icon: <Trash2 className="h-4 w-4" />,
      disabled: !hasPlannedTrays,
      onClick: onClear
    },
    {
      id: 'stop',
      label: 'Прекратить выращивание',
      icon: <StopCircle className="h-4 w-4" />,
      disabled: !hasGrowingTrays,
      onClick: onStop
    },
    {
      id: 'cancel_stop',
      label: 'Отменить прекращение',
      icon: <Undo2 className="h-4 w-4" />,
      disabled: !hasStopPendingTrays,
      onClick: onCancelStop
    }
  ];
}

export function getTrayContextMenuItems(
  tray: any,
  onEnter: (() => void) | null,
  onPlant: () => void,
  onHarvest: () => void,
  onClear: () => void,
  onStop: () => void,
  onCancelStop: () => void
): ContextMenuItem[] {
  const items: ContextMenuItem[] = [];

  // Кнопка "Открыть поддон" показывается только если передан onEnter
  if (onEnter) {
    items.push({
      id: 'enter',
      label: 'Открыть поддон',
      icon: <ArrowRight className="h-4 w-4" />,
      disabled: false,
      onClick: onEnter
    });
  }

  // Остальные действия
  items.push(
    {
      id: 'plant',
      label: 'Засадить',
      icon: <Sprout className="h-4 w-4" />,
      disabled: tray.status !== 'empty',
      onClick: onPlant
    },
    {
      id: 'harvest',
      label: 'Собрать урожай',
      icon: <Scissors className="h-4 w-4" />,
      disabled: tray.status !== 'ready',
      onClick: onHarvest
    },
    {
      id: 'clear',
      label: 'Очистить',
      icon: <Trash2 className="h-4 w-4" />,
      disabled: tray.status !== 'planned' && tray.status !== 'harvested',
      onClick: onClear
    },
    {
      id: 'stop',
      label: 'Прекратить выращивание',
      icon: <StopCircle className="h-4 w-4" />,
      disabled: tray.status !== 'growing',
      onClick: onStop
    },
    {
      id: 'cancel_stop',
      label: 'Отменить прекращение',
      icon: <Undo2 className="h-4 w-4" />,
      disabled: tray.status !== 'stop_pending',
      onClick: onCancelStop
    }
  );

  return items;
}