'use client'

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ContainerStatus, TrayStatus } from "@/types/farming";
import { mockCrops } from "@/data/mockData";
import { Sprout, Calendar, TrendingUp, Droplets } from 'lucide-react';

interface RackDetailProps {
  rackId: string;
  containerData: ContainerStatus;
  onTrayClick: (trayId: string) => void;
  onPlantAction?: (trayIds: string[]) => void; // Добавляем callback для посадки
  onClearPlanned?: (trayIds: string[], targetType: 'rack') => void; // Очистка запланированных
  onStopGrowing?: (trayIds: string[], targetType: 'rack') => void; // Остановка выращивания
}

export default function RackDetail({ rackId, containerData, onTrayClick, onPlantAction, onClearPlanned, onStopGrowing }: RackDetailProps) {
  const [selectedTrays, setSelectedTrays] = useState<Set<string>>(new Set());

  // Найти стойку в данных
  const rack = containerData.rows
    .flatMap(row => row.racks)
    .find(r => r.id === rackId);

  if (!rack) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Стойка не найдена</p>
        </CardContent>
      </Card>
    );
  }

  // Вычисляем типы выделенных поддонов
  const selectedPlannedTrays = new Set<string>();
  const selectedGrowingTrays = new Set<string>();
  const selectedEmptyTrays = new Set<string>();

  selectedTrays.forEach(trayId => {
    const tray = rack.trays.find(t => t.id === trayId);
    if (tray) {
      switch (tray.status) {
        case 'planned':
          selectedPlannedTrays.add(trayId);
          break;
        case 'growing':
        case 'ready':
          selectedGrowingTrays.add(trayId);
          break;
        case 'empty':
          selectedEmptyTrays.add(trayId);
          break;
      }
    }
  });

  const row = containerData.rows.find(r => r.racks.some(rack => rack.id === rackId));
  const rackDisplayName = `${row?.name}${rack.position}`;

  const handleTraySelect = useCallback((trayId: string, multi = false) => {
    setSelectedTrays(prev => {
      const newSelection = new Set(prev);
      if (multi) {
        if (newSelection.has(trayId)) {
          newSelection.delete(trayId);
        } else {
          newSelection.add(trayId);
        }
      } else {
        newSelection.clear();
        newSelection.add(trayId);
      }
      return newSelection;
    });
  }, []);

  const handleTrayDoubleClick = useCallback((trayId: string) => {
    onTrayClick(trayId);
  }, [onTrayClick]);

  const getTrayStatusColor = (tray: TrayStatus) => {
    switch (tray.status) {
      case 'empty': return 'bg-gray-100 border-gray-300';
      case 'planned': return 'bg-blue-100 border-blue-400 border-dashed';
      case 'growing': return 'bg-green-100 border-green-400';
      case 'ready': return 'bg-green-200 border-green-600';
      case 'error': return 'bg-red-100 border-red-400';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const getTrayDisplayInfo = (tray: TrayStatus) => {
    if (!tray.crop) return { crop: null, stage: 'Пусто', days: '' };
    
    const crop = mockCrops.find(c => c.id === tray.crop!.cropId);
    const stageName = crop?.growthStages.find(s => s.id === tray.crop!.currentStage)?.name || 'Неизвестно';
    const daysInfo = tray.crop.daysInStage ? `${tray.crop.daysInStage}д` : '';
    
    return {
      crop,
      stage: stageName,
      days: daysInfo
    };
  };

  const occupiedTrays = rack.trays.filter(t => t.status !== 'empty').length;
  const emptyTrays = rack.trays.filter(t => t.status === 'empty').length;
  const growingTrays = rack.trays.filter(t => t.status === 'growing').length;
  const readyTrays = rack.trays.filter(t => t.status === 'ready').length;
  const plannedTrays = rack.trays.filter(t => t.status === 'planned').length;

  return (
    <div className="space-y-6">
      {/* Заголовок стойки */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Grid3X3 className="h-5 w-5" />
                Стойка {rackDisplayName}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Ряд {row?.name}, позиция {rack.position}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-500">{emptyTrays}</p>
                <p className="text-xs text-muted-foreground">Пустых</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{plannedTrays}</p>
                <p className="text-xs text-muted-foreground">Планируется</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{growingTrays}</p>
                <p className="text-xs text-muted-foreground">Растет</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{readyTrays}</p>
                <p className="text-xs text-muted-foreground">Готово</p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Действия */}
      {selectedTrays.size > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Badge variant="secondary">
                Выбрано поддонов: {selectedTrays.size}
              </Badge>
              <div className="flex items-center gap-2">
                {selectedEmptyTrays.size > 0 && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onPlantAction?.(Array.from(selectedEmptyTrays))}
                  >
                    Засадить выбранные ({selectedEmptyTrays.size})
                  </Button>
                )}
                {selectedPlannedTrays.size > 0 && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onClearPlanned?.(Array.from(selectedPlannedTrays), 'rack')}
                  >
                    Очистить запланированные ({selectedPlannedTrays.size})
                  </Button>
                )}
                {selectedGrowingTrays.size > 0 && (
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => onStopGrowing?.(Array.from(selectedGrowingTrays), 'rack')}
                  >
                    Прекратить выращивание ({selectedGrowingTrays.size})
                  </Button>
                )}
                {(selectedGrowingTrays.size > 0 || selectedPlannedTrays.size > 0) && (
                  <Button size="sm" variant="outline">
                    Собрать урожай
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Схема поддонов */}
      <Card>
        <CardHeader>
          <CardTitle>Поддоны в стойке</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 max-h-[600px] overflow-y-auto">
            {rack.trays.map((tray) => {
              const { crop, stage, days } = getTrayDisplayInfo(tray);
              const isSelected = selectedTrays.has(tray.id);
              
              return (
                <div
                  key={tray.id}
                  className={cn(
                    "relative p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md",
                    getTrayStatusColor(tray),
                    isSelected && "ring-2 ring-blue-500 ring-offset-2"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    handleTraySelect(tray.id, e.ctrlKey || e.metaKey);
                  }}
                  onDoubleClick={() => handleTrayDoubleClick(tray.id)}
                >
                  {/* Номер поддона */}
                  <div className="absolute top-2 left-2">
                    <Badge variant="outline" className="text-xs">
                      {tray.position}
                    </Badge>
                  </div>

                  {/* Статус */}
                  <div className="absolute top-2 right-2">
                    {tray.status === 'growing' && <Sprout className="h-4 w-4 text-green-600" />}
                    {tray.status === 'ready' && <TrendingUp className="h-4 w-4 text-blue-600" />}
                    {tray.status === 'planned' && <Calendar className="h-4 w-4 text-blue-600" />}
                    {tray.status === 'error' && <Droplets className="h-4 w-4 text-red-600" />}
                  </div>

                  {/* Основная информация */}
                  <div className="mt-6 space-y-2">
                    {crop ? (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{crop.icon}</span>
                          <span className="font-medium text-foreground">{crop.name}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>{stage}</p>
                          {days && <p className="text-green-600">{days}</p>}
                        </div>
                        {tray.crop?.harvestDate && (
                          <div className="text-xs text-muted-foreground">
                            Сбор: {new Date(tray.crop.harvestDate).toLocaleDateString('ru-RU')}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <p className="text-sm">Пустой поддон</p>
                      </div>
                    )}
                  </div>

                  {/* Прогресс роста */}
                  {crop && tray.crop?.daysInStage !== undefined && (
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-green-600 h-1.5 rounded-full transition-all"
                          style={{ 
                            width: `${Math.min(100, (tray.crop.daysInStage / 14) * 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Подсказки */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Управление поддонами:</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Одиночный клик - выделить поддон</p>
              <p>• Ctrl/Cmd + клик - множественное выделение</p>
              <p>• Двойной клик - открыть детализацию поддона</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const Grid3X3 = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);