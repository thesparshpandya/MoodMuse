import React from 'react';
import { Settings, Keyboard } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ThemeSettings } from './ThemeSettings';
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp';
import { KeyboardShortcut } from '@/hooks/useKeyboardShortcuts';

interface FloatingDockProps {
  shortcuts: KeyboardShortcut[];
}

export const FloatingDock: React.FC<FloatingDockProps> = ({ shortcuts }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 floating-dock">
      <div className="glass-strong backdrop-blur-2xl rounded-2xl p-3 shadow-2xl border border-primary/30">
        <div className="flex items-center gap-3">
          <TooltipProvider>
            <Dialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button
                      variant="glass-subtle"
                      size="icon"
                      className="h-12 w-12 rounded-xl glass-hover transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/25"
                    >
                      <Settings className="h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent side="left" className="glass-subtle backdrop-blur-md">
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
              <DialogContent variant="glass" className="max-w-md">
                <ThemeSettings />
              </DialogContent>
            </Dialog>

            <Dialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button
                      variant="glass-subtle"
                      size="icon"
                      className="h-12 w-12 rounded-xl glass-hover transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/25"
                    >
                      <Keyboard className="h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent side="left" className="glass-subtle backdrop-blur-md">
                  <p>Keyboard Shortcuts</p>
                </TooltipContent>
              </Tooltip>
              <DialogContent variant="glass" className="max-w-lg">
                <KeyboardShortcutsHelp shortcuts={shortcuts} />
              </DialogContent>
            </Dialog>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};
