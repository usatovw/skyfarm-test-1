'use client';

import { Rack, Tray } from '@/types/farming';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { TrayCard } from './TrayCard';
import { TrayPreview } from '../tray/TrayPreview';
import { ContextMenu, getTrayContextMenuItems } from '../actions/ContextMenu';
import { MultiSelectPanel } from '../actions/MultiSelectPanel';
import StopGrowingConfirmation from '../../StopGrowingConfirmation';
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
  onPlantMultiple?: (trayIds: string[]) => void; // Массовая посадка
  onHarvestMultiple?: (trayIds: string[]) => void; // Массовый сбор
  onClearMultiple?: (trayIds: string[]) => void; // Массовая очистка
  onStopMultiple?: (trayIds: string[]) => void; // Массовая остановка
  onCancelStopMultiple?: (trayIds: string[]) => void; // Массовая отмена остановки
  containerData: any; // Container data for confirmation modal
}

export function RackView({ rack, onBack, onEnterTray, onPlantTray, onHarvestTray, onClearTray, onStopTray, onCancelStopTray, onPlantMultiple, onHarvestMultiple, onClearMultiple, onStopMultiple, onCancelStopMultiple, containerData }: RackViewProps) {
  const [selectedTrayId, setSelectedTrayId] = useState<string | null>(null);
  const [selectedTrays, setSelectedTrays] = useState<Set<string>>(new Set());
  const [mode, setMode] = useState<'single' | 'multi'>('single');
  const [contextMenu, setContextMenu] = useState<{
    trayId: string;
    position: { x: number; y: number };
  } | null>(null);
  const [showStopConfirmation, setShowStopConfirmation] = useState(false);
  const [trayToStop, setTrayToStop] = useState<string | null>(null);

  const selectedTray = selectedTrayId
    ? rack.trays.find(t => t.id === selectedTrayId)
    : null;

  const contextTray = contextMenu
    ? rack.trays.find(t => t.id === contextMenu.trayId)
    : null;

  const handleTrayShortPress = (trayId: string) => {
    if (mode === 'multi') {
      // В мультирежиме переключаем выделение поддона
      const newSelected = new Set(selectedTrays);
      if (newSelected.has(trayId)) {
        newSelected.delete(trayId);
      } else {
        newSelected.add(trayId);
      }
      setSelectedTrays(newSelected);
    } else {
      // В обычном режиме только выбираем поддон для превью
      setSelectedTrayId(trayId);
    }
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

  const handleStopTrayWithConfirmation = (trayId: string) => {
    const tray = rack.trays.find(t => t.id === trayId);
    console.log('🛑 RackView: handleStopTrayWithConfirmation вызван для поддона:', trayId);
    console.log('🛑 RackView: найденный поддон:', tray);
    console.log('🛑 RackView: статус поддона:', tray?.status);
    console.log('🛑 RackView: проверка исключений:', !['empty', 'harvested'].includes(tray?.status || ''));

    // Разрешаем останавливать поддоны со всеми статусами кроме пустых и собранных
    if (tray && !['empty', 'harvested'].includes(tray.status)) {
      console.log('🛑 RackView: ПОКАЗЫВАЕМ МОДАЛКУ для поддона:', trayId);
      setTrayToStop(trayId);
      setShowStopConfirmation(true);
    } else {
      console.log('🛑 RackView: НЕ показываем модалку для поддона:', trayId, 'статус:', tray?.status);
    }
  };

  const handleConfirmStop = (selectedTrayIds: string[]) => {
    if (onStopTray) {
      selectedTrayIds.forEach(trayId => onStopTray(trayId));
    }
    setShowStopConfirmation(false);
    setTrayToStop(null);
  };

  const handleCancelStop = () => {
    setShowStopConfirmation(false);
    setTrayToStop(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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
        <div className="flex gap-2">
          {mode === 'multi' && (
            <Button variant="outline" onClick={() => {
              setMode('single');
              setSelectedTrays(new Set());
            }}>
              Отменить выбор
            </Button>
          )}
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
                isSelected={mode === 'multi' ? selectedTrays.has(tray.id) : selectedTrayId === tray.id}
                onClick={() => handleTrayShortPress(tray.id)}
                onLongPress={(e) => handleTrayLongPress(tray.id, e)}
                mode={mode}
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
            onStop={selectedTrayId ? () => handleStopTrayWithConfirmation(selectedTrayId) : undefined}
            onCancelStop={selectedTrayId ? () => onCancelStopTray && onCancelStopTray(selectedTrayId) : undefined}
            containerData={containerData}
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
            () => {
              // Переключаемся в мультирежим и выбираем поддон
              setMode('multi');
              const newSelected = new Set(selectedTrays);
              newSelected.add(contextMenu.trayId);
              setSelectedTrays(newSelected);
              setContextMenu(null);
            },
            () => onPlantTray && onPlantTray(contextMenu.trayId),
            () => onHarvestTray && onHarvestTray(contextMenu.trayId),
            () => onClearTray && onClearTray(contextMenu.trayId),
            () => handleStopTrayWithConfirmation(contextMenu.trayId),
            () => onCancelStopTray && onCancelStopTray(contextMenu.trayId)
          )}
          onClose={() => setContextMenu(null)}
        />
      )}

      {/* Панель множественного выбора */}
      {mode === 'multi' && selectedTrays.size > 0 && (
        <MultiSelectPanel
          selectedCount={selectedTrays.size}
          onPlant={() => {
            // Массовая посадка через селектор культур
            const trayIds = Array.from(selectedTrays);
            onPlantMultiple && onPlantMultiple(trayIds);
            setMode('single');
            setSelectedTrays(new Set());
          }}
          onClear={() => {
            // Массовая очистка выбранных поддонов
            const trayIds = Array.from(selectedTrays);
            onClearMultiple && onClearMultiple(trayIds);
            setMode('single');
            setSelectedTrays(new Set());
          }}
          onCancel={() => {
            setMode('single');
            setSelectedTrays(new Set());
          }}
          onHarvest={() => {
            // Массовый сбор урожая с выбранных поддонов
            const trayIds = Array.from(selectedTrays);
            onHarvestMultiple && onHarvestMultiple(trayIds);
            setMode('single');
            setSelectedTrays(new Set());
          }}
          onStopGrowing={() => {
            // Показываем модалку подтверждения для выбранных поддонов
            setShowStopConfirmation(true);
          }}
          onCancelStop={() => {
            // Массовая отмена прекращения для выбранных поддонов
            const trayIds = Array.from(selectedTrays);
            onCancelStopMultiple && onCancelStopMultiple(trayIds);
            setMode('single');
            setSelectedTrays(new Set());
          }}
        />
      )}

      {/* Модалка подтверждения остановки */}
      {(trayToStop || (selectedTrays.size > 0 && showStopConfirmation)) && (
        <StopGrowingConfirmation
          isOpen={showStopConfirmation}
          onClose={handleCancelStop}
          onConfirm={(selectedTrayIds) => {
            if (trayToStop) {
              // Обычная остановка одного поддона
              handleConfirmStop(selectedTrayIds);
            } else {
              // Массовая остановка выбранных поддонов
              onStopMultiple && onStopMultiple(selectedTrayIds);
              setShowStopConfirmation(false);
              setMode('single');
              setSelectedTrays(new Set());
            }
          }}
          targetIds={trayToStop ? [trayToStop] : Array.from(selectedTrays)}
          targetType="tray"
          containerData={containerData}
        />
      )}
    </div>
  );
}