'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sprout, Trash2, X, MoreHorizontal } from 'lucide-react';

interface MultiSelectPanelProps {
  selectedCount: number;
  onPlant: () => void;
  onClear: () => void;
  onCancel: () => void;
  onMore: () => void;
}

export function MultiSelectPanel({
  selectedCount,
  onPlant,
  onClear,
  onCancel,
  onMore
}: MultiSelectPanelProps) {
  return (
    <Card className="fixed bottom-0 left-0 right-0 p-4 shadow-lg border-t-4 border-primary animate-slide-up z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium">
            Выбрано стоек: <span className="text-lg font-bold">{selectedCount}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={onPlant} size="lg">
            <Sprout className="mr-2 h-5 w-5" />
            Засадить
          </Button>
          <Button onClick={onClear} variant="outline" size="lg">
            <Trash2 className="mr-2 h-5 w-5" />
            Очистить
          </Button>
          <Button onClick={onMore} variant="outline" size="icon">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
          <Button onClick={onCancel} variant="ghost" size="icon">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}