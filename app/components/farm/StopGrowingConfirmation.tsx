'use client'

import { useState } from 'react';
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
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ContainerStatus } from "@/types/farming";
import { mockCrops } from "@/data/mockData";
import { 
  AlertTriangle, 
  Clock,
  Sprout,
  TrendingUp,
  X
} from 'lucide-react';

interface StopGrowingConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  targetIds: string[];
  targetType: 'tray' | 'rack';
  containerData: ContainerStatus;
}

export default function StopGrowingConfirmation({ 
  isOpen, 
  onClose, 
  onConfirm, 
  targetIds,
  targetType,
  containerData 
}: StopGrowingConfirmationProps) {
  const [confirmationChecked, setConfirmationChecked] = useState(false);

  // Получаем информацию о затронутых поддонах
  const getAffectedTrays = () => {
    const affectedTrays: Array<{
      trayId: string;
      cropName: string;
      location: string;
      daysGrowing: number;
      estimatedLoss: string;
      currentStage: string;
    }> = [];

    if (targetType === 'tray') {
      targetIds.forEach(trayId => {
        const tray = containerData.rows
          .flatMap(row => row.racks)
          .flatMap(rack => rack.trays)
          .find(t => t.id === trayId);
        
        if (tray && (tray.status === 'growing' || tray.status === 'ready') && tray.crop) {
          const crop = mockCrops.find(c => c.id === tray.crop!.cropId);
          const rack = containerData.rows
            .flatMap(row => row.racks)
            .find(r => r.trays.some(tr => tr.id === tray.id));
          const row = containerData.rows.find(r => r.racks.some(ra => ra.id === rack?.id));
          
          if (crop && rack && row) {
            const daysGrowing = tray.crop.daysInStage || 0;
            const totalDays = crop.totalGrowthDays;
            const progress = Math.round((daysGrowing / totalDays) * 100);
            
            affectedTrays.push({
              trayId: tray.id,
              cropName: crop.name,
              location: `Ряд ${row.name} → Стойка ${rack.position} → Поддон ${tray.position}`,
              daysGrowing,
              estimatedLoss: `${progress}% от урожая`,
              currentStage: tray.crop.currentStage || 'seed'
            });
          }
        }
      });
    } else if (targetType === 'rack') {
      targetIds.forEach(rackId => {
        const rack = containerData.rows
          .flatMap(row => row.racks)
          .find(r => r.id === rackId);
        
        if (rack) {
          rack.trays.forEach(tray => {
            if ((tray.status === 'growing' || tray.status === 'ready') && tray.crop) {
              const crop = mockCrops.find(c => c.id === tray.crop!.cropId);
              const row = containerData.rows.find(r => r.racks.some(ra => ra.id === rack.id));
              
              if (crop && row) {
                const daysGrowing = tray.crop.daysInStage || 0;
                const totalDays = crop.totalGrowthDays;
                const progress = Math.round((daysGrowing / totalDays) * 100);
                
                affectedTrays.push({
                  trayId: tray.id,
                  cropName: crop.name,
                  location: `Ряд ${row.name} → Стойка ${rack.position} → Поддон ${tray.position}`,
                  daysGrowing,
                  estimatedLoss: `${progress}% от урожая`,
                  currentStage: tray.crop.currentStage || 'seed'
                });
              }
            }
          });
        }
      });
    }

    return affectedTrays;
  };

  const affectedTrays = getAffectedTrays();
  const totalEstimatedLoss = affectedTrays.reduce((total, tray) => {
    const percentage = parseInt(tray.estimatedLoss.replace('% от урожая', ''));
    return total + percentage;
  }, 0);
  const averageLoss = affectedTrays.length > 0 ? Math.round(totalEstimatedLoss / affectedTrays.length) : 0;

  const handleConfirm = () => {
    if (confirmationChecked) {
      onConfirm();
      setConfirmationChecked(false);
    }
  };

  const handleClose = () => {
    setConfirmationChecked(false);
    onClose();
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'seed': return <Sprout className="h-3 w-3 text-green-500" />;
      case 'growing': return <TrendingUp className="h-3 w-3 text-blue-500" />;
      case 'ready': return <Clock className="h-3 w-3 text-orange-500" />;
      default: return <Sprout className="h-3 w-3 text-gray-500" />;
    }
  };

  const getStageLabel = (stage: string) => {
    switch (stage) {
      case 'seed': return 'Семена';
      case 'growing': return 'Рост';
      case 'ready': return 'Готово к сбору';
      default: return 'Неизвестно';
    }
  };

  if (affectedTrays.length === 0) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] !max-w-[900px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Прекратить выращивание
          </DialogTitle>
          <DialogDescription>
            Вы собираетесь принудительно остановить выращивание культур. 
            Это действие необратимо и приведет к потере урожая.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Сводка */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-destructive">Сводка потерь</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-destructive">{affectedTrays.length}</p>
                  <p className="text-sm text-muted-foreground">Поддонов</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">{averageLoss}%</p>
                  <p className="text-sm text-muted-foreground">Средние потери</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-600">
                    {new Set(affectedTrays.map(t => t.cropName)).size}
                  </p>
                  <p className="text-sm text-muted-foreground">Типов культур</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Список затронутых поддонов */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Затронутые поддоны ({affectedTrays.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {affectedTrays.map((tray, index) => (
                  <div 
                    key={tray.trayId} 
                    className="flex items-center justify-between p-3 border rounded-lg bg-muted/20"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          {getStageIcon(tray.currentStage)}
                          {tray.cropName}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {getStageLabel(tray.currentStage)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {tray.location}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {tray.daysGrowing} дней роста
                        </span>
                        <span className="text-destructive font-medium">
                          Потеря: {tray.estimatedLoss}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-3">
                      <span className="text-xs text-muted-foreground">#{index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Предупреждение */}
          <Alert className="border-destructive bg-destructive/10">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">
              <strong>Внимание!</strong> Это действие остановит все автоматические процессы 
              (полив, освещение, климат-контроль) для выбранных поддонов. 
              Весь урожай будет потерян и не может быть восстановлен.
            </AlertDescription>
          </Alert>

          {/* Подтверждение */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Checkbox 
                  id="confirm-stop"
                  checked={confirmationChecked}
                  onCheckedChange={(checked) => setConfirmationChecked(checked as boolean)}
                />
                <div className="space-y-1">
                  <label 
                    htmlFor="confirm-stop" 
                    className="text-sm font-medium cursor-pointer"
                  >
                    Я понимаю последствия и хочу прекратить выращивание
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Подтвердите, что вы осознаете потерю урожая и хотите продолжить
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Действия */}
        <div className="flex items-center justify-between pt-4 border-t bg-background">
          <div className="text-sm text-muted-foreground">
            Будет остановлено выращивание в {affectedTrays.length} поддонах
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleClose}>
              <X className="h-4 w-4 mr-2" />
              Отмена
            </Button>
            <Button 
              variant="destructive"
              onClick={handleConfirm}
              disabled={!confirmationChecked}
              className="min-w-[200px]"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Прекратить выращивание
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
