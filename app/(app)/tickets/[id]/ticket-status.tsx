'use client';

import { Check, ChevronRight, CircleDot, CircleX, X } from 'lucide-react';

import type { TicketDetails } from '@/types';

import { toTitleCase } from '@/lib/utils';

import { LabelBadge } from '@/components/label-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export function TicketStatus({ ticket }: { ticket: TicketDetails }) {
  return (
    <div className="h-full overflow-y-auto border-l pl-4">
      <h2 className="pb-2 text-lg font-semibold">Ticket Details</h2>
      <div className="space-y-4 overflow-y-auto">
        <div className="flex items-center space-x-1">
          {ticket.ticket_status === 'OPEN' ? (
            <LabelBadge name="Open" color="#008240" icon={CircleDot} />
          ) : (
            <LabelBadge name="Closed" color="#9c0909" icon={CircleX} />
          )}
          {ticket.resolution_status === 'RESOLVED' ? (
            <LabelBadge name="Resolved" color="#008240" icon={Check} />
          ) : (
            <LabelBadge name="Unresolved" color="#9c0909" icon={X} />
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-muted-foreground">
            Category
          </p>
          <div className="flex items-center space-x-0.5">
            <Badge>{toTitleCase(ticket.subcategory.category.name)}</Badge>
            <ChevronRight className="size-4" />
            <Badge variant="secondary">
              {toTitleCase(ticket.subcategory.name)}
            </Badge>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-muted-foreground">
            Severity
          </p>
          <Badge>
            {ticket.severity.name} (Level {ticket.severity.level})
          </Badge>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-muted-foreground">SLA</p>
          <Badge>{ticket.sla.name}</Badge>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-muted-foreground">
            Assignee
          </p>
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${ticket.assignee.name}`}
              />
              <AvatarFallback>
                {ticket.assignee.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <span>{ticket.assignee.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
