import { Metadata } from 'next';

import { getTickets } from '@/lib/actions/tickets';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { DataTable } from './data-table';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function DashboardPage() {
  const tickets = await getTickets(false);

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
