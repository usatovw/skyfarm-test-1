'use client'

import { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  Grid3X3, 
  Sprout, 
  Check,
  AlertTriangle,
  Eye,
  Plus,
  Info
} from 'lucide-react';
import ContainerGrid from './ContainerGrid';
import RackDetail from './RackDetail';
import CropSelector from './CropSelector';
import ChangesSummary from './ChangesSummary';
import StopGrowingConfirmation from './StopGrowingConfirmation';
import { ViewMode, SelectionState, ChangesDraft, ContainerStatus } from "@/types/farming";
import { mockContainerData, mockCrops } from "@/data/mockData";
import TrayDetail from './TrayDetail';

export default function GrowthManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>({ current: 'overview' });
  const [selectionState, setSelectionState] = useState<SelectionState>({
    selectedRows: new Set(),
    selectedRacks: new Set(),
    selectedTrays: new Set(),
    mode: 'none'
  });
  const [changesDraft, setChangesDraft] = useState<ChangesDraft>({
    selectedItems: { rows: [], racks: [], trays: [] },
    plannedActions: []
  });
  const [showCropSelector, setShowCropSelector] = useState(false);
  const [showChangesSummary, setShowChangesSummary] = useState(false);
  const [showStopGrowingConfirmation, setShowStopGrowingConfirmation] = useState(false);
  const [stopGrowingData, setStopGrowingData] = useState<{targetIds: string[], targetType: 'tray' | 'rack'} | null>(null);
  const [isLoading, setIsLoading] = useState(false); // НОВОЕ: Loading состояние
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // НОВОЕ: Временные изменения для немедленного отображения
  const [pendingChanges, setPendingChanges] = useState<Map<string, string>>(new Map());

  // НОВОЕ: Создаем контейнер с учетом временных изменений
  const containerWithPendingChanges = useMemo(() => {
    if (pendingChanges.size === 0) return mockContainerData;

    const updatedContainer: ContainerStatus = {
      ...mockContainerData,
      rows: mockContainerData.rows.map(row => ({
        ...row,
        racks: row.racks.map(rack => ({
          ...rack,
          trays: rack.trays.map(tray => {
            const pendingCropId = pendingChanges.get(tray.id);
            if (pendingCropId) {
              return {
                ...tray,
                status: 'planned' as const,
                crop: {
                  cropId: pendingCropId,
                  plantedDate: new Date(),
                  currentStage: 'seed',
                  daysInStage: 0,
                  harvestDate: undefined
                }
              };
            }
            return tray;
          })
        }))
      }))
    };

    return updatedContainer;
  }, [pendingChanges]);

  // НОВОЕ: Функция отмены всех изменений
  const handleCancelAllChanges = useCallback(() => {
    console.log('🔄 Отмена всех изменений');
    setPendingChanges(new Map());
    setChangesDraft({
      selectedItems: { rows: [], racks: [], trays: [] },
      plannedActions: []
    });
    setSelectionState({
      selectedRows: new Set(),
      selectedRacks: new Set(),
      selectedTrays: new Set(),
      mode: 'none'
    });
  }, []);

  const handleBackToOverview = useCallback(() => {
    setViewMode({ current: 'overview' });
  }, []);

  const handleRackClick = useCallback((rackId: string) => {
    setViewMode({ current: 'rack-detail', selectedRackId: rackId });
  }, []);

  const handleTrayClick = useCallback((trayId: string) => {
    setViewMode({ current: 'tray-detail', selectedTrayId: trayId });
  }, []);

  const handleSelectionChange = useCallback((newSelection: SelectionState) => {
    setSelectionState(newSelection);
  }, []);

  // Мемоизация вычисляемых значений
  const selectedCount = useMemo(() => 
    selectionState.selectedRows.size + 
    selectionState.selectedRacks.size + 
    selectionState.selectedTrays.size
  , [selectionState]);

  const hasChanges = useMemo(() => 
    changesDraft.plannedActions.length > 0
  , [changesDraft.plannedActions.length]);

  const handlePlantAction = useCallback(() => {
    // Преобразуем выделение в формат для черновика
    const selectedItems = {
      rows: Array.from(selectionState.selectedRows),
      racks: Array.from(selectionState.selectedRacks), 
      trays: Array.from(selectionState.selectedTrays)
    };
    
    setChangesDraft(prev => ({ ...prev, selectedItems }));
    setShowCropSelector(true);
  }, [selectionState]);

  // Новый callback для посадки в конкретные поддоны
  const handlePlantInTrays = useCallback((trayIds: string[]) => {
    setSelectionState({
      selectedRows: new Set(),
      selectedRacks: new Set(),
      selectedTrays: new Set(trayIds),
      mode: 'none'
    });
    
    const selectedItems = {
      rows: [],
      racks: [],
      trays: trayIds
    };
    
    setChangesDraft(prev => ({ ...prev, selectedItems }));
    setShowCropSelector(true);
  }, []);

  const handleCropSelected = useCallback((cropId: string) => {
    // Получаем текущее состояние выделения
    const currentSelection = selectionState;
    
    // Получаем все целевые поддоны из выделения
    const targetTrayIds = new Set<string>();

    // Из прямо выделенных поддонов
    currentSelection.selectedTrays.forEach(trayId => {
      targetTrayIds.add(trayId);
    });

    // Из выделенных стоек
    currentSelection.selectedRacks.forEach(rackId => {
      const rack = mockContainerData.rows
        .flatMap(row => row.racks)
        .find(r => r.id === rackId);
      if (rack) {
        rack.trays.forEach(tray => {
          if (tray.status === 'empty') { // Только пустые поддоны
            targetTrayIds.add(tray.id);
          }
        });
      }
    });

    // Из выделенных рядов
    currentSelection.selectedRows.forEach(rowId => {
      const row = mockContainerData.rows.find(r => r.id === rowId);
      if (row) {
        row.racks.forEach(rack => {
          rack.trays.forEach(tray => {
            if (tray.status === 'empty') { // Только пустые поддоны
              targetTrayIds.add(tray.id);
            }
          });
        });
      }
    });

    // НОВОЕ: Сразу добавляем временные изменения для визуального отображения
    setPendingChanges(prev => {
      const newPending = new Map(prev);
      targetTrayIds.forEach(trayId => {
        newPending.set(trayId, cropId);
      });
      return newPending;
    });

    // Создаем новое планируемое действие
    const newAction = {
      id: `action_${Date.now()}`,
      type: 'plant' as const,
      targetType: currentSelection.selectedRows.size > 0 ? 'row' as const :
                 currentSelection.selectedRacks.size > 0 ? 'rack' as const : 'tray' as const,
      targetIds: Array.from(targetTrayIds),
      cropId,
      scheduledDate: new Date()
    };

    // Добавляем действие в черновик
    setChangesDraft(prev => ({
      ...prev,
      plannedActions: [...prev.plannedActions, newAction]
    }));
    
    setShowCropSelector(false);
    
    // Сбрасываем выделение
    setSelectionState({
      selectedRows: new Set(),
      selectedRacks: new Set(), 
      selectedTrays: new Set(),
      mode: 'none'
    });
  }, [selectionState]);

  const handleApplyChanges = useCallback(() => {
    const affectedTrays = changesDraft.plannedActions.reduce((total, action) => total + action.targetIds.length, 0);
    console.log('Применение изменений:', changesDraft);
    
    // Показываем сообщение об успехе
    setSuccessMessage(`✅ Успешно применены изменения! Запущено выращивание в ${affectedTrays} поддонах.`);
    
    // Очищаем все временные изменения после применения
    setPendingChanges(new Map());
    setChangesDraft({
      selectedItems: { rows: [], racks: [], trays: [] },
      plannedActions: []
    });
    setShowChangesSummary(false);
    
    // Убираем сообщение через 5 секунд
    setTimeout(() => setSuccessMessage(null), 5000);
  }, [changesDraft]);

  // НОВОЕ: Обработчик очистки запланированных поддонов
  const handleClearPlanned = useCallback((targetIds: string[], targetType: 'tray' | 'rack') => {
    console.log('🗑️ Очистка запланированных:', { targetIds, targetType });
    
    // Получаем все затронутые поддоны
    const affectedTrayIds = new Set<string>();
    
    if (targetType === 'tray') {
      targetIds.forEach(trayId => {
        const tray = containerWithPendingChanges.rows
          .flatMap(row => row.racks)
          .flatMap(rack => rack.trays)
          .find(t => t.id === trayId);
        if (tray && tray.status === 'planned') {
          affectedTrayIds.add(trayId);
        }
      });
    } else if (targetType === 'rack') {
      targetIds.forEach(rackId => {
        const rack = containerWithPendingChanges.rows
          .flatMap(row => row.racks)
          .find(r => r.id === rackId);
        if (rack) {
          rack.trays.forEach(tray => {
            if (tray.status === 'planned') {
              affectedTrayIds.add(tray.id);
            }
          });
        }
      });
    }

    if (affectedTrayIds.size === 0) {
      console.log('⚠️ Нет запланированных поддонов для очистки');
      return;
    }

    // Удаляем из pendingChanges
    setPendingChanges(prev => {
      const newPending = new Map(prev);
      affectedTrayIds.forEach(trayId => {
        newPending.delete(trayId);
      });
      return newPending;
    });

    // Создаем действие очистки
    const clearAction = {
      id: `clear_${Date.now()}`,
      type: 'clear' as const,
      targetType: targetType,
      targetIds: Array.from(affectedTrayIds),
      scheduledDate: new Date()
    };

    // Добавляем действие в черновик
    setChangesDraft(prev => ({
      ...prev,
      plannedActions: [...prev.plannedActions, clearAction]
    }));

    console.log('✅ Добавлено действие очистки:', clearAction);
  }, [containerWithPendingChanges]);

  // НОВОЕ: Обработчик принудительной остановки выращивания
  const handleStopGrowing = useCallback((targetIds: string[], targetType: 'tray' | 'rack') => {
    console.log('🛑 Запрос остановки выращивания:', { targetIds, targetType });
    
    // Сохраняем данные для модалки подтверждения
    setStopGrowingData({ targetIds, targetType });
    setShowStopGrowingConfirmation(true);
  }, []);

  // НОВОЕ: Подтверждение остановки выращивания
  const handleConfirmStopGrowing = useCallback(() => {
    if (!stopGrowingData) return;

    const { targetIds, targetType } = stopGrowingData;
    console.log('✅ Подтверждена остановка выращивания:', stopGrowingData);

    // Получаем все затронутые поддоны с растущими культурами
    const affectedTrayIds = new Set<string>();
    
    if (targetType === 'tray') {
      targetIds.forEach(trayId => {
        const tray = containerWithPendingChanges.rows
          .flatMap(row => row.racks)
          .flatMap(rack => rack.trays)
          .find(t => t.id === trayId);
        if (tray && (tray.status === 'growing' || tray.status === 'ready')) {
          affectedTrayIds.add(trayId);
        }
      });
    } else if (targetType === 'rack') {
      targetIds.forEach(rackId => {
        const rack = containerWithPendingChanges.rows
          .flatMap(row => row.racks)
          .find(r => r.id === rackId);
        if (rack) {
          rack.trays.forEach(tray => {
            if (tray.status === 'growing' || tray.status === 'ready') {
              affectedTrayIds.add(tray.id);
            }
          });
        }
      });
    }

    if (affectedTrayIds.size === 0) {
      console.log('⚠️ Нет растущих культур для остановки');
      setShowStopGrowingConfirmation(false);
      setStopGrowingData(null);
      return;
    }

    // Создаем действие принудительной остановки
    const stopAction = {
      id: `stop_${Date.now()}`,
      type: 'stop_growing' as const,
      targetType: targetType,
      targetIds: Array.from(affectedTrayIds),
      scheduledDate: new Date(),
      forceStop: true
    };

    // Добавляем действие в черновик
    setChangesDraft(prev => ({
      ...prev,
      plannedActions: [...prev.plannedActions, stopAction]
    }));

    // Закрываем модалку
    setShowStopGrowingConfirmation(false);
    setStopGrowingData(null);

    console.log('✅ Добавлено действие остановки:', stopAction);
  }, [stopGrowingData, containerWithPendingChanges]);

  const breadcrumbItems = [
    { label: 'Контейнер № 41-i2f', onClick: handleBackToOverview }
  ];

  if (viewMode.current === 'rack-detail' && viewMode.selectedRackId) {
    const rack = containerWithPendingChanges.rows
      .flatMap(row => row.racks)
      .find(r => r.id === viewMode.selectedRackId);
    if (rack) {
      breadcrumbItems.push({ label: `Стойка ${rack.rowId.split('_')[1]}${rack.position}`, onClick: () => {} });
    }
  }

  if (viewMode.current === 'tray-detail' && viewMode.selectedTrayId) {
    breadcrumbItems.push({ label: 'Поддон', onClick: () => {} });
  }

  return (
    <div className="space-y-6">
      {/* Навигация с контекстом */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {breadcrumbItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && <span>/</span>}
              <button 
                onClick={item.onClick}
                className="hover:text-foreground transition-colors font-medium"
              >
                {item.label}
              </button>
            </div>
          ))}
        </div>
        
        {/* Контекстная информация */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {viewMode.current === 'overview' && (
            <>
              <span>400 поддонов</span>
              <span>•</span>
              <span>{containerWithPendingChanges.rows.reduce((sum, row) => sum + row.occupiedTrays, 0)} занято</span>
            </>
          )}
          {viewMode.current === 'rack-detail' && viewMode.selectedRackId && (
            <>
              <span>10 поддонов</span>
              <span>•</span>
              <span>{containerWithPendingChanges.rows
                .flatMap(row => row.racks)
                .find(r => r.id === viewMode.selectedRackId)?.occupiedTrays || 0} занято</span>
            </>
          )}
        </div>
      </div>

      {/* Действия и статус */}
      {viewMode.current === 'overview' && (
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">Управление выращиванием</h2>
            <p className="text-sm text-muted-foreground">
              Контейнер: 4 ряда × 10 стоек × 10 поддонов = 400 поддонов
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {hasChanges && (
              <>
                <Button 
                  variant="outline"
                  onClick={handleCancelAllChanges}
                  className="flex items-center gap-2 text-destructive hover:text-destructive"
                >
                  <AlertTriangle className="h-4 w-4" />
                  Отменить изменения
                </Button>
                <Button 
                  onClick={() => setShowChangesSummary(true)}
                  className="flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  Применить изменения ({changesDraft.plannedActions.length})
                </Button>
              </>
            )}
            
            {selectedCount > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  Выбрано: {selectedCount}
                </Badge>
                <Button 
                  size="sm"
                  onClick={handlePlantAction}
                  className="flex items-center gap-2"
                >
                  <Sprout className="h-4 w-4" />
                  Засадить
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Основное содержимое */}
      {viewMode.current === 'overview' && (
        <ContainerGrid 
          containerData={containerWithPendingChanges}
          selectionState={selectionState}
          onSelectionChange={handleSelectionChange}
          onRackClick={handleRackClick}
          onPlantAction={handlePlantAction}
          onClearPlanned={handleClearPlanned}
          onStopGrowing={handleStopGrowing}
        />
      )}

      {viewMode.current === 'rack-detail' && viewMode.selectedRackId && (
        <div className="space-y-4">
          <Button 
            variant="ghost" 
            onClick={handleBackToOverview}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад к обзору
          </Button>
          <RackDetail 
            rackId={viewMode.selectedRackId}
            containerData={containerWithPendingChanges}
            onTrayClick={handleTrayClick}
            onPlantAction={handlePlantInTrays}
            onClearPlanned={handleClearPlanned}
            onStopGrowing={handleStopGrowing}
          />
        </div>
      )}

      {viewMode.current === 'tray-detail' && viewMode.selectedTrayId && (
        <div className="space-y-4">
          <Button 
            variant="ghost" 
            onClick={() => {
              if (viewMode.selectedRackId) {
                setViewMode({ current: 'rack-detail', selectedRackId: viewMode.selectedRackId });
              } else {
                handleBackToOverview();
              }
            }}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад
          </Button>
          <TrayDetail 
            trayId={viewMode.selectedTrayId}
            containerData={containerWithPendingChanges}
            onPlantAction={handlePlantInTrays}
            onClearPlanned={handleClearPlanned}
            onStopGrowing={handleStopGrowing}
          />
        </div>
      )}

      {/* Селектор культур */}
      {showCropSelector && (
        <CropSelector
          isOpen={showCropSelector}
          onClose={() => setShowCropSelector(false)}
          onCropSelected={handleCropSelected}
          availableCrops={mockCrops}
          currentMode={mockContainerData.activeMode?.cropId}
          containerData={containerWithPendingChanges}
        />
      )}

      {/* Сводка изменений */}
      {showChangesSummary && (
        <ChangesSummary
          isOpen={showChangesSummary}
          onClose={() => setShowChangesSummary(false)}
          changes={changesDraft}
          onApply={handleApplyChanges}
          containerData={mockContainerData}
        />
      )}

      {/* Модалка подтверждения остановки выращивания */}
      {showStopGrowingConfirmation && stopGrowingData && (
        <StopGrowingConfirmation
          isOpen={showStopGrowingConfirmation}
          onClose={() => {
            setShowStopGrowingConfirmation(false);
            setStopGrowingData(null);
          }}
          onConfirm={handleConfirmStopGrowing}
          targetIds={stopGrowingData.targetIds}
          targetType={stopGrowingData.targetType}
          containerData={containerWithPendingChanges}
        />
      )}

      {/* Предупреждения */}
      {selectedCount > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Выбрано элементов: {selectedCount}. В рамках одной итерации можно выбрать только одну культуру.
          </AlertDescription>
        </Alert>
      )}

      {/* Уведомление об успешном применении */}
      {successMessage && (
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* НОВОЕ: Уведомление о pending изменениях */}
      {pendingChanges.size > 0 && (
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Временные изменения:</strong> В {pendingChanges.size} {pendingChanges.size === 1 ? 'поддоне' : pendingChanges.size < 5 ? 'поддонах' : 'поддонах'} запланирована посадка. 
            Изменения будут применены после нажатия "Применить изменения".
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}