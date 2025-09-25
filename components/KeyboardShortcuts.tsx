import React, { useEffect } from 'react';

interface KeyboardShortcutsProps {
  onNavigateHome: () => void;
  onNavigatePosts: () => void;
  onNavigateAbout: () => void;
  onNavigateContact: () => void;
  onToggleTheme?: () => void;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({
  onNavigateHome,
  onNavigatePosts,
  onNavigateAbout,
  onNavigateContact,
  onToggleTheme
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in input/textarea
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // Check for Ctrl/Cmd + key combinations
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 'h':
            event.preventDefault();
            onNavigateHome();
            break;
          case 'p':
            event.preventDefault();
            onNavigatePosts();
            break;
          case 'a':
            event.preventDefault();
            onNavigateAbout();
            break;
          case 'c':
            event.preventDefault();
            onNavigateContact();
            break;
          case 'k':
            if (onToggleTheme) {
              event.preventDefault();
              onToggleTheme();
            }
            break;
        }
      }

      // Check for single key presses
      switch (event.key) {
        case 'Escape':
          // Close any open modals or dropdowns
          const activeElement = document.activeElement as HTMLElement;
          if (activeElement && activeElement.blur) {
            activeElement.blur();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onNavigateHome, onNavigatePosts, onNavigateAbout, onNavigateContact, onToggleTheme]);

  return null; // This component doesn't render anything
};

export default KeyboardShortcuts;
