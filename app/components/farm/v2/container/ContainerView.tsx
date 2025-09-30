'use client';

import { Container, Row, Rack } from '@/types/farming';
import { ContainerStats } from './ContainerStats';
import { RackCard } from './RackCard';
import { MultiSelectPanel } from '../actions/MultiSelectPanel';
import { ContextMenu, getRackContextMenuItems } from '../actions/ContextMenu';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import StopGrowingConfirmation from '../../StopGrowingConfirmation';

interface ContainerViewProps {
  container: Container;
  onEnterRack?: (rackId: string) => void;
  onPlantClick?: () => void;
  onApplyChangesClick?: () => void;
  hasChanges?: boolean;
  changesCount?: number;
  selection: ReturnType<typeof import('../hooks/useSelection').useSelection>;
  draftActions: ReturnType<typeof import('../hooks/useDraftActions').useDraftActions>;
  onInstantClearPlanned?: (targetIds: string[], targetType: 'rack' | 'tray') => void;
  onInstantCancelStop?: (targetIds: string[], targetType: 'rack' | 'tray') => void;
  onInstantStopPlanning?: (affectedTrays: string[]) => void;
}

export function ContainerView({
  container,
  onEnterRack,
  onPlantClick,
  onApplyChangesClick,
  hasChanges,
  changesCount,
  selection,
  draftActions,
  onInstantClearPlanned,
  onInstantCancelStop,
  onInstantStopPlanning
}: ContainerViewProps) {
  const [contextMenu, setContextMenu] = useState<{
    rackId: string;
    position: { x: number; y: number };
  } | null>(null);

  // Состояние для модалки массового подтверждения прекращения выращивания
  const [showMassStopConfirmation, setShowMassStopConfirmation] = useState(false);
  const [pendingStopAction, setPendingStopAction] = useState<{
    selectedRackIds: string[];
    affectedTrays: string[];
  } | null>(null);

  const handleSelectRow = (row: Row) => {
    const rackIds = row.racks.map(r => r.id);
    selection.selectRow(row.id, rackIds);
  };

  // Обработчики для модалки массового подтверждения
  const handleMassStopConfirm = (selectedTrayIds: string[]) => {
    if (pendingStopAction) {
      // Добавляем действие в черновик только для выбранных лотков
      draftActions.addAction({
        type: 'stop_growing',
        targetType: 'rack',
        targetIds: pendingStopAction.selectedRackIds,
        affectedTrays: selectedTrayIds
      });

      // МГНОВЕННО изменяем статусы на 'stop_pending' только для выбранных лотков
      onInstantStopPlanning?.(selectedTrayIds);
    }

    setShowMassStopConfirmation(false);
    setPendingStopAction(null);
  };

  const handleMassStopCancel = () => {
    setShowMassStopConfirmation(false);
    setPendingStopAction(null);
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
          onClear={() => {
            // Очистка запланированных посадок для выбранных стоек
            const selectedRackIds = Array.from(selection.selectedRacks);
            onInstantClearPlanned?.(selectedRackIds, 'rack');
            selection.clearSelection();
          }}
          onCancel={selection.clearSelection}
          onHarvest={() => {
            const selectedRackIds = Array.from(selection.selectedRacks);
            // Вычисляем затронутые поддоны для выбранных стоек
            const affectedTrays: string[] = [];
            container.rows.forEach(row => {
              row.racks.forEach(rack => {
                if (selectedRackIds.includes(rack.id)) {
                  rack.trays.forEach(tray => {
                    if (tray.status === 'ready') {
                      affectedTrays.push(tray.id);
                    }
                  });
                }
              });
            });
            draftActions.addAction({
              type: 'harvest',
              targetType: 'rack',
              targetIds: selectedRackIds,
              affectedTrays
            });
          }}
          onStopGrowing={() => {
            const selectedRackIds = Array.from(selection.selectedRacks);
            console.log('🛑 MultiSelectPanel: Выбранные стойки:', selectedRackIds);

            // Вычисляем затронутые поддоны для выбранных стоек
            const affectedTrays: string[] = [];
            container.rows.forEach(row => {
              row.racks.forEach(rack => {
                if (selectedRackIds.includes(rack.id)) {
                  rack.trays.forEach(tray => {
                    if (!['empty', 'harvested'].includes(tray.status)) {
                      console.log('🛑 Найден поддон для остановки:', tray.id, 'статус:', tray.status, 'в стойке', rack.id);
                      affectedTrays.push(tray.id);
                    }
                  });
                }
              });
            });

            console.log('🛑 MultiSelectPanel: Затронутые поддоны:', affectedTrays);

            // ПОКАЗЫВАЕМ МОДАЛКУ ПОДТВЕРЖДЕНИЯ вместо прямого выполнения
            setPendingStopAction({ selectedRackIds, affectedTrays });
            setShowMassStopConfirmation(true);
          }}
          onCancelStop={() => {
            const selectedRackIds = Array.from(selection.selectedRacks);
            onInstantCancelStop?.(selectedRackIds, 'rack');
          }}
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
            () => {
              // Выбираем стойку в режиме мультивыбора перед открытием селектора культур
              selection.enterMultiMode();
              selection.toggleRack(contextMenu.rackId);
              onPlantClick && onPlantClick();
            },
            () => {
              const selectedRackIds = [contextMenu.rackId];
              // Вычисляем затронутые поддоны для контекстной стойки
              const affectedTrays: string[] = [];
              const rack = container.rows.flatMap(r => r.racks).find(r => r.id === contextMenu.rackId);
              if (rack) {
                rack.trays.forEach(tray => {
                  if (tray.status === 'ready') {
                    affectedTrays.push(tray.id);
                  }
                });
              }
              draftActions.addAction({
                type: 'harvest',
                targetType: 'rack',
                targetIds: selectedRackIds,
                affectedTrays
              });
            },
            () => {
              const selectedRackIds = [contextMenu.rackId];
              onInstantClearPlanned?.(selectedRackIds, 'rack');
            },
            () => {
              const selectedRackIds = [contextMenu.rackId];
              // Вычисляем затронутые поддоны для контекстной стойки
              const affectedTrays: string[] = [];
              const rack = container.rows.flatMap(r => r.racks).find(r => r.id === contextMenu.rackId);
              if (rack) {
                rack.trays.forEach(tray => {
                  if (!['empty', 'harvested'].includes(tray.status)) {
                    affectedTrays.push(tray.id);
                  }
                });
              }

              // Показываем модалку подтверждения
              setPendingStopAction({
                selectedRackIds,
                affectedTrays
              });
              setShowMassStopConfirmation(true);
              setContextMenu(null); // Закрываем контекстное меню
            },
            () => {
              const selectedRackIds = [contextMenu.rackId];
              onInstantCancelStop?.(selectedRackIds, 'rack');
            }
          )}
          onClose={() => setContextMenu(null)}
        />
      )}

      {/* Модалка подтверждения массового прекращения выращивания */}
      {pendingStopAction && (
        <StopGrowingConfirmation
          isOpen={showMassStopConfirmation}
          onClose={handleMassStopCancel}
          onConfirm={handleMassStopConfirm}
          targetIds={pendingStopAction.selectedRackIds}
          targetType="rack"
          containerData={container as any}
        />
      )}

    </div>
  );
}