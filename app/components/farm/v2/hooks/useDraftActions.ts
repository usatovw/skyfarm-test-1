import { useState, useCallback } from 'react';
import { DraftAction } from '@/types/farming';

export function useDraftActions() {
  const [actions, setActions] = useState<DraftAction[]>([]);

  const addAction = useCallback((action: Omit<DraftAction, 'id' | 'createdAt'>) => {
    const newAction: DraftAction = {
      ...action,
      id: `action_${Date.now()}_${Math.random()}`,
      createdAt: new Date()
    };
    setActions((prev) => [...prev, newAction]);
    return newAction;
  }, []);

  const removeAction = useCallback((actionId: string) => {
    setActions((prev) => prev.filter((a) => a.id !== actionId));
  }, []);

  const clearActions = useCallback(() => {
    setActions([]);
  }, []);

  const applyActions = useCallback(() => {
    // Здесь будет логика применения действий
    const applied = [...actions];
    clearActions();
    return { success: true, applied };
  }, [actions, clearActions]);

  // Методы для конкретных действий
  const harvestReady = useCallback((targetIds: string[], targetType: 'rack' | 'tray') => {
    // Определяем затронутые поддоны
    const affectedTrays = targetType === 'tray' ? targetIds : [];
    // Если targetType === 'rack', affectedTrays будут вычислены в FarmManager

    addAction({
      type: 'harvest',
      targetType,
      targetIds,
      affectedTrays
    });
  }, [addAction]);

  const stopGrowing = useCallback((targetIds: string[], targetType: 'rack' | 'tray') => {
    // Определяем затронутые поддоны
    const affectedTrays = targetType === 'tray' ? targetIds : [];
    // Если targetType === 'rack', affectedTrays будут вычислены в FarmManager

    addAction({
      type: 'stop_growing',
      targetType,
      targetIds,
      affectedTrays
    });
  }, [addAction]);

  const clearPlanned = useCallback((targetIds: string[], targetType: 'rack' | 'tray') => {
    // Определяем затронутые поддоны
    const affectedTrays = targetType === 'tray' ? targetIds : [];

    addAction({
      type: 'clear',
      targetType,
      targetIds,
      affectedTrays
    });
  }, [addAction]);

  const cancelStop = useCallback((targetIds: string[], targetType: 'rack' | 'tray') => {
    // Определяем затронутые поддоны
    const affectedTrays = targetType === 'tray' ? targetIds : [];

    addAction({
      type: 'cancel_stop',
      targetType,
      targetIds,
      affectedTrays
    });
  }, [addAction]);

  return {
    actions,
    addAction,
    removeAction,
    clearActions,
    applyActions,
    harvestReady,
    stopGrowing,
    clearPlanned,
    cancelStop,
    hasActions: actions.length > 0
  };
}