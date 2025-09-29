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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CropType, ContainerStatus } from "@/types/farming";
import { getAvailableCropsForContainer, getExistingCropsInContainer, mockCrops } from "@/data/mockData";
import { Search, Thermometer, Droplets, Wind, Sun, AlertTriangle, Check, Info } from 'lucide-react';

interface CropSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onCropSelected: (cropId: string) => void;
  availableCrops: CropType[];
  currentMode?: string;
  containerData?: ContainerStatus; // Добавляем данные контейнера
}

export default function CropSelector({ 
  isOpen, 
  onClose, 
  onCropSelected, 
  availableCrops, 
  currentMode, 
  containerData 
}: CropSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null);

  // Получаем уже существующие культуры в контейнере
  const existingCrops = containerData ? getExistingCropsInContainer(containerData) : [];
  
  // Фильтруем культуры по совместимости с уже растущими
  const compatibleCrops = containerData 
    ? getAvailableCropsForContainer(containerData)
    : availableCrops;

  // УЛУЧШЕННЫЙ ПОИСК - по всем полям
  const filteredCrops = compatibleCrops.filter(crop => {
    const searchLower = searchTerm.toLowerCase();
    return searchTerm === '' || 
           crop.name.toLowerCase().includes(searchLower) ||
           crop.growthStages.some(stage => 
             stage.name.toLowerCase().includes(searchLower) ||
             stage.description.toLowerCase().includes(searchLower)
           ) ||
           crop.climateRequirements.temperature.min.toString().includes(searchTerm) ||
           crop.climateRequirements.temperature.max.toString().includes(searchTerm) ||
           crop.totalGrowthDays.toString().includes(searchTerm);
  });

  const currentModeCrop = currentMode ? mockCrops.find(c => c.id === currentMode) : null;
  const existingCropNames = existingCrops.map(cropId => 
    mockCrops.find(c => c.id === cropId)?.name
  ).filter(Boolean);

  const handleCropSelect = (cropId: string) => {
    console.log('🎯 handleCropSelect вызван с:', cropId);
    setSelectedCropId(cropId);
  };

  const handleConfirm = () => {
    console.log('🚀 handleConfirm вызван, selectedCropId:', selectedCropId);
    if (selectedCropId) {
      console.log('✅ Вызываем onCropSelected с:', selectedCropId);
      onCropSelected(selectedCropId);
      setSelectedCropId(null);
      setSearchTerm('');
      onClose(); // Добавляем закрытие модалки
    } else {
      console.warn('❌ selectedCropId пустой!');
    }
  };

  const handleCancel = () => {
    setSelectedCropId(null);
    setSearchTerm('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] !max-w-[1400px] max-h-[90vh] overflow-hidden" style={{ width: '95vw', maxWidth: '1400px' }}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sprout className="h-5 w-5" />
            Выбор культуры для посадки
          </DialogTitle>
          <DialogDescription>
            Выберите культуру для посадки в выделенные поддоны.
            {currentModeCrop && (
              <>
                {' '}Текущий режим контейнера: <strong>{currentModeCrop.name}</strong>
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Поиск */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск культур по названию, температуре, дням роста..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10 h-12"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            )}
          </div>

          {/* Информация о существующих культурах */}
          {existingCrops.length > 0 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-800 mb-1">Уже растущие культуры</p>
                  <p className="text-green-700">
                    В контейнере уже растут: <strong>{existingCropNames.join(', ')}</strong>.
                    Показаны только совместимые с ними культуры.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Предупреждение о совместимости */}
          {currentMode && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-800 mb-1">Режим контейнера</p>
                  <p className="text-blue-700">
                    Текущий режим контейнера настроен на <strong>{currentModeCrop?.name}</strong>.
                    Показаны только культуры, совместимые с этим режимом.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* НОВАЯ СЕТКА КУЛЬТУР - БОЛЬШИЕ КАРТОЧКИ */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Показываем найденные культуры (доступные и недоступные) */}
            {mockCrops
              .filter(crop => {
                // Фильтрация по поиску
                const searchLower = searchTerm.toLowerCase();
                return searchTerm === '' || 
                       crop.name.toLowerCase().includes(searchLower) ||
                       crop.growthStages.some(stage => 
                         stage.name.toLowerCase().includes(searchLower) ||
                         stage.description.toLowerCase().includes(searchLower)
                       ) ||
                       crop.climateRequirements.temperature.min.toString().includes(searchTerm) ||
                       crop.climateRequirements.temperature.max.toString().includes(searchTerm) ||
                       crop.totalGrowthDays.toString().includes(searchTerm);
              })
              .map((crop) => {
              const isAvailable = filteredCrops.some(c => c.id === crop.id);
              
              // Определяем причину недоступности
              const getUnavailableReason = () => {
                if (isAvailable) return null;
                
                const existingCrops = containerData ? getExistingCropsInContainer(containerData) : [];
                if (existingCrops.length > 0) {
                  return "Несовместима с растущими культурами";
                }
                
                if (currentMode && crop.id !== currentMode) {
                  return "Несовместима с режимом контейнера";
                }
                
                return "Недоступна";
              };
              
              const unavailableReason = getUnavailableReason();
              const isDisabled = !isAvailable;
              const isSelected = selectedCropId === crop.id;
              
              return (
                <Card 
                  key={crop.id}
                  className={`cursor-pointer transition-all duration-200 relative ${
                    isDisabled 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:shadow-xl hover:scale-[1.02]'
                  } ${
                    isSelected && !isDisabled
                      ? 'ring-4 ring-primary ring-offset-4 bg-primary/10 shadow-xl scale-[1.02]' 
                      : isDisabled 
                        ? 'bg-muted/30' 
                        : 'bg-card hover:bg-accent/10'
                  }`}
                  onClick={() => {
                    if (!isDisabled) {
                      handleCropSelect(crop.id);
                      console.log('🎯 Культура выбрана:', crop.name, crop.id);
                    }
                  }}
                  role="button"
                  tabIndex={isDisabled ? -1 : 0}
                  aria-disabled={isDisabled}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && !isDisabled) {
                      e.preventDefault();
                      handleCropSelect(crop.id);
                    }
                  }}
                >
                  {/* Индикатор выбора в углу */}
                  {isSelected && !isDisabled && (
                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 shadow-lg z-10">
                      <Check className="h-4 w-4" />
                    </div>
                  )}

                  <CardContent className="p-4">
                    <div className="space-y-2">
                      {/* Иконка и название - БОЛЬШИЕ */}
                      <div className="text-center space-y-2">
                        <div 
                          className="text-4xl mx-auto"
                          style={{ fontSize: '2.5rem', lineHeight: '1' }}
                        >
                          {crop.icon}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-center gap-2 flex-wrap">
                            <h3 
                              className={`font-semibold text-center ${isDisabled ? 'text-muted-foreground' : 'text-foreground'}`}
                              style={{ fontSize: '1rem', fontWeight: '600' }}
                            >
                              {crop.name}
                            </h3>
                            {isSelected && !isDisabled && (
                              <Check className="h-5 w-5 text-primary flex-shrink-0" />
                            )}
                          </div>
                          {crop.id === currentMode && (
                            <Badge variant="secondary" className="text-xs">
                              Активный режим
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {/* Основная информация - ЧИТАЕМО */}
                      <div className="space-y-1">
                        <div 
                          className={`text-center font-medium ${isDisabled ? 'text-muted-foreground' : 'text-foreground'}`}
                          style={{ fontSize: '0.875rem' }}
                        >
                          {crop.totalGrowthDays} дней
                        </div>
                        
                        <div className="flex items-center justify-center gap-1 text-muted-foreground">
                          <Thermometer className="h-3 w-3 text-red-500 flex-shrink-0" />
                          <span style={{ fontSize: '0.75rem' }}>
                            {crop.climateRequirements.temperature.min}-{crop.climateRequirements.temperature.max}°C
                          </span>
                        </div>

                      </div>

                      {/* Статус совместимости - КРУПНО */}
                      <div className="text-center">
                        {isDisabled && unavailableReason ? (
                          <Badge variant="destructive" className="text-xs px-2 py-1">
                            Несовместима
                          </Badge>
                        ) : crop.id === currentMode ? (
                          <Badge variant="default" className="bg-primary text-primary-foreground text-xs px-2 py-1">
                            Активный
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50 text-xs px-2 py-1">
                            ✓ Доступна
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Сообщение если ничего не найдено */}
          {searchTerm !== '' && mockCrops.filter(crop => {
            const searchLower = searchTerm.toLowerCase();
            return crop.name.toLowerCase().includes(searchLower) ||
                   crop.growthStages.some(stage => 
                     stage.name.toLowerCase().includes(searchLower) ||
                     stage.description.toLowerCase().includes(searchLower)
                   ) ||
                   crop.climateRequirements.temperature.min.toString().includes(searchTerm) ||
                   crop.climateRequirements.temperature.max.toString().includes(searchTerm) ||
                   crop.totalGrowthDays.toString().includes(searchTerm);
          }).length === 0 && (
            <div className="text-center py-16">
              <div className="text-8xl mb-6">🔍</div>
              <h3 className="font-medium text-foreground mb-2" style={{ fontSize: 'var(--text-xl)' }}>
                Культуры не найдены
              </h3>
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-base)' }}>
                Не найдено культур по запросу "{searchTerm}"
              </p>
            </div>
          )}
        </div>

        {/* Действия - КРУПНЫЕ КНОПКИ */}
        <div className="flex items-center justify-between pt-6 border-t bg-card">
          <div className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
            {selectedCropId && (
              <>
                Выбрана культура: <strong>{mockCrops.find(c => c.id === selectedCropId)?.name}</strong>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleCancel} size="lg">
              Отмена
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={!selectedCropId}
              size="lg"
              className="min-w-[160px]"
            >
              {selectedCropId ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Подтвердить выбор
                </>
              ) : (
                'Выберите культуру'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const Sprout = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21L12 8l5 13M7 21l5-8M12 8l5-8M7 21h10" />
  </svg>
);