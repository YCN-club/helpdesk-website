import { Plus } from 'lucide-react';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function TicketsPageSkeleton() {
  return (
    <div className="mx-auto max-w-screen-xl py-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" /> {/* Placeholder for the title */}
          <Button size="icon" asChild>
            <Link href="/tickets/create">
              <Plus />
            </Link>
          </Button>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full max-w-sm" />{' '}
          {/* Placeholder for the search input */}
          <div className="rounded-md border">
            <div className="h-10 border-b bg-muted/50" /> {/* Table header */}
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center space-x-4 p-4">
                <Skeleton className="h-4 w-[100px]" /> {/* Date */}
                <Skeleton className="h-4 w-[200px]" /> {/* Title */}
                <Skeleton className="h-6 w-[80px]" /> {/* Category */}
                <Skeleton className="h-6 w-[100px]" /> {/* Subcategory */}
                <Skeleton className="h-6 w-[60px]" /> {/* Severity */}
                <Skeleton className="h-6 w-[80px]" /> {/* Status */}
                <Skeleton className="h-8 w-8 rounded-full" />{' '}
                {/* Action button */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
