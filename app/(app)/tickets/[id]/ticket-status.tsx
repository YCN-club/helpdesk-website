import type { TicketDetails } from '@/types';

import { toTitleCase } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function TicketStatus({ ticket }: { ticket: TicketDetails }) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Ticket Details</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">Status</p>
          <Badge
            variant={ticket.ticket_status === 'OPEN' ? 'default' : 'secondary'}
          >
            {toTitleCase(ticket.ticket_status)}
          </Badge>
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
      </CardContent>
    </Card>
  );
}
