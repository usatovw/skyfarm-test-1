'use client'

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { ChangesDraft, ContainerStatus } from "@/types/farming";
import { mockCrops } from "@/data/mockData";
import {
  Check,
  AlertTriangle,
  Sprout,
  Trash2,
  Calendar,
  Target,
  Clock
} from 'lucide-react';

interface ChangesSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  changes: ChangesDraft;
  onApply: (selectedActionIds: string[]) => void;
  containerData: ContainerStatus;
}

export default function ChangesSummary({
  isOpen,
  onClose,
  changes,
  onApply,
  containerData
}: ChangesSummaryProps) {
  const [isApplying, setIsApplying] = useState(false);
  const [selectedActions, setSelectedActions] = useState<Set<string>>(new Set());

  // Инициализируем выбранные действия только при первом открытии модалки
  useEffect(() => {
    if (isOpen) {
      const actionIds = changes.plannedActions.map(a => a.id);
      setSelectedActions(new Set(actionIds));
    }
  }, [isOpen]); // УБИРАЕМ зависимость от changes.plannedActions!

  const handleApply = async () => {
    if (selectedCount === 0) return;

    setIsApplying(true);
    try {
      console.log('🚀 Начинаем применение изменений...');
      // Имитация задержки применения с более реалистичным временем
      await new Promise(resolve => setTimeout(resolve, 3000));
      console.log('✅ Изменения успешно применены!');
      onApply(Array.from(selectedActions));
    } catch (error) {
      console.error('❌ Ошибка при применении изменений:', error);
      // TODO: Показать toast с ошибкой
    } finally {
      setIsApplying(false);
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'plant': return <Sprout className="h-4 w-4 text-green-600" />;
      case 'harvest': return <Target className="h-4 w-4 text-blue-600" />;
      case 'clear': return <Trash2 className="h-4 w-4 text-orange-600" />;
      case 'stop_growing': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Calendar className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionLabel = (type: string) => {
    switch (type) {
      case 'plant': return 'Посадка';
      case 'harvest': return 'Сбор урожая';
      case 'clear': return 'Очистка запланированных';
      case 'stop_growing': return 'Принудительная остановка';
      default: return 'Неизвестное действие';
    }
  };

  const getTargetLabel = (targetType: string, targetIds: string[]) => {
    const count = targetIds.length;
    switch (targetType) {
      case 'row': {
        if (count === 1) {
          const row = containerData.rows.find(r => r.id === targetIds[0]);
          return row ? `Ряд ${row.name}` : `1 ряд`;
        }
        return `${count} ${count < 5 ? 'ряда' : 'рядов'}`;
      }
      case 'rack': {
        if (count === 1) {
          const rack = containerData.rows
            .flatMap(row => row.racks)
            .find(r => r.id === targetIds[0]);
          if (rack) {
            const row = containerData.rows.find(r => r.racks.some(ra => ra.id === rack.id));
            return `Ряд ${row?.name} → Стойка ${rack.position}`;
          }
        }
        return `${count} ${count < 5 ? 'стойки' : 'стоек'}`;
      }
      case 'tray': {
        if (count === 1) {
          const tray = containerData.rows
            .flatMap(row => row.racks)
            .flatMap(rack => rack.trays)
            .find(t => t.id === targetIds[0]);
          if (tray) {
            const rack = containerData.rows
              .flatMap(row => row.racks)
              .find(r => r.trays.some(tr => tr.id === tray.id));
            const row = containerData.rows.find(r => r.racks.some(ra => ra.id === rack?.id));
            return `Ряд ${row?.name} → Стойка ${rack?.position} → Поддон ${tray.position}`;
          }
        }
        return `${count} ${count < 5 ? 'поддона' : 'поддонов'}`;
      }
      default: return `${count} элементов`;
    }
  };

  // НОВАЯ ФУНКЦИЯ: Получение детальной информации о поддонах
  const getTrayDetails = (targetIds: string[]) => {
    const trayDetails: Array<{ trayId: string; location: string }> = [];
    
    targetIds.forEach(trayId => {
      // Ищем поддон в структуре контейнера
      containerData.rows.forEach(row => {
        row.racks.forEach(rack => {
          const tray = rack.trays.find(t => t.id === trayId);
          if (tray) {
            trayDetails.push({
              trayId,
              location: `Ряд ${row.name} → Стойка ${rack.position} → Поддон ${tray.position}`
            });
          }
        });
      });
    });

    return trayDetails;
  };

  // Функция для получения всех затронутых поддонов для действия
  const getAllAffectedTrays = (action: any) => {
    const allTrayIds: string[] = [];

    if (action.targetType === 'row') {
      action.targetIds.forEach((rowId: string) => {
        const row = containerData.rows.find(r => r.id === rowId);
        if (row) {
          row.racks.forEach(rack => {
            rack.trays.forEach(tray => {
              if (tray.status === 'empty') { // Только пустые поддоны
                allTrayIds.push(tray.id);
              }
            });
          });
        }
      });
    } else if (action.targetType === 'rack') {
      action.targetIds.forEach((rackId: string) => {
        const rack = containerData.rows
          .flatMap(row => row.racks)
          .find(r => r.id === rackId);
        if (rack) {
          rack.trays.forEach(tray => {
            if (tray.status === 'empty') { // Только пустые поддоны
              allTrayIds.push(tray.id);
            }
          });
        }
      });
    } else if (action.targetType === 'tray') {
      allTrayIds.push(...action.targetIds);
    }

    return allTrayIds;
  };

  const toggleAction = (actionId: string) => {
    setSelectedActions(prev => {
      const next = new Set(prev);
      if (next.has(actionId)) {
        next.delete(actionId);
      } else {
        next.add(actionId);
      }
      return next;
    });
  };

  const calculateAffectedTrays = () => {
    let totalTrays = 0;

    changes.plannedActions.forEach(action => {
      if (selectedActions.has(action.id)) {
        const allTrayIds = getAllAffectedTrays(action);
        totalTrays += allTrayIds.length;
      }
    });

    return totalTrays;
  };

  const affectedTraysCount = calculateAffectedTrays();
  const selectedCount = selectedActions.size;
  const estimatedDuration = selectedCount * 5; // 5 минут на действие

  if (changes.plannedActions.length === 0) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] !max-w-[1400px] max-h-[90vh] overflow-y-auto" style={{ width: '95vw', maxWidth: '1400px' }}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Check className="h-5 w-5" />
            Применение изменений
          </DialogTitle>
          <DialogDescription>
            Проверьте планируемые изменения перед применением.
            После подтверждения процессы выращивания будут запущены.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex flex-col overflow-y-auto" style={{ maxHeight: '70vh' }}>
          {/* Сводка */}
          <Card className="flex-shrink-0">
            <CardHeader>
              <CardTitle className="text-base">Сводка изменений</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {selectedCount}/{changes.plannedActions.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Действий</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{affectedTraysCount}</p>
                  <p className="text-sm text-muted-foreground">Поддонов</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{estimatedDuration}м</p>
                  <p className="text-sm text-muted-foreground">Время</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Список действий */}
          <Card className="flex-1 min-h-0">
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                Планируемые действия
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {selectedCount} из {changes.plannedActions.length} выбрано
                  </Badge>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 px-2"
                      onClick={() => setSelectedActions(new Set(changes.plannedActions.map(a => a.id)))}
                    >
                      Все
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 px-2"
                      onClick={() => setSelectedActions(new Set())}
                    >
                      Нет
                    </Button>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full">
              <div className="space-y-4 h-full overflow-y-auto" style={{ maxHeight: '50vh' }}>
                {changes.plannedActions.map((action, index) => {
                  const crop = action.cropId ? mockCrops.find(c => c.id === action.cropId) : null;
                  const allAffectedTrays = getAllAffectedTrays(action);
                  const trayDetails = getTrayDetails(allAffectedTrays);
                  
                  const isSelected = selectedActions.has(action.id);

                  return (
                    <div
                      key={action.id}
                      className={`border rounded-lg overflow-hidden transition-all cursor-pointer ${
                        isSelected
                          ? 'border-primary bg-background shadow-sm'
                          : 'border-muted bg-muted/10 hover:bg-muted/20'
                      }`}
                      onClick={() => toggleAction(action.id)}
                    >
                      {/* Заголовок действия */}
                      <div className={`flex items-start gap-3 p-3 transition-colors ${
                        isSelected ? 'bg-muted/30' : 'bg-muted/10'
                      }`}>
                        <div className="flex-shrink-0 mr-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleAction(action.id)}
                            className="w-5 h-5 border-2 border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                        </div>
                        <div className="flex-shrink-0 mt-0.5">
                          {getActionIcon(action.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`font-medium transition-colors ${
                              isSelected ? 'text-foreground' : 'text-muted-foreground'
                            }`}>
                              {getActionLabel(action.type)}
                            </span>
                            {crop && (
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <span>{crop.icon}</span>
                                {crop.name}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Цель: {getTargetLabel(action.targetType, action.targetIds)} → {allAffectedTrays.length} поддонов
                          </p>
                          {action.scheduledDate && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <Clock className="h-3 w-3" />
                              {new Date(action.scheduledDate).toLocaleString('ru-RU')}
                            </p>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                          <span className="text-xs text-muted-foreground">#{index + 1}</span>
                        </div>
                      </div>

                      {/* Детальный список поддонов */}
                      {trayDetails.length > 0 && (
                        <div className="p-3 border-t bg-background">
                          <h4 className="text-sm font-medium text-foreground mb-2">
                            Затронутые поддоны ({trayDetails.length}):
                          </h4>
                          <div className="grid grid-cols-1 gap-1 max-h-32 overflow-y-auto">
                            {trayDetails.map((detail, trayIndex) => (
                              <div 
                                key={detail.trayId} 
                                className="text-xs text-muted-foreground p-1 rounded bg-muted/20"
                              >
                                {detail.location}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Предупреждения и детали - вне скролл области */}
        <div className="space-y-4 flex-shrink-0">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Важно:</strong> После применения изменений автоматически запустятся
              процессы полива, освещения и климат-контроля. Отменить изменения будет невозможно.
              <br />
              <span className="text-muted-foreground text-xs mt-1 block">
                💡 Снимите галки с действий, которые не нужно выполнять. Все действия остаются видимыми для повторного выбора.
              </span>
            </AlertDescription>
          </Alert>

          {/* Детали выполнения */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Что произойдет</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Проверка совместимости культур с текущим режимом</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Подготовка поддонов и стоек</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Настройка автоматических систем</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Запуск процессов выращивания</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Обновление мониторинга</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Действия */}
        <div className="flex items-center justify-between pt-4 border-t bg-background sticky bottom-0">
          <div className="text-sm text-muted-foreground">
            {selectedCount === 0 ? (
              <span className="text-orange-600">Выберите хотя бы одно действие</span>
            ) : (
              <span>Применить {selectedCount} {selectedCount === 1 ? 'действие' : selectedCount < 5 ? 'действия' : 'действий'}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose} disabled={isApplying}>
              Отмена
            </Button>
            <Button
              onClick={handleApply}
              disabled={isApplying || selectedCount === 0}
              className="min-w-[120px]"
            >
              {isApplying ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Применение...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Применить
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}