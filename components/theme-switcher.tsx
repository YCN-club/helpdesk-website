'use client';

import { MoonStars, Sun } from '@phosphor-icons/react';
import { useTheme } from 'next-themes';

import * as React from 'react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function ThemeSwitcher({ className }: { className?: string }) {
  const { setTheme, theme } = useTheme();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn('rounded-full', className)}
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            <Sun weight="fill" className="h-[1.5rem] w-[1.3rem] dark:hidden" />
            <MoonStars weight="fill" className="hidden h-5 w-5 dark:block" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Toggle theme</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
