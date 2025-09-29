'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { crops, getAvailableCropsForContainer, getCropById } from '@/data/cropsData';
import { Container } from '@/types/farming';
import { AlertTriangle, Check } from 'lucide-react';

interface CropSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (cropId: string) => void;
  container: Container;
  selectedCount: number;
}

export function CropSelectorModal({
  isOpen,
  onClose,
  onSelect,
  container,
  selectedCount
}: CropSelectorModalProps) {
  // Получаем существующие культуры в контейнере
  const existingCropIds = container.rows
    .flatMap(r => r.racks)
    .flatMap(r => r.trays)
    .filter(t => t.crop && (t.status === 'growing' || t.status === 'planned'))
    .map(t => t.crop!.cropId);

  const uniqueExistingCropIds = Array.from(new Set(existingCropIds));

  // Получаем доступные и заблокированные культуры
  const { available, blocked } = getAvailableCropsForContainer(uniqueExistingCropIds);

  const handleSelect = (cropId: string) => {
    onSelect(cropId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Выбор культуры для посадки</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Информация о выборе */}
          <Alert>
            <AlertDescription>
              Выбрано для посадки: <strong>{selectedCount}</strong> {selectedCount === 1 ? 'поддон' : selectedCount < 5 ? 'поддона' : 'поддонов'}
            </AlertDescription>
          </Alert>

          {/* Существующие культуры в контейнере */}
          {uniqueExistingCropIds.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-2">Уже выращиваются:</div>
              <div className="flex flex-wrap gap-2">
                {uniqueExistingCropIds.map(cropId => {
                  const crop = getCropById(cropId);
                  return (
                    <Badge key={cropId} variant="secondary" className="text-base">
                      {crop?.icon} {crop?.name}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {/* Доступные культуры */}
          <div>
            <div className="text-sm font-medium mb-3">Доступные культуры:</div>
            <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
              {available.map(crop => {
                const isExisting = uniqueExistingCropIds.includes(crop.id);
                return (
                  <Card
                    key={crop.id}
                    className={cn(
                      'p-4 cursor-pointer transition-all hover:scale-105 hover:shadow-md',
                      'border-2'
                    )}
                    style={{ borderColor: crop.color }}
                    onClick={() => handleSelect(crop.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-4xl">{crop.icon}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-lg">{crop.name}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Рост: {crop.totalGrowthDays} дней
                        </div>
                        {isExisting && (
                          <Badge variant="outline" className="mt-2">
                            <Check className="h-3 w-3 mr-1" />
                            Уже растет
                          </Badge>
                        )}
                        <div className="mt-2 text-xs space-y-1">
                          <div>T: {crop.climateRequirements.temperature.min}-{crop.climateRequirements.temperature.max}°C</div>
                          <div>pH: {crop.climateRequirements.ph.min}-{crop.climateRequirements.ph.max}</div>
                          <div>EC: {crop.climateRequirements.ec.min}-{crop.climateRequirements.ec.max}</div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Несовместимые культуры */}
          {blocked.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-3 text-red-600 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Несовместимые культуры:
              </div>
              <div className="grid grid-cols-2 gap-3 max-h-[200px] overflow-y-auto">
                {blocked.map(({ crop, reasons }) => (
                  <Card
                    key={crop.id}
                    className="p-4 bg-red-50 border-red-200 opacity-60"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-3xl opacity-50">{crop.icon}</div>
                      <div className="flex-1">
                        <div className="font-semibold">{crop.name}</div>
                        <div className="text-xs text-red-600 mt-2">
                          {reasons[0]}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}