'use client';

import { MagnifyingGlass } from '@phosphor-icons/react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  ArrowUpDown,
  Check,
  ChevronRight,
  CircleDot,
  CircleX,
  MoreHorizontal,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

import * as React from 'react';

import { useRouter } from 'next/navigation';

import { Ticket } from '@/types';

import { LabelBadge } from '@/components/label-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

function toTitleCase(str?: string) {
  if (!str) {
    return '';
  }
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

const columns: ColumnDef<Ticket>[] = [
  {
    accessorKey: 'created_at',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {new Date(row.getValue('created_at')).toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => <div className="w-full">{row.getValue('title')}</div>,
  },
  {
    accessorKey: 'subcategory.category.name',
    header: 'Category',
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-0.5">
          <Badge>{toTitleCase(row.original.subcategory.category.name)}</Badge>
          <ChevronRight className="size-4" />
          <Badge variant="secondary">
            {toTitleCase(row.original.subcategory.name)}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: 'resolution_status',
    header: 'Resolution',
    cell: ({ row }) =>
      row.original.resolution_status === 'RESOLVED' ? (
        <LabelBadge name="Resolved" color="#008240" icon={Check} />
      ) : (
        <LabelBadge name="Unresolved" color="#9c0909" icon={X} />
      ),
  },
  {
    accessorKey: 'ticket_status',
    header: 'Status',
    cell: ({ row }) =>
      row.original.ticket_status === 'OPEN' ? (
        <LabelBadge name="Open" color="#008240" icon={CircleDot} />
      ) : (
        <LabelBadge name="Closed" color="#9c0909" icon={CircleX} />
      ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const ticket = row.original;
      const router = useRouter();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(ticket.id);
                toast.success('Ticket ID copied to clipboard');
              }}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                navigateToTicketDetails(ticket.id, router);
              }}
            >
              View Ticket
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function navigateToTicketDetails(
  ticketId: string,
  router: ReturnType<typeof useRouter>
) {
  toast.promise(
    () =>
      new Promise((resolve) => {
        router.push(`/tickets/${ticketId}`);
        // Simulate a delay to show the loading state
        setTimeout(resolve, 1000);
      }),
    {
      loading: 'Loading ticket details...',
      success: 'Ticket details loaded',
      error: 'Failed to load ticket details',
    }
  );
}

export function DataTable({ data }: { data: Ticket[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'created_at', desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const router = useRouter();

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center space-x-2 py-4">
        <MagnifyingGlass className="h-6 w-6 text-muted-foreground" />
        <Input
          placeholder="Filter tickets..."
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('title')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() =>
                    navigateToTicketDetails(row.original.id, router)
                  }
                  className="cursor-pointer hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
