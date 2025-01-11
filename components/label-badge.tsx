'use client';

import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';

export function LabelBadge({
  name,
  color,
  className,
  icon: IconComponent,
}: {
  name: string;
  color: string;
  className?: string;
  icon?: LucideIcon;
}) {
  // Function to determine if the text should be dark or light
  const shouldUseDarkText = (hexColor: string) => {
    const rgb = parseInt(hexColor.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luma > 128;
  };

  const textColor = shouldUseDarkText(color) ? '#000000' : '#ffffff';

  return (
    <Badge
      className={cn(
        'inline-flex items-center gap-1 border-0 px-2 py-0.5 text-xs font-medium',
        'transition-opacity hover:opacity-80',
        className
      )}
      style={{
        backgroundColor: color,
        color: textColor,
      }}
    >
      {IconComponent && <IconComponent className="size-4" />}
      {name}
    </Badge>
  );
}
