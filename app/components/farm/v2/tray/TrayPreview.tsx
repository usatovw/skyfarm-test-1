'use client';

import { Tray } from '@/types/farming';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getCropById } from '@/data/cropsData';
import { Calendar, Sprout, TrendingUp, Scissors, Trash2, Undo2, StopCircle, ArrowRight } from 'lucide-react';

interface TrayPreviewProps {
  tray: Tray | null | undefined;
  onPlant?: () => void;
  onHarvest?: () => void;
  onClear?: () => void;
  onCancelStop?: () => void;
  onStop?: () => void;
  onEnterTray?: () => void;
}

export function TrayPreview({ tray, onPlant, onHarvest, onClear, onCancelStop, onStop, onEnterTray }: TrayPreviewProps) {
  if (!tray) {
    return (
      <Card className="p-8 text-center">
        <div className="text-muted-foreground">
          Выберите поддон для просмотра информации
        </div>
      </Card>
    );
  }

  if (tray.status === 'empty') {
    return (
      <Card className="p-8">
        <div className="text-center space-y-4">
          <div className="text-4xl">📭</div>
          <div className="text-lg font-semibold">Поддон пуст</div>
          <div className="text-sm text-muted-foreground">
            Поддон № {tray.position} готов к использованию
          </div>
          <div className="space-y-2">
            {onPlant && (
              <Button onClick={onPlant} className="w-full">
                <Sprout className="mr-2 h-4 w-4" />
                Засадить
              </Button>
            )}
            {onEnterTray && (
              <Button onClick={onEnterTray} variant="outline" className="w-full">
                <ArrowRight className="mr-2 h-4 w-4" />
                Перейти в поддон
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  }

  if (tray.status === 'planned') {
    const crop = getCropById(tray.crop!.cropId);
    return (
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{crop?.icon}</div>
          <div>
            <div className="text-xl font-bold">{crop?.name}</div>
            <div className="text-sm text-blue-600">Запланировано</div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Посадка будет активирована после применения изменений
        </div>
        <div className="space-y-2">
          {onClear && (
            <Button onClick={onClear} variant="outline" className="w-full">
              <Trash2 className="mr-2 h-4 w-4" />
              Очистить
            </Button>
          )}
          {onEnterTray && (
            <Button onClick={onEnterTray} variant="outline" className="w-full">
              <ArrowRight className="mr-2 h-4 w-4" />
              Перейти в поддон
            </Button>
          )}
        </div>
      </Card>
    );
  }

  if (tray.status === 'growing' && tray.crop) {
    const crop = getCropById(tray.crop.cropId);
    const daysLeft = crop ? crop.totalGrowthDays - tray.crop.totalDaysGrowing : 0;

    return (
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{crop?.icon}</div>
          <div className="flex-1">
            <div className="text-xl font-bold">{crop?.name}</div>
            <div className="text-sm text-green-600">Растет</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Прогресс роста</span>
            <span className="font-semibold">{Math.round(tray.crop.stageProgress)}%</span>
          </div>
          <Progress value={tray.crop.stageProgress} />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Посажено
            </div>
            <div className="font-semibold">
              {new Date(tray.crop.plantedDate).toLocaleDateString('ru-RU')}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              Дней растет
            </div>
            <div className="font-semibold">{tray.crop.totalDaysGrowing}</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sprout className="h-4 w-4" />
              До сбора
            </div>
            <div className="font-semibold">{daysLeft} дней</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Сбор
            </div>
            <div className="font-semibold">
              {new Date(tray.crop.estimatedHarvestDate).toLocaleDateString('ru-RU')}
            </div>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="text-sm text-muted-foreground">Стадия роста</div>
          <div className="font-semibold capitalize">{tray.crop.currentStage}</div>
        </div>

        <div className="space-y-2">
          {onStop && (
            <Button onClick={onStop} variant="destructive" className="w-full">
              <StopCircle className="mr-2 h-4 w-4" />
              Прекратить выращивание
            </Button>
          )}
          {onEnterTray && (
            <Button onClick={onEnterTray} variant="outline" className="w-full">
              <ArrowRight className="mr-2 h-4 w-4" />
              Перейти в поддон
            </Button>
          )}
        </div>
      </Card>
    );
  }

  if (tray.status === 'ready' && tray.crop) {
    const crop = getCropById(tray.crop.cropId);
    return (
      <Card className="p-6 space-y-4 bg-emerald-50">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{crop?.icon}</div>
          <div>
            <div className="text-xl font-bold">{crop?.name}</div>
            <div className="text-sm text-emerald-600 font-semibold">✓ Готов к сбору</div>
          </div>
        </div>
        <div className="text-sm">
          Выращивание завершено. Можно собирать урожай.
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Посажено</div>
            <div className="font-semibold">
              {new Date(tray.crop.plantedDate).toLocaleDateString('ru-RU')}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Выращено</div>
            <div className="font-semibold">{tray.crop.totalDaysGrowing} дней</div>
          </div>
        </div>
        <div className="space-y-2">
          {onHarvest && (
            <Button onClick={onHarvest} className="w-full">
              <Scissors className="mr-2 h-4 w-4" />
              Собрать урожай
            </Button>
          )}
          {onEnterTray && (
            <Button onClick={onEnterTray} variant="outline" className="w-full">
              <ArrowRight className="mr-2 h-4 w-4" />
              Перейти в поддон
            </Button>
          )}
        </div>
      </Card>
    );
  }

  if (tray.status === 'harvested') {
    return (
      <Card className="p-6 space-y-4 bg-yellow-50">
        <div className="text-center space-y-3">
          <div className="text-4xl">📦</div>
          <div className="text-lg font-bold">Урожай собран</div>
          <div className="text-sm text-muted-foreground">
            Поддон требует очистки перед следующей посадкой
          </div>
          <div className="space-y-2">
            {onClear && (
              <Button onClick={onClear} variant="outline" className="w-full">
                <Trash2 className="mr-2 h-4 w-4" />
                Очистить поддон
              </Button>
            )}
            {onEnterTray && (
              <Button onClick={onEnterTray} variant="outline" className="w-full">
                <ArrowRight className="mr-2 h-4 w-4" />
                Перейти в поддон
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  }

  if (tray.status === 'stop_pending') {
    const crop = getCropById(tray.crop!.cropId);
    return (
      <Card className="p-6 space-y-4 bg-orange-50">
        <div className="flex items-center gap-3">
          <div className="text-4xl">⚠️</div>
          <div>
            <div className="text-xl font-bold">{crop?.name}</div>
            <div className="text-sm text-orange-600 font-semibold">
              Помечен на прекращение
            </div>
          </div>
        </div>
        <div className="text-sm">
          Выращивание будет остановлено после применения изменений.
          Культура будет удалена.
        </div>
        <div className="space-y-2">
          {onCancelStop && (
            <Button onClick={onCancelStop} variant="outline" className="w-full">
              <Undo2 className="mr-2 h-4 w-4" />
              Отменить прекращение
            </Button>
          )}
          {onEnterTray && (
            <Button onClick={onEnterTray} variant="outline" className="w-full">
              <ArrowRight className="mr-2 h-4 w-4" />
              Перейти в поддон
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="text-sm text-muted-foreground">
        Статус: {tray.status}
      </div>
    </Card>
  );
}