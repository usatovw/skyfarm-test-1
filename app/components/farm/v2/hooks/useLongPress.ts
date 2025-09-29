import { useCallback, useRef } from 'react';

export interface UseLongPressOptions {
  onLongPress: (event: React.TouchEvent | React.MouseEvent) => void;
  onShortPress?: (event: React.TouchEvent | React.MouseEvent) => void;
  delay?: number; // ms
  shouldPreventDefault?: boolean;
  shouldStopPropagation?: boolean;
}

export interface LongPressHandlers {
  onMouseDown: (event: React.MouseEvent) => void;
  onMouseUp: (event: React.MouseEvent) => void;
  onMouseLeave: (event: React.MouseEvent) => void;
  onTouchStart: (event: React.TouchEvent) => void;
  onTouchEnd: (event: React.TouchEvent) => void;
  onTouchMove: (event: React.TouchEvent) => void;
}

/**
 * Hook для обработки long press и short press жестов
 * Адаптирован для планшетов с поддержкой вибрации
 *
 * @example
 * const longPressHandlers = useLongPress({
 *   onLongPress: () => console.log('Long press detected!'),
 *   onShortPress: () => console.log('Short press detected!'),
 *   delay: 500
 * });
 *
 * return <div {...longPressHandlers}>Press me</div>
 */
export function useLongPress({
  onLongPress,
  onShortPress,
  delay = 500,
  shouldPreventDefault = true,
  shouldStopPropagation = false
}: UseLongPressOptions): LongPressHandlers {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);
  const eventRef = useRef<React.TouchEvent | React.MouseEvent | null>(null);

  /**
   * Вибрация на устройствах, которые поддерживают это
   */
  const vibrate = useCallback(() => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50); // 50ms вибрация
    }
  }, []);

  /**
   * Начало нажатия
   */
  const start = useCallback(
    (event: React.TouchEvent | React.MouseEvent) => {
      if (shouldPreventDefault && event.target) {
        event.preventDefault();
      }

      if (shouldStopPropagation) {
        event.stopPropagation();
      }

      eventRef.current = event;
      isLongPressRef.current = false;

      timerRef.current = setTimeout(() => {
        isLongPressRef.current = true;
        vibrate(); // Вибрация при long press
        onLongPress(event);
      }, delay);
    },
    [onLongPress, delay, shouldPreventDefault, shouldStopPropagation, vibrate]
  );

  /**
   * Отмена нажатия
   */
  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  /**
   * Конец нажатия
   */
  const end = useCallback(
    (event: React.TouchEvent | React.MouseEvent) => {
      cancel();

      // Если это был short press, вызываем соответствующий обработчик
      if (!isLongPressRef.current && onShortPress) {
        onShortPress(event);
      }

      // Сбрасываем флаги
      isLongPressRef.current = false;
      eventRef.current = null;
    },
    [cancel, onShortPress]
  );

  /**
   * Обработка движения пальца (отмена long press)
   */
  const move = useCallback(
    (event: React.TouchEvent) => {
      // Если палец сдвинулся, отменяем long press
      if (timerRef.current) {
        cancel();
      }
    },
    [cancel]
  );

  return {
    onMouseDown: start as (event: React.MouseEvent) => void,
    onMouseUp: end as (event: React.MouseEvent) => void,
    onMouseLeave: cancel as (event: React.MouseEvent) => void,
    onTouchStart: start as (event: React.TouchEvent) => void,
    onTouchEnd: end as (event: React.TouchEvent) => void,
    onTouchMove: move
  };
}