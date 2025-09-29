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

  return {
    actions,
    addAction,
    removeAction,
    clearActions,
    applyActions,
    hasActions: actions.length > 0
  };
}