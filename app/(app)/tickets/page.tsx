import { Plus } from 'lucide-react';

import Link from 'next/link';

import { getTickets } from '@/lib/actions/tickets';

import { Button } from '@/components/ui/button';

import { DataTable } from './data-table';

export default async function TicketsPage() {
  const tickets = await getTickets();

  return (
    <div className="mx-auto max-w-screen-xl py-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Your Tickets</h1>
          <Button size="icon" asChild>
            <Link href="/tickets/create">
              <Plus />
            </Link>
          </Button>
        </div>
        <DataTable data={tickets} />
      </div>
    </div>
  );
}
