'use client'

import { useState, useCallback, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from "@/components/ui/context-menu";
import { ContainerStatus, SelectionState, RackStatus } from "@/types/farming";
import { Sprout, Eye, Trash2, Grid3X3, AlertTriangle } from 'lucide-react';

interface ContainerGridProps {
  containerData: ContainerStatus;
  selectionState: SelectionState;
  onSelectionChange: (selection: SelectionState) => void;
  onRackClick: (rackId: string) => void;
  onPlantAction?: () => void; // Добавляем пропс для действия посадки
  onClearPlanned?: (targetIds: string[], targetType: 'rack') => void; // Очистка запланированных
  onStopGrowing?: (targetIds: string[], targetType: 'rack') => void; // Остановка выращивания
}

export default function ContainerGrid({ 
  containerData, 
  selectionState, 
  onSelectionChange, 
  onRackClick,
  onPlantAction,
  onClearPlanned,
  onStopGrowing
}: ContainerGridProps) {
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleRackSelect = useCallback((rackId: string, multi = false) => {
    const newSelection = { ...selectionState };
    
    if (multi) {
      if (newSelection.selectedRacks.has(rackId)) {
        newSelection.selectedRacks.delete(rackId);
      } else {
        newSelection.selectedRacks.add(rackId);
      }
    } else {
      newSelection.selectedRacks = new Set([rackId]);
      newSelection.selectedRows.clear();
      newSelection.selectedTrays.clear();
    }
    
    onSelectionChange(newSelection);
  }, [selectionState, onSelectionChange]);

  const handleRowSelect = useCallback((rowId: string) => {
    const newSelection = { ...selectionState };
    const row = containerData.rows.find(r => r.id === rowId);
    
    if (row) {
      if (newSelection.selectedRows.has(rowId)) {
        // Убираем выделение с ряда и всех его стоек
        newSelection.selectedRows.delete(rowId);
        row.racks.forEach(rack => {
          newSelection.selectedRacks.delete(rack.id);
        });
      } else {
        // Выделяем весь ряд
        newSelection.selectedRows.add(rowId);
        row.racks.forEach(rack => {
          newSelection.selectedRacks.add(rack.id);
        });
      }
    }
    
    onSelectionChange(newSelection);
  }, [selectionState, onSelectionChange, containerData]);

  const handleRackDoubleClick = useCallback((rackId: string) => {
    onRackClick(rackId);
  }, [onRackClick]);

  const getOccupancyColor = (rack: RackStatus) => {
    const percentage = (rack.occupiedTrays / rack.totalTrays) * 100;
    if (percentage === 0) return 'bg-gray-100';
    if (percentage < 50) return 'bg-yellow-100';
    if (percentage < 100) return 'bg-green-100';
    return 'bg-green-200';
  };

  const getOccupancyBorderColor = (rack: RackStatus) => {
    const percentage = (rack.occupiedTrays / rack.totalTrays) * 100;
    if (percentage === 0) return 'border-gray-300';
    if (percentage < 50) return 'border-yellow-400';
    if (percentage < 100) return 'border-green-400';
    return 'border-green-600';
  };

  // Мемоизация проверок выделения для оптимизации
  const isRackSelected = useCallback((rackId: string) => 
    selectionState.selectedRacks.has(rackId), [selectionState.selectedRacks]);
  const isRowSelected = useCallback((rowId: string) => 
    selectionState.selectedRows.has(rowId), [selectionState.selectedRows]);

  // Мемоизация статистики для избежания пересчета
  const containerStats = useMemo(() => ({
    totalTrays: containerData.rows.reduce((sum, row) => sum + row.totalTrays, 0),
    occupiedTrays: containerData.rows.reduce((sum, row) => sum + row.occupiedTrays, 0),
    fullRacks: containerData.rows.flatMap(row => row.racks).filter(rack => rack.status === 'full').length
  }), [containerData]);

  return (
    <div className="space-y-6">
      {/* Статистика контейнера */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-foreground">
                {containerStats.occupiedTrays}
              </p>
              <p className="text-sm text-muted-foreground">Занято поддонов</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {containerStats.totalTrays}
              </p>
              <p className="text-sm text-muted-foreground">Всего поддонов</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {Math.round((containerStats.occupiedTrays / containerStats.totalTrays) * 100)}%
              </p>
              <p className="text-sm text-muted-foreground">Заполненность</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {containerStats.fullRacks}
              </p>
              <p className="text-sm text-muted-foreground">Полных стоек</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Легенда */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-foreground">Легенда</h3>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                <span className="text-muted-foreground">Пусто</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-100 border border-yellow-400 rounded"></div>
                <span className="text-muted-foreground">Частично</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 border border-green-400 rounded"></div>
                <span className="text-muted-foreground">Заполнено</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-200 border border-green-600 rounded"></div>
                <span className="text-muted-foreground">Полностью</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Сетка рядов и стоек */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {containerData.rows.map((row) => (
              <div key={row.id} className="space-y-3">
                {/* Заголовок ряда */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant={isRowSelected(row.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleRowSelect(row.id)}
                      className="w-12 h-8"
                    >
                      {row.name}
                    </Button>
                    <div className="text-sm text-muted-foreground">
                      {row.occupiedTrays}/{row.totalTrays} поддонов
                    </div>
                  </div>
                  <Badge variant="secondary">
                    Ряд {row.name}
                  </Badge>
                </div>

                {/* Стойки в ряду */}
                <div className="grid grid-cols-10 gap-2">
                  {row.racks.map((rack) => (
                    <ContextMenu key={rack.id}>
                      <ContextMenuTrigger>
                        <div
                          className={cn(
                            "relative h-16 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 hover:z-10",
                            getOccupancyColor(rack),
                            getOccupancyBorderColor(rack),
                            isRackSelected(rack.id) && "ring-2 ring-blue-500 ring-offset-2"
                          )}
                          onClick={(e) => {
                            e.preventDefault();
                            handleRackSelect(rack.id, e.ctrlKey || e.metaKey);
                          }}
                          onDoubleClick={() => handleRackDoubleClick(rack.id)}
                        >
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-1">
                            <div className="text-xs font-medium text-foreground">
                              {rack.position}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {rack.occupiedTrays}/10
                            </div>
                            {rack.occupiedTrays > 0 && (
                              <div className="absolute top-1 right-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem 
                          onClick={() => {
                            handleRackSelect(rack.id);
                            onPlantAction && onPlantAction();
                          }}
                          className="flex items-center gap-2"
                        >
                          <Sprout className="h-4 w-4" />
                          Засадить стойку
                        </ContextMenuItem>
                        <ContextMenuItem 
                          onClick={() => onRackClick(rack.id)}
                          className="flex items-center gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          Открыть стойку
                        </ContextMenuItem>
                        <ContextMenuItem 
                          onClick={() => onClearPlanned?.([rack.id], 'rack')}
                          className="flex items-center gap-2 text-orange-600"
                        >
                          <Trash2 className="h-4 w-4" />
                          Очистить запланированные
                        </ContextMenuItem>
                        <ContextMenuItem 
                          onClick={() => onStopGrowing?.([rack.id], 'rack')}
                          className="flex items-center gap-2 text-destructive"
                        >
                          <AlertTriangle className="h-4 w-4" />
                          Прекратить выращивание
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Подсказки по управлению */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Управление:</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Одиночный клик - выделить стойку</p>
              <p>• Ctrl/Cmd + клик - множественное выделение</p>
              <p>• Двойной клик - открыть детализацию стойки</p>
              <p>• Правый клик - контекстное меню</p>
              <p>• Кнопка ряда - выделить весь ряд</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}