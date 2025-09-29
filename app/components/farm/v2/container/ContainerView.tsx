'use client';

import { Container, Row, Rack } from '@/types/farming';
import { ContainerStats } from './ContainerStats';
import { RackCard } from './RackCard';
import { MultiSelectPanel } from '../actions/MultiSelectPanel';
import { ContextMenu, getRackContextMenuItems } from '../actions/ContextMenu';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface ContainerViewProps {
  container: Container;
  onEnterRack?: (rackId: string) => void;
  onPlantClick?: () => void;
  onApplyChangesClick?: () => void;
  hasChanges?: boolean;
  changesCount?: number;
  selection: ReturnType<typeof import('../hooks/useSelection').useSelection>;
  draftActions: ReturnType<typeof import('../hooks/useDraftActions').useDraftActions>;
}

export function ContainerView({
  container,
  onEnterRack,
  onPlantClick,
  onApplyChangesClick,
  hasChanges,
  changesCount,
  selection,
  draftActions
}: ContainerViewProps) {
  const [contextMenu, setContextMenu] = useState<{
    rackId: string;
    position: { x: number; y: number };
  } | null>(null);

  const handleSelectRow = (row: Row) => {
    const rackIds = row.racks.map(r => r.id);
    selection.selectRow(row.id, rackIds);
  };

  const handleRackShortPress = (rackId: string) => {
    if (selection.mode === 'multi') {
      selection.toggleRack(rackId);
    } else {
      // Переход в срез стойки
      if (onEnterRack) {
        onEnterRack(rackId);
      }
    }
  };

  const handleRackLongPress = (rackId: string, event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    const x = 'clientX' in event ? event.clientX : event.touches[0].clientX;
    const y = 'clientY' in event ? event.clientY : event.touches[0].clientY;

    setContextMenu({
      rackId,
      position: { x, y }
    });
  };

  const getRackForContextMenu = () => {
    if (!contextMenu) return null;
    return container.rows
      .flatMap(r => r.racks)
      .find(r => r.id === contextMenu.rackId);
  };

  const contextRack = getRackForContextMenu();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{container.name}</h1>
          <div className="text-sm text-muted-foreground mt-1">
            Температура: {container.currentClimate.temperature}°C |
            Влажность: {container.currentClimate.humidity}% |
            pH: {container.currentClimate.ph} |
            EC: {container.currentClimate.ec} µS/см
          </div>
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <Button onClick={onApplyChangesClick} variant="default" size="lg">
              Применить изменения ({changesCount})
            </Button>
          )}
          {selection.hasSelection && (
            <Button variant="outline" onClick={selection.clearSelection}>
              Отменить выбор
            </Button>
          )}
        </div>
      </div>

      <ContainerStats stats={container.stats} />

      <div className="space-y-6">
        {container.rows.map((row) => (
          <div key={row.id} className="space-y-3">
            <div className="flex items-center gap-4">
              <Button
                variant={selection.selectedRows.has(row.id) ? 'default' : 'outline'}
                onClick={() => handleSelectRow(row)}
              >
                Ряд {row.name}
              </Button>
              <div className="text-sm text-muted-foreground">
                6 стоек, {row.occupiedTrays} поддонов занято
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {row.racks.map((rack) => (
                <RackCard
                  key={rack.id}
                  rack={rack}
                  isSelected={selection.selectedRacks.has(rack.id)}
                  mode={selection.mode}
                  onShortPress={() => handleRackShortPress(rack.id)}
                  onLongPress={(e) => handleRackLongPress(rack.id, e)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {selection.hasSelection && (
        <MultiSelectPanel
          selectedCount={selection.selectedRacks.size}
          onPlant={() => onPlantClick && onPlantClick()}
          onClear={() => console.log('Clear')}
          onCancel={selection.clearSelection}
          onMore={() => console.log('More')}
        />
      )}

      {contextMenu && contextRack && (
        <ContextMenu
          position={contextMenu.position}
          items={getRackContextMenuItems(
            contextRack,
            () => {
              if (onEnterRack) {
                onEnterRack(contextMenu.rackId);
              }
            },
            () => {
              selection.enterMultiMode();
              selection.toggleRack(contextMenu.rackId);
            },
            () => onPlantClick && onPlantClick(),
            () => console.log('Harvest'),
            () => console.log('Clear'),
            () => console.log('Stop'),
            () => console.log('Cancel stop')
          )}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}