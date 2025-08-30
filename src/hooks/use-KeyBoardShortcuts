import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
  disabled?: boolean;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when user is typing in input fields
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      return;
    }

    const matchingShortcut = shortcuts.find(shortcut => {
      if (shortcut.disabled) return false;
      
      return (
        event.key.toLowerCase() === shortcut.key.toLowerCase() &&
        !!event.ctrlKey === !!shortcut.ctrlKey &&
        !!event.shiftKey === !!shortcut.shiftKey &&
        !!event.altKey === !!shortcut.altKey &&
        !!event.metaKey === !!shortcut.metaKey
      );
    });

    if (matchingShortcut) {
      event.preventDefault();
      event.stopPropagation();
      matchingShortcut.action();
    }
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return shortcuts.filter(s => !s.disabled);
};

// Common keyboard shortcuts for the app
export const createCommonShortcuts = ({
  onNewEntry,
  onSearch,
  onToggleTheme,
  onToggleInsights,
  onFocusInput,
  onExport
}: {
  onNewEntry?: () => void;
  onSearch?: () => void;
  onToggleTheme?: () => void;
  onToggleInsights?: () => void;
  onFocusInput?: () => void;
  onExport?: () => void;
}): KeyboardShortcut[] => {
  return [
    {
      key: 'n',
      ctrlKey: true,
      action: onNewEntry || (() => {}),
      description: 'New journal entry',
      disabled: !onNewEntry
    },
    {
      key: 'k',
      ctrlKey: true,
      action: onSearch || (() => {}),
      description: 'Search entries',
      disabled: !onSearch
    },
    {
      key: 'd',
      ctrlKey: true,
      action: onToggleTheme || (() => {}),
      description: 'Toggle dark mode',
      disabled: !onToggleTheme
    },
    {
      key: 'i',
      ctrlKey: true,
      action: onToggleInsights || (() => {}),
      description: 'Toggle insights panel',
      disabled: !onToggleInsights
    },
    {
      key: '/',
      action: onFocusInput || (() => {}),
      description: 'Focus input field',
      disabled: !onFocusInput
    },
    {
      key: 'e',
      ctrlKey: true,
      shiftKey: true,
      action: onExport || (() => {}),
      description: 'Export data',
      disabled: !onExport
    }
  ];
};
