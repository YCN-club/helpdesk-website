'use client';

import { MagnifyingGlass } from '@phosphor-icons/react';
import { Ticket } from '@/types';
import { useEffect, useState } from 'react';
import { DataTable } from './data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { getTickets } from '@/lib/actions/tickets';

export default function DashboardPageClient() {

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchTickets() {
      try {
        const fetchedTickets = await getTickets();
        setTickets(fetchedTickets);
      } catch (err) {
        setError('Failed to fetch tickets.');
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter((ticket) =>
    ticket.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="mx-auto max-w-screen-lg py-6">
      <div className="flex flex-col space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>{tickets.filter((t) => t.ticket_status === 'OPEN').length}</CardTitle>
              <CardDescription>Open Tickets</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{tickets.filter((t) => t.ticket_status === 'CLOSED').length}</CardTitle>
              <CardDescription>Completed Tickets</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{tickets.filter((t) => t.assignee.name === 'Unassigned').length}</CardTitle>
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
        </Card >
      </div >
    </div >
  );
}
