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
  // Размеры меню
  const menuWidth = 300;
  const itemHeight = 44; // высота кнопки + отступы
  const menuPadding = 16; // отступы контейнера
  const menuHeight = items.length * itemHeight + menuPadding;

  // Размеры окна
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 768;

  // Отступы от краев экрана
  const margin = 8;

  // Вычисляем позицию с учетом границ экрана
  let finalX = position.x;
  let finalY = position.y;

  // Проверяем, не выходит ли меню за правую границу
  if (finalX + menuWidth > windowWidth - margin) {
    finalX = Math.max(margin, position.x - menuWidth); // Показываем слева от курсора
  }

  // Проверяем, не выходит ли меню за нижнюю границу
  if (finalY + menuHeight > windowHeight - margin) {
    finalY = Math.max(margin, position.y - menuHeight); // Показываем сверху от курсора
  }

  // Убеждаемся, что меню помещается в экран
  finalX = Math.max(margin, Math.min(finalX, windowWidth - menuWidth - margin));
  finalY = Math.max(margin, Math.min(finalY, windowHeight - menuHeight - margin));

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <Card
        className="fixed z-[9999] p-2 shadow-lg min-w-0 max-w-xs border bg-background"
        style={{
          top: finalY,
          left: finalX,
          width: menuWidth,
          maxHeight: 'calc(100vh - 16px)', // Предотвращаем выход за границы экрана
          overflowY: 'auto' // Добавляем скролл при необходимости
        }}
      >
        <div className="space-y-1 flex flex-col">
          {items.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className="w-full justify-start px-3 py-2 h-auto min-w-0 text-left"
              disabled={item.disabled}
              onClick={() => {
                item.onClick();
                onClose();
              }}
            >
              <span className="mr-3 flex-shrink-0">{item.icon}</span>
              <span className="flex-1 break-words">{item.label}</span>
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
  const hasGrowingTrays = rack.trays.some((t: any) => !['empty', 'harvested'].includes(t.status));
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
  onSelect: (() => void) | null,
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

  // Кнопка "Выбрать" показывается только если передан onSelect
  if (onSelect) {
    items.push({
      id: 'select',
      label: 'Выбрать',
      icon: <Check className="h-4 w-4" />,
      disabled: false,
      onClick: onSelect
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
      disabled: ['empty', 'harvested', 'planned'].includes(tray.status),
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