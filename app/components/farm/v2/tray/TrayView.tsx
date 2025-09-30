'use client';

import { Tray } from '@/types/farming';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { getCropById, getCurrentGrowthStage, crops } from '@/data/cropsData';
import { ArrowLeft, Calendar, Sprout, TrendingUp, ChevronRight, Droplets, Sun, Thermometer, Scissors, Trash2, StopCircle, Undo2 } from 'lucide-react';
import StopGrowingConfirmation from '../../StopGrowingConfirmation';
import { useState } from 'react';

interface TrayViewProps {
  tray: Tray;
  onBack: () => void;
  onStageChange?: () => void;
  onPlant?: () => void;
  onHarvest?: () => void;
  onClear?: () => void;
  onStop?: () => void;
  onCancelStop?: () => void;
  containerData?: any; // Container data for confirmation modal
}

export function TrayView({ tray, onBack, onStageChange, onPlant, onHarvest, onClear, onStop, onCancelStop, containerData }: TrayViewProps) {
  const [showStopConfirmation, setShowStopConfirmation] = useState(false);

  const crop = tray.crop ? getCropById(tray.crop.cropId) : null;
  const stageInfo = crop && tray.crop
    ? getCurrentGrowthStage(crop, tray.crop.totalDaysGrowing)
    : null;

  const handleStopWithConfirmation = () => {
    if (!['empty', 'harvested'].includes(tray.status)) {
      setShowStopConfirmation(true);
    }
  };

  const handleConfirmStop = (selectedTrayIds: string[]) => {
    if (onStop && selectedTrayIds.includes(tray.id)) {
      onStop();
    }
    setShowStopConfirmation(false);
  };

  const handleCancelStop = () => {
    setShowStopConfirmation(false);
  };

  return (
    <div className="space-y-6">
      {/* Хедер */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Поддон {tray.position}</h2>
          <div className="text-sm text-muted-foreground">
            ID: {tray.id}
          </div>
        </div>
      </div>

      {/* Действия с поддоном */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-2">
          {tray.status === 'empty' && onPlant && (
            <Button onClick={onPlant} className="flex-1 min-w-32">
              <Sprout className="mr-2 h-4 w-4" />
              Засадить
            </Button>
          )}

          {tray.status === 'planned' && onClear && (
            <Button onClick={onClear} variant="outline" className="flex-1 min-w-32">
              <Trash2 className="mr-2 h-4 w-4" />
              Очистить
            </Button>
          )}

          {tray.status === 'growing' && onStop && (
            <Button onClick={handleStopWithConfirmation} variant="destructive" className="flex-1 min-w-40">
              <StopCircle className="mr-2 h-4 w-4" />
              Прекратить выращивание
            </Button>
          )}

          {tray.status === 'ready' && onHarvest && (
            <Button onClick={onHarvest} className="flex-1 min-w-32">
              <Scissors className="mr-2 h-4 w-4" />
              Собрать урожай
            </Button>
          )}

          {tray.status === 'harvested' && onClear && (
            <Button onClick={onClear} variant="outline" className="flex-1 min-w-32">
              <Trash2 className="mr-2 h-4 w-4" />
              Очистить поддон
            </Button>
          )}

          {tray.status === 'stop_pending' && onCancelStop && (
            <Button onClick={onCancelStop} variant="outline" className="flex-1 min-w-40">
              <Undo2 className="mr-2 h-4 w-4" />
              Отменить прекращение
            </Button>
          )}
        </div>
      </Card>

      {/* Основная информация */}
      {tray.status === 'empty' ? (
        <Card className="p-8 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-bold mb-2">Поддон пуст</h3>
          <p className="text-muted-foreground">
            Готов к использованию для новой посадки
          </p>
        </Card>
      ) : tray.crop && crop ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Левая колонка - информация о культуре */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-6">
                {(() => {
                  const cropData = crops.find(c => c.id === tray.crop?.cropId);
                  return cropData?.image ? (
                    <img
                      src={cropData.image}
                      alt={cropData.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="text-6xl">{crop?.icon}</div>
                  );
                })()}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold">{crop.name}</h3>
                  <Badge className="mt-2" style={{ backgroundColor: crop.color }}>
                    {tray.status === 'growing' && 'Растет'}
                    {tray.status === 'planned' && 'Запланировано'}
                    {tray.status === 'ready' && 'Готово к сбору'}
                    {tray.status === 'harvested' && 'Собрано'}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Прогресс роста</span>
                    <span className="font-semibold">{Math.round(tray.crop.stageProgress)}%</span>
                  </div>
                  <Progress value={tray.crop.stageProgress} className="h-3" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Calendar className="h-4 w-4" />
                      Посажено
                    </div>
                    <div className="font-semibold">
                      {new Date(tray.crop.plantedDate).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <TrendingUp className="h-4 w-4" />
                      Дней растет
                    </div>
                    <div className="font-semibold">{tray.crop.totalDaysGrowing}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Sprout className="h-4 w-4" />
                      До сбора
                    </div>
                    <div className="font-semibold">
                      {crop.totalGrowthDays - tray.crop.totalDaysGrowing} дней
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Calendar className="h-4 w-4" />
                      Сбор урожая
                    </div>
                    <div className="font-semibold">
                      {new Date(tray.crop.estimatedHarvestDate).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Стадии роста */}
            <Card className="p-6">
              <h4 className="font-semibold mb-4">Стадии роста</h4>
              <div className="space-y-3">
                {crop.growthStages.map((stage, index) => {
                  const isCurrentStage = stageInfo && stageInfo.stageIndex === index;
                  const isPastStage = stageInfo && stageInfo.stageIndex > index;

                  return (
                    <div key={stage.id} className="relative">
                      <div
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                          isCurrentStage
                            ? 'bg-primary/10 border-2 border-primary'
                            : isPastStage
                            ? 'bg-muted opacity-60'
                            : 'bg-muted/30'
                        }`}
                      >
                        <div className="text-2xl">{stage.icon}</div>
                        <div className="flex-1">
                          <div className="font-semibold">{stage.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {stage.duration} дней • {stage.description}
                          </div>
                        </div>
                        {isCurrentStage && (
                          <Badge variant="default">Текущая</Badge>
                        )}
                        {isPastStage && (
                          <div className="text-green-600">✓</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {stageInfo && stageInfo.stageIndex < crop.growthStages.length - 1 && onStageChange && (
                <Button
                  onClick={onStageChange}
                  className="w-full mt-4"
                  variant="outline"
                >
                  Перейти к следующей стадии
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </Card>
          </div>

          {/* Правая колонка - параметры */}
          <div className="space-y-6">
            <Card className="p-6">
              <h4 className="font-semibold mb-4">Текущие параметры</h4>
              {stageInfo?.stage.parameters && (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Thermometer className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium">Температура</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {stageInfo.stage.parameters.temperature.min}-{stageInfo.stage.parameters.temperature.max}°C
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Влажность</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {stageInfo.stage.parameters.humidity.min}-{stageInfo.stage.parameters.humidity.max}%
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Sun className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium">pH</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {stageInfo.stage.parameters.ph.min}-{stageInfo.stage.parameters.ph.max}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Sprout className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">EC (µS/см)</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {stageInfo.stage.parameters.ec.min}-{stageInfo.stage.parameters.ec.max}
                    </div>
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h4 className="font-semibold mb-4">Требования культуры</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Температура:</span>
                  <span className="font-medium">
                    {crop.climateRequirements.temperature.min}-{crop.climateRequirements.temperature.max}°C
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Влажность:</span>
                  <span className="font-medium">
                    {crop.climateRequirements.humidity.min}-{crop.climateRequirements.humidity.max}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">pH:</span>
                  <span className="font-medium">
                    {crop.climateRequirements.ph.min}-{crop.climateRequirements.ph.max}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">EC:</span>
                  <span className="font-medium">
                    {crop.climateRequirements.ec.min}-{crop.climateRequirements.ec.max} µS/см
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Общий цикл:</span>
                  <span className="font-medium">{crop.totalGrowthDays} дней</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : null}

      {/* Модалка подтверждения остановки */}
      {containerData && (
        <StopGrowingConfirmation
          isOpen={showStopConfirmation}
          onClose={handleCancelStop}
          onConfirm={handleConfirmStop}
          targetIds={[tray.id]}
          targetType="tray"
          containerData={containerData}
        />
      )}
    </div>
  );
}