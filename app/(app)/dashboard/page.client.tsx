'use client';

import { MagnifyingGlass } from '@phosphor-icons/react';

import { useEffect, useState } from 'react';

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
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchTickets() {
      try {
        const fetchedTickets = await getTickets();

        // Add random attributes
        const statuses = ['Open', 'In Progress', 'Closed'];
        const priorities = ['High', 'Medium', 'Low'];
        const assignees = ['Alice', 'Bob', 'Charlie', 'Unassigned'];

        const enrichedTickets = fetchedTickets.map((ticket) => ({
          ...ticket,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          priority: priorities[Math.floor(Math.random() * priorities.length)],
          assignedTo: assignees[Math.floor(Math.random() * assignees.length)],
        }));

        setTickets(enrichedTickets);
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
              <CardTitle>{tickets.filter((t) => t.status === 'Open').length}</CardTitle>
              <CardDescription>Open Tickets</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{tickets.filter((t) => t.status === 'Closed').length}</CardTitle>
              <CardDescription>Completed Tickets</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{tickets.filter((t) => t.assignedTo === 'Unassigned').length}</CardTitle>
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
            <div className="mb-4 flex items-center space-x-2">
              <MagnifyingGlass className="h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button>Search</Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Assigned To</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>{ticket.id}</TableCell>
                    <TableCell>{ticket.title}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          ticket.status === 'Open'
                            ? 'default'
                            : ticket.status === 'In Progress'
                              ? 'outline'
                              : 'secondary'
                        }
                      >
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          ticket.priority === 'High'
                            ? 'default'
                            : ticket.priority === 'Medium'
                              ? 'secondary'
                              : 'outline'
                        }
                      >
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{ticket.assignedTo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
