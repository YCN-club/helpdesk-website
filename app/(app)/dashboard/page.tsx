'use client';

import { MagnifyingGlass } from '@phosphor-icons/react';

import { useState } from 'react';

import type { Metadata } from 'next';

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

const dummyTickets = [
  {
    id: 1,
    title: 'Cannot access email',
    status: 'Open',
    priority: 'High',
    assignedTo: 'John Doe',
  },
  {
    id: 2,
    title: 'Printer not working',
    status: 'In Progress',
    priority: 'Medium',
    assignedTo: 'Jane Smith',
  },
  {
    id: 3,
    title: 'New software installation',
    status: 'Open',
    priority: 'Low',
    assignedTo: 'Unassigned',
  },
  {
    id: 4,
    title: 'Password reset request',
    status: 'Closed',
    priority: 'Low',
    assignedTo: 'John Doe',
  },
  {
    id: 5,
    title: 'VPN connection issues',
    status: 'Open',
    priority: 'High',
    assignedTo: 'Jane Smith',
  },
];

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTickets = dummyTickets.filter((ticket) =>
    ticket.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-screen-lg py-6">
      <div className="flex flex-col space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>25</CardTitle>
              <CardDescription>Open Tickets</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>1</CardTitle>
              <CardDescription>Completed Tickets</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>11</CardTitle>
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
                  <TableHead>Priority</TableHead>
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
