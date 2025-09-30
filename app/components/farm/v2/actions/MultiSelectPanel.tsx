'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sprout, Trash2, X, MoreHorizontal } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { ContextMenu, ContextMenuItem } from './ContextMenu';

interface MultiSelectPanelProps {
  selectedCount: number;
  onPlant: () => void;
  onClear: () => void;
  onCancel: () => void;
  onHarvest?: () => void;
  onStopGrowing?: () => void;
  onCancelStop?: () => void;
}

export function MultiSelectPanel({
  selectedCount,
  onPlant,
  onClear,
  onCancel,
  onHarvest,
  onStopGrowing,
  onCancelStop
}: MultiSelectPanelProps) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const moreButtonRef = useRef<HTMLButtonElement>(null);

  const moreMenuItems: ContextMenuItem[] = [
    {
      id: 'harvest',
      label: 'Собрать урожай',
      icon: <span>🌿</span>,
      disabled: !onHarvest,
      onClick: () => onHarvest?.()
    },
    {
      id: 'stop',
      label: 'Прекратить выращивание',
      icon: <span>⛔</span>,
      disabled: !onStopGrowing,
      onClick: () => onStopGrowing?.()
    },
    {
      id: 'cancel_stop',
      label: 'Отменить прекращение',
      icon: <span>↩️</span>,
      disabled: !onCancelStop,
      onClick: () => onCancelStop?.()
    }
  ];

  const getMenuPosition = () => {
    if (!moreButtonRef.current) return { x: 0, y: 0 };
    const rect = moreButtonRef.current.getBoundingClientRect();
    const menuWidth = 200;
    const menuHeight = moreMenuItems.length * 44 + 16; // высота пунктов + отступы

    // Позиционируем меню справа и выше кнопки
    let x = rect.right - menuWidth; // Выравниваем правый край меню с правым краем кнопки
    let y = rect.top - menuHeight - 8; // Размещаем выше кнопки с отступом

    // Проверяем границы экрана
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Если меню выходит за левую границу, показываем его слева от кнопки
    if (x < 8) {
      x = rect.left;
    }

    // Если меню выходит за верхнюю границу, показываем его снизу от кнопки
    if (y < 8) {
      y = rect.bottom + 8;
    }

    return { x, y };
  };
  return (
    <Card className="fixed bottom-0 left-0 right-0 p-4 shadow-lg border-t-4 border-primary animate-slide-up z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium">
            Выбрано стоек: <span className="text-lg font-bold">{selectedCount}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-6">
          <Button onClick={onPlant} size="lg">
            <Sprout className="mr-2 h-5 w-5" />
            Засадить
          </Button>
          <Button onClick={onClear} variant="outline" size="lg">
            <Trash2 className="mr-2 h-5 w-5" />
            Очистить
          </Button>
          <Button
            ref={moreButtonRef}
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            variant="outline"
            size="icon"
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
          <Button onClick={onCancel} variant="ghost" size="icon">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {showMoreMenu && (
        <ContextMenu
          items={moreMenuItems}
          position={getMenuPosition()}
          onClose={() => setShowMoreMenu(false)}
        />
      )}
    </Card>
  );
}