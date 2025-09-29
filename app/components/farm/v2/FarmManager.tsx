'use client';

import { useState } from 'react';
import { Container, DraftAction, Row } from '@/types/farming';
import { ContainerView } from './container/ContainerView';
import { RackView } from './rack/RackView';
import { TrayView } from './tray/TrayView';
import { CropSelectorModal } from './actions/CropSelectorModal';
import ChangesSummary from '../ChangesSummary';
import { useSelection } from './hooks/useSelection';
import { useDraftActions } from './hooks/useDraftActions';
import { containerV2 } from '@/data/mockDataV2';

export function FarmManager() {
  const [container, setContainer] = useState<Container>(containerV2);
  const [view, setView] = useState<'container' | 'rack' | 'tray'>('container');
  const [selectedRackId, setSelectedRackId] = useState<string | null>(null);
  const [selectedTrayId, setSelectedTrayId] = useState<string | null>(null);

  const [showCropSelector, setShowCropSelector] = useState(false);
  const [showChangesSummary, setShowChangesSummary] = useState(false);

  const selection = useSelection();
  const draftActions = useDraftActions();

  const selectedRack = selectedRackId
    ? container.rows.flatMap(r => r.racks).find(r => r.id === selectedRackId)
    : null;

  const selectedTray = selectedTrayId && selectedRack
    ? selectedRack.trays.find(t => t.id === selectedTrayId)
    : null;

  // Переход в стойку
  const handleEnterRack = (rackId: string) => {
    setSelectedRackId(rackId);
    setView('rack');
    selection.clearSelection();
  };

  // Переход в поддон
  const handleEnterTray = (trayId: string) => {
    setSelectedTrayId(trayId);
    setView('tray');
  };

  // Возврат к стойке
  const handleBackToRack = () => {
    setView('rack');
    setSelectedTrayId(null);
  };

  // Возврат на контейнер
  const handleBackToContainer = () => {
    setView('container');
    setSelectedRackId(null);
    setSelectedTrayId(null);
    selection.clearSelection();
  };

  // Открытие селектора культур
  const handleOpenCropSelector = () => {
    setShowCropSelector(true);
  };

  // Выбор культуры
  const handleSelectCrop = (cropId: string) => {
    const targetIds = Array.from(selection.selectedRacks);

    if (targetIds.length > 0) {
      // Получаем все пустые поддоны из выбранных стоек
      const affectedTrays: string[] = [];
      container.rows.forEach(row => {
        row.racks.forEach(rack => {
          if (targetIds.includes(rack.id)) {
            rack.trays.forEach(tray => {
              if (tray.status === 'empty') {
                affectedTrays.push(tray.id);
              }
            });
          }
        });
      });

      draftActions.addAction({
        type: 'plant',
        targetType: 'rack',
        targetIds,
        cropId,
        affectedTrays
      });

      selection.clearSelection();
    }
  };

  // Применение изменений
  const handleApplyChanges = (selectedActionIds: string[]) => {
    console.log('Применяем изменения:', selectedActionIds);

    // Здесь обновляем контейнер с новыми статусами
    const updatedContainer = { ...container };

    // Применяем только выбранные действия
    const selectedActions = draftActions.actions.filter(action =>
      selectedActionIds.includes(action.id)
    );

    selectedActions.forEach(action => {
      action.affectedTrays.forEach(trayId => {
        updatedContainer.rows.forEach(row => {
          row.racks.forEach(rack => {
            const tray = rack.trays.find(t => t.id === trayId);
            if (!tray) return;

            switch (action.type) {
              case 'plant':
                if (tray.status === 'empty' && action.cropId) {
                  tray.status = 'planned';
                  tray.crop = {
                    cropId: action.cropId,
                    plantedDate: new Date(),
                    currentStage: 'germination',
                    daysInStage: 0,
                    totalDaysGrowing: 0,
                    estimatedHarvestDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    stageProgress: 0
                  };
                }
                break;

              case 'harvest':
                if (tray.status === 'ready') {
                  tray.status = 'harvested';
                  if (tray.crop) {
                    tray.crop.actualHarvestDate = new Date();
                  }
                }
                break;

              case 'clear':
                if (tray.status === 'planned' || tray.status === 'harvested') {
                  tray.status = 'empty';
                  tray.crop = undefined;
                }
                break;

              case 'stop_growing':
                if (tray.status === 'growing') {
                  tray.status = 'stop_pending';
                }
                break;

              case 'cancel_stop':
                if (tray.status === 'stop_pending') {
                  tray.status = 'growing';
                }
                break;
            }
          });
        });
      });
    });

    setContainer(updatedContainer);

    // Удаляем примененные действия
    selectedActionIds.forEach(actionId => {
      draftActions.removeAction(actionId);
    });

    setShowChangesSummary(false);
  };

  // Открытие модалки применения изменений
  const handleShowApplyChanges = () => {
    if (draftActions.hasActions) {
      setShowChangesSummary(true);
    }
  };

  // Обработчики действий с поддонами
  const handlePlantTray = (trayId: string) => {
    setShowCropSelector(true);
    // Временно сохраняем trayId для дальнейшей обработки
    // TODO: Реализовать селектор культуры для одного поддона
  };

  const handleHarvestTray = (trayId: string) => {
    draftActions.addAction({
      type: 'harvest',
      targetType: 'tray',
      targetIds: [trayId],
      affectedTrays: [trayId]
    });
  };

  const handleClearTray = (trayId: string) => {
    draftActions.addAction({
      type: 'clear',
      targetType: 'tray',
      targetIds: [trayId],
      affectedTrays: [trayId]
    });
  };

  const handleStopTray = (trayId: string) => {
    draftActions.addAction({
      type: 'stop_growing',
      targetType: 'tray',
      targetIds: [trayId],
      affectedTrays: [trayId]
    });
  };

  const handleCancelStopTray = (trayId: string) => {
    draftActions.addAction({
      type: 'cancel_stop',
      targetType: 'tray',
      targetIds: [trayId],
      affectedTrays: [trayId]
    });
  };

  return (
    <>
      {view === 'container' && (
        <ContainerView
          container={container}
          onEnterRack={handleEnterRack}
          onPlantClick={handleOpenCropSelector}
          onApplyChangesClick={handleShowApplyChanges}
          hasChanges={draftActions.hasActions}
          changesCount={draftActions.actions.length}
          selection={selection}
          draftActions={draftActions}
        />
      )}

      {view === 'rack' && selectedRack && (
        <RackView
          rack={selectedRack}
          onBack={handleBackToContainer}
          onEnterTray={handleEnterTray}
          onPlantTray={handlePlantTray}
          onHarvestTray={handleHarvestTray}
          onClearTray={handleClearTray}
          onStopTray={handleStopTray}
          onCancelStopTray={handleCancelStopTray}
        />
      )}

      {view === 'tray' && selectedTray && (
        <TrayView
          tray={selectedTray}
          onBack={handleBackToRack}
        />
      )}

      <CropSelectorModal
        isOpen={showCropSelector}
        onClose={() => setShowCropSelector(false)}
        onSelect={handleSelectCrop}
        container={container}
        selectedCount={selection.selectedRacks.size}
      />

      <ChangesSummary
        isOpen={showChangesSummary}
        onClose={() => setShowChangesSummary(false)}
        changes={{
          selectedItems: {
            rows: Array.from(selection.selectedRows),
            racks: Array.from(selection.selectedRacks),
            trays: Array.from(selection.selectedTrays)
          },
          plannedActions: draftActions.actions.map(action => ({
            ...action,
            scheduledDate: new Date()
          }))
        }}
        onApply={handleApplyChanges}
        containerData={{
          id: container.id,
          name: container.name,
          rows: container.rows.map(row => ({
            id: row.id,
            name: row.name,
            racks: row.racks.map(rack => ({
              id: rack.id,
              rowId: rack.rowId,
              position: rack.position,
              trays: rack.trays.map(tray => ({
                id: tray.id,
                rackId: tray.rackId,
                position: tray.position,
                status: tray.status === 'problem' ? 'error' : tray.status,
                crop: tray.crop ? {
                  cropId: tray.crop.cropId,
                  plantedDate: tray.crop.plantedDate,
                  currentStage: tray.crop.currentStage,
                  daysInStage: tray.crop.daysInStage,
                  harvestDate: tray.crop.estimatedHarvestDate
                } : undefined
              })),
              totalTrays: rack.totalTrays,
              occupiedTrays: rack.occupiedTrays,
              status: rack.status
            })),
            totalTrays: row.totalTrays,
            occupiedTrays: row.occupiedTrays
          })),
          currentClimate: container.currentClimate
        }}
      />
    </>
  );
}