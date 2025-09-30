'use client';

import { useState } from 'react';
import { Container, DraftAction, Row, ContainerStats } from '@/types/farming';
import { ContainerView } from './container/ContainerView';
import { RackView } from './rack/RackView';
import { TrayView } from './tray/TrayView';
import { CropSelectorModal } from './actions/CropSelectorModal';
import ChangesSummary from '../ChangesSummary';
import { useSelection } from './hooks/useSelection';
import { useDraftActions } from './hooks/useDraftActions';
import { containerV2 } from '@/data/mockDataV2';

// Функция расчета статистики (скопирована из mockDataV2.ts)
function calculateStats(rows: Row[]): ContainerStats {
  let totalTrays = 0;
  let empty = 0;
  let planned = 0;
  let growing = 0;
  let ready = 0;
  let harvested = 0;
  let stopPending = 0;
  let problems = 0;

  rows.forEach(row => {
    row.racks.forEach(rack => {
      rack.trays.forEach(tray => {
        totalTrays++;
        switch (tray.status) {
          case 'empty': empty++; break;
          case 'planned': planned++; break;
          case 'growing': growing++; break;
          case 'ready': ready++; break;
          case 'harvested': harvested++; break;
          case 'stop_pending': stopPending++; break;
          case 'problem': problems++; break;
        }
      });
    });
  });

  const occupied = totalTrays - empty;
  const occupiedPercent = (occupied / totalTrays) * 100;
  const plannedPercent = (planned / totalTrays) * 100;
  const plannedPercentOfOccupied = occupied > 0 ? (planned / occupied) * 100 : 0;
  const growingPercent = (growing / totalTrays) * 100;
  const growingPercentOfOccupied = occupied > 0 ? (growing / occupied) * 100 : 0;
  const readyPercent = (ready / totalTrays) * 100;
  const readyPercentOfOccupied = occupied > 0 ? (ready / occupied) * 100 : 0;
  const harvestedPercent = (harvested / totalTrays) * 100;
  const freePercent = (empty / totalTrays) * 100;

  return {
    totalTrays,
    occupied,
    occupiedPercent,
    planned,
    plannedPercent,
    plannedPercentOfOccupied,
    growing,
    growingPercent,
    growingPercentOfOccupied,
    ready,
    readyPercent,
    readyPercentOfOccupied,
    harvested,
    harvestedPercent,
    stopPending,
    problems,
    free: empty,
    freePercent
  };
}

