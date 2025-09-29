import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ContainerStatus, TrayStatus } from "@/types/farming";
import { mockCrops } from "@/data/mockData";
import { 
  Sprout, 
  Calendar, 
  TrendingUp, 
  Droplets, 
  Thermometer,
  Wind,
  Sun,
  Beaker
} from 'lucide-react';

interface TrayDetailProps {
  trayId: string;
  containerData: ContainerStatus;
  onPlantAction?: (trayIds: string[]) => void; // Добавляем callback для посадки
  onClearPlanned?: (trayIds: string[], targetType: 'tray') => void; // Очистка запланированных
  onStopGrowing?: (trayIds: string[], targetType: 'tray') => void; // Остановка выращивания
}

export default function TrayDetail({ trayId, containerData, onPlantAction, onClearPlanned, onStopGrowing }: TrayDetailProps) {
  // Найти поддон в данных
  const tray = containerData.rows
    .flatMap(row => row.racks)
    .flatMap(rack => rack.trays)
    .find(t => t.id === trayId);

  if (!tray) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Поддон не найден</p>
        </CardContent>
      </Card>
    );
  }

  // Найти связанные данные
  const rack = containerData.rows
    .flatMap(row => row.racks)
    .find(r => r.trays.some(t => t.id === trayId));
  
  const row = containerData.rows
    .find(r => r.racks.some(rack => rack.trays.some(t => t.id === trayId)));

  const crop = tray.crop ? mockCrops.find(c => c.id === tray.crop!.cropId) : null;
  const currentStage = crop && tray.crop?.currentStage 
    ? crop.growthStages.find(s => s.id === tray.crop!.currentStage)
    : null;

  const getStatusInfo = () => {
    switch (tray.status) {
      case 'empty': 
        return { 
          label: 'Пустой', 
          color: 'bg-gray-100 text-gray-800', 
          icon: <div className="w-4 h-4 bg-gray-400 rounded-full" /> 
        };
      case 'planned': 
        return { 
          label: 'Запланирован', 
          color: 'bg-blue-100 text-blue-800', 
          icon: <Calendar className="w-4 h-4 text-blue-600" /> 
        };
      case 'growing': 
        return { 
          label: 'Растет', 
          color: 'bg-green-100 text-green-800', 
          icon: <Sprout className="w-4 h-4 text-green-600" /> 
        };
      case 'ready': 
        return { 
          label: 'Готов к сбору', 
          color: 'bg-blue-100 text-blue-800', 
          icon: <TrendingUp className="w-4 h-4 text-blue-600" /> 
        };
      case 'error': 
        return { 
          label: 'Ошибка', 
          color: 'bg-red-100 text-red-800', 
          icon: <Droplets className="w-4 h-4 text-red-600" /> 
        };
      default: 
        return { 
          label: 'Неизвестно', 
          color: 'bg-gray-100 text-gray-800', 
          icon: <div className="w-4 h-4 bg-gray-400 rounded-full" /> 
        };
    }
  };

  const statusInfo = getStatusInfo();
  const totalGrowthDays = crop?.totalGrowthDays || 0;
  const currentDay = tray.crop?.daysInStage || 0;
  const growthProgress = totalGrowthDays > 0 ? (currentDay / totalGrowthDays) * 100 : 0;

  const locationInfo = `${row?.name}${rack?.position}.${tray.position}`;

  return (
    <div className="space-y-6">
      {/* Основная информация */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {statusInfo.icon}
                Поддон {locationInfo}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Ряд {row?.name}, стойка {rack?.position}, поддон {tray.position}
              </p>
            </div>
            <Badge className={statusInfo.color}>
              {statusInfo.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {crop && tray.crop ? (
            <div className="space-y-4">
              {/* Информация о культуре */}
              <div className="flex items-center gap-4">
                <div className="text-4xl">{crop.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{crop.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Посажен: {tray.crop.plantedDate ? 
                      new Date(tray.crop.plantedDate).toLocaleDateString('ru-RU') : 
                      'Неизвестно'}
                  </p>
                  {tray.crop.harvestDate && (
                    <p className="text-sm text-muted-foreground">
                      Сбор урожая: {new Date(tray.crop.harvestDate).toLocaleDateString('ru-RU')}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Текущая стадия */}
              {currentStage && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">Текущая стадия</h4>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{currentStage.icon}</span>
                    <div>
                      <p className="font-medium text-foreground">{currentStage.name}</p>
                      <p className="text-sm text-muted-foreground">{currentStage.description}</p>
                      <p className="text-sm text-green-600">
                        День {currentDay} из {currentStage.duration}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Прогресс роста */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-foreground">Прогресс роста</h4>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(growthProgress)}%
                  </span>
                </div>
                <Progress value={growthProgress} className="h-2" />
                <p className="text-sm text-muted-foreground mt-1">
                  {currentDay} из {totalGrowthDays} дней
                </p>
              </div>

              {/* Стадии роста */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Все стадии</h4>
                <div className="space-y-2">
                  {crop.growthStages.map((stage, index) => {
                    const isCurrent = stage.id === tray.crop?.currentStage;
                    const isPassed = crop.growthStages.findIndex(s => s.id === tray.crop?.currentStage) > index;
                    
                    return (
                      <div 
                        key={stage.id}
                        className={`flex items-center gap-3 p-2 rounded-md ${
                          isCurrent ? 'bg-blue-50 border border-blue-200' :
                          isPassed ? 'bg-green-50 border border-green-200' :
                          'bg-gray-50 border border-gray-200'
                        }`}
                      >
                        <span className="text-lg">{stage.icon}</span>
                        <div className="flex-1">
                          <p className={`font-medium ${
                            isCurrent ? 'text-blue-700' :
                            isPassed ? 'text-green-700' :
                            'text-gray-600'
                          }`}>
                            {stage.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {stage.duration} дней
                          </p>
                        </div>
                        {isPassed && (
                          <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                        {isCurrent && (
                          <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{index + 1}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl text-gray-300 mb-4">🌱</div>
              <h3 className="text-lg font-medium text-foreground mb-2">Пустой поддон</h3>
              <p className="text-muted-foreground mb-4">
                Этот поддон готов для посадки новой культуры
              </p>
              <Button onClick={() => onPlantAction?.([tray.id])}>
                <Sprout className="w-4 h-4 mr-2" />
                Засадить поддон
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Микроклимат поддона */}
      <Card>
        <CardHeader>
          <CardTitle>Микроклимат поддона</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Thermometer className="w-5 h-5 text-red-500" />
              <div>
                <p className="font-medium text-foreground">22.3°C</p>
                <p className="text-sm text-muted-foreground">Температура</p>
                <p className="text-xs text-green-600">✓ В норме</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Droplets className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium text-foreground">68%</p>
                <p className="text-sm text-muted-foreground">Влажность</p>
                <p className="text-xs text-green-600">✓ В норме</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Sun className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="font-medium text-foreground">245 PPFD</p>
                <p className="text-sm text-muted-foreground">Освещенность</p>
                <p className="text-xs text-green-600">✓ Оптимально</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Beaker className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium text-foreground">6.1 pH</p>
                <p className="text-sm text-muted-foreground">Кислотность</p>
                <p className="text-xs text-green-600">✓ Идеально</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Wind className="w-5 h-5 text-cyan-500" />
              <div>
                <p className="font-medium text-foreground">950 ppm</p>
                <p className="text-sm text-muted-foreground">CO2</p>
                <p className="text-xs text-yellow-600">⚠ Слегка низко</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Droplets className="w-5 h-5 text-purple-500" />
              <div>
                <p className="font-medium text-foreground">1.8 EC</p>
                <p className="text-sm text-muted-foreground">Питательность</p>
                <p className="text-xs text-green-600">✓ В норме</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Действия */}
      <Card>
        <CardHeader>
          <CardTitle>Действия</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tray.status === 'empty' && (
              <Button 
                className="flex items-center gap-2"
                onClick={() => onPlantAction?.([tray.id])}
              >
                <Sprout className="w-4 h-4" />
                Засадить
              </Button>
            )}
            {tray.status === 'ready' && (
              <Button className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Собрать урожай
              </Button>
            )}
            {tray.status !== 'empty' && (
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                История роста
              </Button>
            )}
            <Button variant="outline" className="flex items-center gap-2">
              <Droplets className="w-4 h-4" />
              Полить
            </Button>
            {tray.status === 'planned' && (
              <Button 
                variant="outline" 
                className="text-destructive hover:text-destructive"
                onClick={() => onClearPlanned?.([tray.id], 'tray')}
              >
                Очистить поддон
              </Button>
            )}
            {(tray.status === 'growing' || tray.status === 'ready') && (
              <Button 
                variant="destructive"
                onClick={() => onStopGrowing?.([tray.id], 'tray')}
              >
                Прекратить выращивание
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}