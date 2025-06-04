import { useEffect, useCallback } from 'react';

interface UseFocusManagementOptions {
  onEscape?: () => void;
  onOutsideClick?: () => void;
  enabled?: boolean;
}

export const useFocusManagement = (options: UseFocusManagementOptions = {}) => {
  const { onEscape, onOutsideClick, enabled = true } = options;

  const handleEscape = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && onEscape) {
      event.preventDefault();
      event.stopPropagation();
      onEscape();
    }
  }, [onEscape]);

  const handleOutsideClick = useCallback(() => {
    if (onOutsideClick) {
      onOutsideClick();
    }
  }, [onOutsideClick]);

  useEffect(() => {
    if (!enabled) return;

    if (onEscape) {
      document.addEventListener('keydown', handleEscape);
    }

    if (onOutsideClick) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      if (onEscape) {
        document.removeEventListener('keydown', handleEscape);
      }
      if (onOutsideClick) {
        document.removeEventListener('mousedown', handleOutsideClick);
      }
    };
  }, [enabled, handleEscape, handleOutsideClick, onEscape, onOutsideClick]);

  // Utility function to ensure proper focus restoration
  const restoreFocus = useCallback((element?: HTMLElement) => {
    if (element && element.focus) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        element.focus();
      }, 0);
    }
  }, []);

  // Utility function to blur active element safely
  const blurActiveElement = useCallback(() => {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && activeElement.blur) {
      activeElement.blur();
    }
  }, []);

  return {
    restoreFocus,
    blurActiveElement
  };
}; 
