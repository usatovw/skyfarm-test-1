import { useState, useCallback } from 'react';
import { SelectionState } from '@/types/farming';

export function useSelection() {
  const [state, setState] = useState<SelectionState>({
    selectedRows: new Set<string>(),
    selectedRacks: new Set<string>(),
    selectedTrays: new Set<string>(),
    mode: 'single',
    contextMenuOpen: false
  });

  const toggleRow = useCallback((rowId: string) => {
    setState((prev) => {
      const newSelected = new Set(prev.selectedRows);
      if (newSelected.has(rowId)) {
        newSelected.delete(rowId);
      } else {
        newSelected.add(rowId);
      }
      return { ...prev, selectedRows: newSelected, mode: newSelected.size > 0 ? 'multi' : 'single' };
    });
  }, []);

  const toggleRack = useCallback((rackId: string) => {
    setState((prev) => {
      const newSelected = new Set(prev.selectedRacks);
      if (newSelected.has(rackId)) {
        newSelected.delete(rackId);
      } else {
        newSelected.add(rackId);
      }
      return { ...prev, selectedRacks: newSelected, mode: newSelected.size > 0 ? 'multi' : 'single' };
    });
  }, []);

  const toggleTray = useCallback((trayId: string) => {
    setState((prev) => {
      const newSelected = new Set(prev.selectedTrays);
      if (newSelected.has(trayId)) {
        newSelected.delete(trayId);
      } else {
        newSelected.add(trayId);
      }
      return { ...prev, selectedTrays: newSelected, mode: newSelected.size > 0 ? 'multi' : 'single' };
    });
  }, []);

  const selectRow = useCallback((rowId: string, racksInRow: string[]) => {
    setState((prev) => ({
      ...prev,
      selectedRows: new Set([rowId]),
      selectedRacks: new Set(racksInRow),
      mode: 'multi'
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setState({
      selectedRows: new Set(),
      selectedRacks: new Set(),
      selectedTrays: new Set(),
      mode: 'single',
      contextMenuOpen: false
    });
  }, []);

  const enterMultiMode = useCallback(() => {
    setState((prev) => ({ ...prev, mode: 'multi' }));
  }, []);

  return {
    ...state,
    toggleRow,
    toggleRack,
    toggleTray,
    selectRow,
    clearSelection,
    enterMultiMode,
    hasSelection: state.selectedRows.size > 0 || state.selectedRacks.size > 0 || state.selectedTrays.size > 0
  };
}