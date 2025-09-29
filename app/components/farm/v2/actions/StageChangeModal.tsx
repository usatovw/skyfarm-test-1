'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getCropById, getCurrentGrowthStage } from '@/data/cropsData';
import { Tray } from '@/types/farming';
import { AlertTriangle, ChevronRight } from 'lucide-react';

interface StageChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  tray: Tray | null;
}

export function StageChangeModal({ isOpen, onClose, onConfirm, tray }: StageChangeModalProps) {
  if (!tray || !tray.crop) return null;

  const crop = getCropById(tray.crop.cropId);
  if (!crop) return null;

  const currentStageInfo = getCurrentGrowthStage(crop, tray.crop.totalDaysGrowing);
  if (!currentStageInfo) return null;

  const nextStageIndex = currentStageInfo.stageIndex + 1;
  if (nextStageIndex >= crop.growthStages.length) return null;

  const currentStage = currentStageInfo.stage;
  const nextStage = crop.growthStages[nextStageIndex];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Переход к следующей стадии роста</DialogTitle>
          <DialogDescription>
            Вы уверены, что хотите перейти к следующей стадии роста?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Внимание:</strong> Переход к следующей стадии изменит параметры выращивания.
              Убедитесь, что растение готово к переходу.
            </AlertDescription>
          </Alert>

          <div className="flex items-center gap-4">
            {/* Текущая стадия */}
            <div className="flex-1 p-4 border-2 border-blue-500 rounded-lg bg-blue-50">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-3xl">{currentStage.icon}</div>
                <div>
                  <div className="font-semibold">Текущая стадия</div>
                  <div className="text-sm text-muted-foreground">{currentStage.name}</div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {currentStage.description}
              </div>
              <div className="text-xs mt-2">
                Дней в стадии: <strong>{currentStageInfo.daysInStage}</strong> из {currentStage.duration}
              </div>
            </div>

            <ChevronRight className="h-8 w-8 text-muted-foreground" />

            {/* Следующая стадия */}
            <div className="flex-1 p-4 border-2 border-green-500 rounded-lg bg-green-50">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-3xl">{nextStage.icon}</div>
                <div>
                  <div className="font-semibold">Следующая стадия</div>
                  <div className="text-sm text-muted-foreground">{nextStage.name}</div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {nextStage.description}
              </div>
              <div className="text-xs mt-2">
                Длительность: <strong>{nextStage.duration}</strong> дней
              </div>
            </div>
          </div>

          {/* Изменения параметров */}
          {currentStage.parameters && nextStage.parameters && (
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-3">Изменения параметров:</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-muted-foreground mb-1">Температура:</div>
                  <div>
                    <span className="line-through text-muted-foreground">
                      {currentStage.parameters.temperature.min}-{currentStage.parameters.temperature.max}°C
                    </span>
                    {' → '}
                    <span className="font-semibold text-green-600">
                      {nextStage.parameters.temperature.min}-{nextStage.parameters.temperature.max}°C
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-muted-foreground mb-1">Влажность:</div>
                  <div>
                    <span className="line-through text-muted-foreground">
                      {currentStage.parameters.humidity.min}-{currentStage.parameters.humidity.max}%
                    </span>
                    {' → '}
                    <span className="font-semibold text-green-600">
                      {nextStage.parameters.humidity.min}-{nextStage.parameters.humidity.max}%
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-muted-foreground mb-1">pH:</div>
                  <div>
                    <span className="line-through text-muted-foreground">
                      {currentStage.parameters.ph.min}-{currentStage.parameters.ph.max}
                    </span>
                    {' → '}
                    <span className="font-semibold text-green-600">
                      {nextStage.parameters.ph.min}-{nextStage.parameters.ph.max}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-muted-foreground mb-1">EC:</div>
                  <div>
                    <span className="line-through text-muted-foreground">
                      {currentStage.parameters.ec.min}-{currentStage.parameters.ec.max}
                    </span>
                    {' → '}
                    <span className="font-semibold text-green-600">
                      {nextStage.parameters.ec.min}-{nextStage.parameters.ec.max}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Подтвердить переход
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}