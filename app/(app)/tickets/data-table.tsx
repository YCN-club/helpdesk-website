import { categoriesConfig } from '@/config/categories';
import { severityConfig } from '@/config/severity';
import { subcategoriesConfig } from '@/config/subcategories';
import { sub } from 'date-fns';
import { AlertCircle } from 'lucide-react';

import { cookies } from 'next/headers';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Ticket {
  id: string;
  title: string;
  user_id: string;
  subcategory_id: string;
  assignee_id: string;
  severity: keyof typeof severityConfig;
  sla: string;
  created_at: string;
  closed_at: string | null;
  resolution_status: 'UNRESOLVED' | string;
  ticket_status: 'OPEN' | string;
}

async function getTickets() {
  const cookieStore = cookies();
  const token = cookieStore.get('JWT_TOKEN')?.value;

  if (!token) {
    throw new Error('Authentication token not found');
  }

  const res = await fetch(
    'https://helpdesk-staging.alphaspiderman.dev/api/tickets',
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Unauthorized: Please log in again');
    }
    throw new Error('Failed to fetch tickets');
  }

  return res.json().then((data) => data.tickets);
}

function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

export async function TicketsTable() {
  try {
    const tickets = await getTickets();

    return (
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Subcategory</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Ticket Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket: Ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="text-muted-foreground">
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{ticket.title}</TableCell>
                  <TableCell>
                    <Badge variant="default">
                      {toTitleCase(
                        categoriesConfig[
                          subcategoriesConfig.find(
                            (subcategory) =>
                              subcategory.id === ticket.subcategory_id
                          )?.category_id as keyof typeof categoriesConfig
                        ]
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">
                      {toTitleCase(
                        subcategoriesConfig.find(
                          (subcategory) =>
                            subcategory.id === ticket.subcategory_id
                        )!.name
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {toTitleCase(severityConfig[ticket.severity])}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {toTitleCase(ticket.ticket_status)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  } catch (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="size-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error instanceof Error
            ? error.message
            : 'An unexpected error occurred'}
        </AlertDescription>
      </Alert>
    );
  }
}
