'use client';

import { useState } from 'react';

import { Ticket } from '@/types';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { DataTable } from './data-table';

export default function DashboardPageClient({
  tickets,
}: {
  tickets: Ticket[];
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTickets = tickets.filter((ticket) =>
    ticket.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-screen-lg py-6">
      <div className="flex flex-col space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>
                {tickets.filter((t) => t.ticket_status === 'OPEN').length}
              </CardTitle>
              <CardDescription>Open Tickets</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                {tickets.filter((t) => t.ticket_status === 'CLOSED').length}
              </CardTitle>
              <CardDescription>Completed Tickets</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                {tickets.filter((t) => t.assignee.name === 'Unassigned').length}
              </CardTitle>
              <CardDescription>Unassigned Tickets</CardDescription>
            </CardHeader>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Recent Tickets</CardTitle>
            <CardDescription>
              Search and manage your recent support tickets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable data={tickets} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
