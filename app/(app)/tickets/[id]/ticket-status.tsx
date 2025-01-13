import { Check } from 'lucide-react';

import type { TicketDetails } from '@/types';

import { toTitleCase } from '@/lib/utils';

import { LabelBadge } from '@/components/label-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export function TicketStatus({ ticket }: { ticket: TicketDetails }) {
  return (
    <div className="h-full overflow-y-auto border-l pl-4">
      <h2 className="text-lg font-semibold">Ticket Details</h2>
      <div className="space-y-4 overflow-y-auto">
        <div className="space-y-1">
          {ticket.ticket_status === 'OPEN' ? (
            <LabelBadge name="Open" color="#101010" icon={Check} />
          ) : (
            <Badge variant="destructive">Closed</Badge>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-muted-foreground">
            Resolution
          </p>
          <Badge
            variant={
              ticket.resolution_status === 'UNRESOLVED'
                ? 'destructive'
                : 'default'
            }
          >
            {toTitleCase(ticket.resolution_status)}
          </Badge>
        </div>
        <div>
          <p className="text-sm font-semibold text-muted-foreground">
            Subcategory
          </p>
          <Badge>{toTitleCase(ticket.subcategory.name)}</Badge>
        </div>
        <div>
          <p className="text-sm font-semibold text-muted-foreground">
            Severity
          </p>
          <p>
            {ticket.severity.name} (Level {ticket.severity.level})
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-muted-foreground">SLA</p>
          <p>{ticket.sla.name}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-muted-foreground">Created</p>
          <p>{new Date(ticket.created_at).toLocaleString()}</p>
        </div>
        {ticket.closed_at && (
          <div>
            <p className="text-sm font-semibold text-muted-foreground">
              Closed
            </p>
            <p>{new Date(ticket.closed_at).toLocaleString()}</p>
          </div>
        )}

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
