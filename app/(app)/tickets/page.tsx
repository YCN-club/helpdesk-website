import { Plus } from 'lucide-react';

import { Suspense } from 'react';

import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { TicketsTable } from '@/app/(app)/tickets/data-table';
import { TicketsTableSkeleton } from '@/app/(app)/tickets/skeleton';

export default function TicketsPage() {
  return (
    <div className="mx-auto max-w-screen-lg py-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Your Tickets</h1>
          <Button size="icon" asChild>
            <Link href="/tickets/create">
              <Plus />
            </Link>
          </Button>
        </div>
        <Suspense fallback={<TicketsTableSkeleton />}>
          <TicketsTable />
        </Suspense>
      </div>
    </div>
  );
}
