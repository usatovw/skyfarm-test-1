'use client';

import { Rack, Tray } from '@/types/farming';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { TrayCard } from './TrayCard';
import { TrayPreview } from '../tray/TrayPreview';
import { ContextMenu, getTrayContextMenuItems } from '../actions/ContextMenu';
import { useState } from 'react';

interface RackViewProps {
  rack: Rack;
  onBack: () => void;
  onEnterTray?: (trayId: string) => void;
  onPlantTray?: (trayId: string) => void;
  onHarvestTray?: (trayId: string) => void;
  onClearTray?: (trayId: string) => void;
  onStopTray?: (trayId: string) => void;
  onCancelStopTray?: (trayId: string) => void;
}

export function RackView({ rack, onBack, onEnterTray, onPlantTray, onHarvestTray, onClearTray, onStopTray, onCancelStopTray }: RackViewProps) {
  const [selectedTrayId, setSelectedTrayId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    trayId: string;
    position: { x: number; y: number };
  } | null>(null);

  const selectedTray = selectedTrayId
    ? rack.trays.find(t => t.id === selectedTrayId)
    : null;

  const contextTray = contextMenu
    ? rack.trays.find(t => t.id === contextMenu.trayId)
    : null;

  const handleTrayShortPress = (trayId: string) => {
    // На странице стойки клик всегда только выбирает поддон для превью
    setSelectedTrayId(trayId);
  };

  const handleTrayLongPress = (trayId: string, event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    const x = 'clientX' in event ? event.clientX : event.touches[0].clientX;
    const y = 'clientY' in event ? event.clientY : event.touches[0].clientY;

    setContextMenu({
      trayId,
      position: { x, y }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Стойка {rack.position}</h2>
          <div className="text-sm text-muted-foreground">
            {rack.occupiedTrays} из 7 поддонов занято
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Схема стойки - вертикально */}
        <div className="space-y-3">
          <h3 className="font-semibold">Схема стойки</h3>
          <div className="flex flex-col-reverse gap-2">
            {rack.trays.map((tray) => (
              <TrayCard
                key={tray.id}
                tray={tray}
                isSelected={selectedTrayId === tray.id}
                onClick={() => handleTrayShortPress(tray.id)}
                onLongPress={(e) => handleTrayLongPress(tray.id, e)}
              />
            ))}
          </div>
        </div>

        {/* Превью поддона */}
        <div className="space-y-3">
          <h3 className="font-semibold">Информация о поддоне</h3>
          <TrayPreview
            tray={selectedTray}
            onEnterTray={selectedTrayId ? () => onEnterTray && onEnterTray(selectedTrayId) : undefined}
            onPlant={selectedTrayId ? () => onPlantTray && onPlantTray(selectedTrayId) : undefined}
            onHarvest={selectedTrayId ? () => onHarvestTray && onHarvestTray(selectedTrayId) : undefined}
            onClear={selectedTrayId ? () => onClearTray && onClearTray(selectedTrayId) : undefined}
            onStop={selectedTrayId ? () => onStopTray && onStopTray(selectedTrayId) : undefined}
            onCancelStop={selectedTrayId ? () => onCancelStopTray && onCancelStopTray(selectedTrayId) : undefined}
          />
        </div>
      </div>

      {/* Контекстное меню */}
      {contextMenu && contextTray && (
        <ContextMenu
          position={contextMenu.position}
          items={getTrayContextMenuItems(
            contextTray,
            null, // Не показываем "Открыть поддон" на странице стойки
            () => onPlantTray && onPlantTray(contextMenu.trayId),
            () => onHarvestTray && onHarvestTray(contextMenu.trayId),
            () => onClearTray && onClearTray(contextMenu.trayId),
            () => onStopTray && onStopTray(contextMenu.trayId),
            () => onCancelStopTray && onCancelStopTray(contextMenu.trayId)
          )}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}