export function FarmManager() {
  const [container, setContainer] = useState<Container>(containerV2);
  const [view, setView] = useState<'container' | 'rack' | 'tray'>('container');
  const [selectedRackId, setSelectedRackId] = useState<string | null>(null);
  const [selectedTrayId, setSelectedTrayId] = useState<string | null>(null);

  const [showCropSelector, setShowCropSelector] = useState(false);
  const [showChangesSummary, setShowChangesSummary] = useState(false);
  const [selectedTrayForPlanting, setSelectedTrayForPlanting] = useState<string | null>(null);

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

  // Мгновенное планирование посадки (изменяет статус на 'planned')
  const handleInstantPlantPlanning = (affectedTrays: string[], cropId: string) => {
    const updatedContainer = JSON.parse(JSON.stringify(container));

    affectedTrays.forEach(trayId => {
      updatedContainer.rows.forEach(row => {
        row.racks.forEach(rack => {
          const tray = rack.trays.find(t => t.id === trayId);
          if (tray && tray.status === 'empty') {
            tray.status = 'planned';
            tray.crop = {
              cropId: cropId,
              plantedDate: new Date(),
              currentStage: 'germination',
              daysInStage: 0,
              totalDaysGrowing: 0,
              estimatedHarvestDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              stageProgress: 0
            };
          }
        });
      });
    });

    // Пересчитываем статистику
    updatedContainer.stats = calculateStats(updatedContainer.rows);
    setContainer(updatedContainer);
  };

  // Выбор культуры
  const handleSelectCrop = (cropId: string) => {
    // Проверяем, выбран ли конкретный поддон для посадки
    if (selectedTrayForPlanting) {
      // Определяем, один поддон или несколько (разделенных запятой)
      const trayIds = selectedTrayForPlanting.includes(',')
        ? selectedTrayForPlanting.split(',')
        : [selectedTrayForPlanting];

      draftActions.addAction({
        type: 'plant',
        targetType: 'tray',
        targetIds: trayIds,
        cropId,
        affectedTrays: trayIds
      });

      // МГНОВЕННО изменяем статус на 'planned' для всех поддонов
      handleInstantPlantPlanning(trayIds, cropId);

      setSelectedTrayForPlanting(null);
    } else {
      // Посадка в выбранные стойки (старая логика)
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

        // МГНОВЕННО изменяем статус на 'planned'
        handleInstantPlantPlanning(affectedTrays, cropId);

        selection.clearSelection();
      }
    }
  };

  // Применение изменений
  const handleApplyChanges = (selectedActionIds: string[]) => {
    console.log('🚀 Применяем изменения:', selectedActionIds);
    console.log('🔄 Контейнер до изменений:', container);

    // Здесь обновляем контейнер с новыми статусами (deep copy)
    const updatedContainer = JSON.parse(JSON.stringify(container));

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
                // При применении изменений переводим 'planned' в 'growing'
                if (tray.status === 'planned' && action.cropId) {
                  tray.status = 'growing';
                  // Обновляем данные культуры для старта роста
                  if (tray.crop) {
                    tray.crop.actualPlantingDate = new Date();
                    tray.crop.totalDaysGrowing = 1; // Начинаем с 1 дня
                    tray.crop.stageProgress = 10; // Небольшой прогресс
                  }
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
                // При применении изменений переводим 'stop_pending' в 'empty' (окончательно прекращаем)
                if (tray.status === 'stop_pending') {
                  tray.status = 'empty';
                  tray.crop = undefined; // Удаляем данные культуры
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

    // Пересчитываем статистику контейнера
    const calculateStats = (rows: any[]) => {
      let totalTrays = 0;
      let empty = 0;
      let planned = 0;
      let growing = 0;
      let ready = 0;
      let harvested = 0;
      let stopPending = 0;
      let problems = 0;

      rows.forEach(row => {
        row.racks.forEach((rack: any) => {
          rack.trays.forEach((tray: any) => {
            totalTrays++;
            switch (tray.status) {
              case 'empty': empty++; break;
              case 'planned': planned++; break;
              case 'growing': growing++; break;
              case 'ready': ready++; break;
              case 'harvested': harvested++; break;
              case 'stop_pending': stopPending++; break;
              case 'problem': problems++; break;
            }
          });
        });
      });

      const occupied = totalTrays - empty;
      const occupiedPercent = (occupied / totalTrays) * 100;
      const plannedPercent = (planned / totalTrays) * 100;
      const plannedPercentOfOccupied = occupied > 0 ? (planned / occupied) * 100 : 0;
      const growingPercent = (growing / totalTrays) * 100;
      const growingPercentOfOccupied = occupied > 0 ? (growing / occupied) * 100 : 0;
      const readyPercent = (ready / totalTrays) * 100;
      const readyPercentOfOccupied = occupied > 0 ? (ready / occupied) * 100 : 0;
      const harvestedPercent = (harvested / totalTrays) * 100;
      const freePercent = (empty / totalTrays) * 100;

      return {
        totalTrays,
        occupied,
        occupiedPercent,
        planned,
        plannedPercent,
        plannedPercentOfOccupied,
        growing,
        growingPercent,
        growingPercentOfOccupied,
        ready,
        readyPercent,
        readyPercentOfOccupied,
        harvested,
        harvestedPercent,
        stopPending,
        problems,
        free: empty,
        freePercent
      };
    };

    updatedContainer.stats = calculateStats(updatedContainer.rows);

    console.log('✅ Контейнер после изменений:', updatedContainer);
    console.log('📊 Обновленная статистика:', updatedContainer.stats);

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
    setSelectedTrayForPlanting(trayId);
    setShowCropSelector(true);
  };

  const handlePlantMultiple = (trayIds: string[]) => {
    // Для массовой посадки открываем селектор культур с несколькими поддонами
    setSelectedTrayForPlanting(trayIds.join(','));
    setShowCropSelector(true);
  };

  const handleHarvestTray = (trayId: string) => {
    draftActions.addAction({
      type: 'harvest',
      targetType: 'tray',
      targetIds: [trayId],
      affectedTrays: [trayId]
    });
  };

  const handleHarvestMultiple = (trayIds: string[]) => {
    draftActions.addAction({
      type: 'harvest',
      targetType: 'tray',
      targetIds: trayIds,
      affectedTrays: trayIds
    });
  };

  const handleClearTray = (trayId: string) => {
    // Найти поддон в контейнере
    let tray: any = null;
    container.rows.forEach(row => {
      row.racks.forEach(rack => {
        const foundTray = rack.trays.find(t => t.id === trayId);
        if (foundTray) tray = foundTray;
      });
    });

    if (tray && tray.status === 'planned') {
      // Для запланированных поддонов - мгновенная очистка
      handleInstantClearPlanned([trayId], 'tray');
    } else {
      // Для других статусов - добавляем в черновик
      draftActions.addAction({
        type: 'clear',
        targetType: 'tray',
        targetIds: [trayId],
        affectedTrays: [trayId]
      });
    }
  };

  const handleClearMultiple = (trayIds: string[]) => {
    trayIds.forEach(trayId => handleClearTray(trayId));
  };

  const handleStopMultiple = (trayIds: string[]) => {
    draftActions.addAction({
      type: 'stop_growing',
      targetType: 'tray',
      targetIds: trayIds,
      affectedTrays: trayIds
    });
  };

  const handleCancelStopMultiple = (trayIds: string[]) => {
    trayIds.forEach(trayId => handleCancelStopTray(trayId));
  };

  // Мгновенное планирование прекращения (изменяет статус на 'stop_pending')
  const handleInstantStopPlanning = (affectedTrays: string[]) => {
    console.log('🛑 handleInstantStopPlanning вызван с поддонами:', affectedTrays);
    const updatedContainer = JSON.parse(JSON.stringify(container));

    let changedCount = 0;
    affectedTrays.forEach(trayId => {
      updatedContainer.rows.forEach(row => {
        row.racks.forEach(rack => {
          const tray = rack.trays.find(t => t.id === trayId);
          if (tray && tray.status === 'growing') {
            console.log('🛑 Меняем статус поддона', trayId, 'с growing на stop_pending');
            tray.status = 'stop_pending';
            changedCount++;
          }
        });
      });
    });

    console.log('🛑 Всего изменено поддонов:', changedCount, 'из', affectedTrays.length);

    // Пересчитываем статистику
    updatedContainer.stats = calculateStats(updatedContainer.rows);
    setContainer(updatedContainer);
  };

  const handleStopTray = (trayId: string) => {
    draftActions.addAction({
      type: 'stop_growing',
      targetType: 'tray',
      targetIds: [trayId],
      affectedTrays: [trayId]
    });

    // МГНОВЕННО изменяем статус на 'stop_pending'
    handleInstantStopPlanning([trayId]);
  };

  const handleCancelStopTray = (trayId: string) => {
    // Найти поддон в контейнере
    let tray: any = null;
    container.rows.forEach(row => {
      row.racks.forEach(rack => {
        const foundTray = rack.trays.find(t => t.id === trayId);
        if (foundTray) tray = foundTray;
      });
    });

    if (tray && tray.status === 'stop_pending') {
      // Для поддонов на прекращение - мгновенная отмена
      handleInstantCancelStop([trayId], 'tray');
    } else {
      // Для других статусов - добавляем в черновик
      draftActions.addAction({
        type: 'cancel_stop',
        targetType: 'tray',
        targetIds: [trayId],
        affectedTrays: [trayId]
      });
    }
  };

  // Мгновенные действия без черновика
  const handleInstantClearPlanned = (targetIds: string[], targetType: 'rack' | 'tray') => {
    const updatedContainer = JSON.parse(JSON.stringify(container));

    targetIds.forEach(targetId => {
      if (targetType === 'rack') {
        // Очистка всех запланированных поддонов в стойке
        updatedContainer.rows.forEach(row => {
          const rack = row.racks.find(r => r.id === targetId);
          if (rack) {
            rack.trays.forEach(tray => {
              if (tray.status === 'planned') {
                tray.status = 'empty';
                tray.crop = undefined;
              }
            });
          }
        });
      } else if (targetType === 'tray') {
        // Очистка конкретного поддона
        updatedContainer.rows.forEach(row => {
          row.racks.forEach(rack => {
            const tray = rack.trays.find(t => t.id === targetId);
            if (tray && tray.status === 'planned') {
              tray.status = 'empty';
              tray.crop = undefined;
            }
          });
        });
      }
    });

    setContainer(updatedContainer);
  };

  const handleInstantCancelStop = (targetIds: string[], targetType: 'rack' | 'tray') => {
    const updatedContainer = JSON.parse(JSON.stringify(container));

    targetIds.forEach(targetId => {
      if (targetType === 'rack') {
        // Отмена прекращения для всех поддонов в стойке
        updatedContainer.rows.forEach(row => {
          const rack = row.racks.find(r => r.id === targetId);
          if (rack) {
            rack.trays.forEach(tray => {
              if (tray.status === 'stop_pending') {
                tray.status = 'growing';
              }
            });
          }
        });
      } else if (targetType === 'tray') {
        // Отмена прекращения для конкретного поддона
        updatedContainer.rows.forEach(row => {
          row.racks.forEach(rack => {
            const tray = rack.trays.find(t => t.id === targetId);
            if (tray && tray.status === 'stop_pending') {
              tray.status = 'growing';
            }
          });
        });
      }
    });

    setContainer(updatedContainer);
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
          onInstantClearPlanned={handleInstantClearPlanned}
          onInstantCancelStop={handleInstantCancelStop}
          onInstantStopPlanning={handleInstantStopPlanning}
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
          onPlantMultiple={handlePlantMultiple}
          onHarvestMultiple={handleHarvestMultiple}
          onClearMultiple={handleClearMultiple}
          onStopMultiple={handleStopMultiple}
          onCancelStopMultiple={handleCancelStopMultiple}
          containerData={container}
        />
      )}

      {view === 'tray' && selectedTray && (
        <TrayView
          tray={selectedTray}
          onBack={handleBackToRack}
          onPlant={() => handlePlantTray(selectedTray.id)}
          onHarvest={() => handleHarvestTray(selectedTray.id)}
          onClear={() => handleClearTray(selectedTray.id)}
          onStop={() => handleStopTray(selectedTray.id)}
          onCancelStop={() => handleCancelStopTray(selectedTray.id)}
          containerData={container}
        />
      )}

      <CropSelectorModal
        isOpen={showCropSelector}
        onClose={() => {
          setShowCropSelector(false);
          setSelectedTrayForPlanting(null);
        }}
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