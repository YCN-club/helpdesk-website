import { decodeJwt } from 'jose';
import { Archive, Calendar, Check, CircleDot, Info, X } from 'lucide-react';

import { Metadata, ResolvingMetadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import type { JwtPayload } from '@/types';

import {
  getTicketDetails,
  getTicketMessages,
  updateTicketStatus,
} from '@/lib/actions/tickets';

import { RoleCheck } from '@/components/role-check';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { NewMessageForm } from '@/app/(app)/tickets/[id]/new-message-form';
import { TicketStatus } from '@/app/(app)/tickets/[id]/ticket-status';
import { TicketTimeline } from '@/app/(app)/tickets/[id]/ticket-timeline';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  try {
    const ticketDetailsData = await getTicketDetails(params.id);

    if (ticketDetailsData.status !== 'success') {
      return {
        title: 'Ticket Details',
      };
    }

    const { ticket } = ticketDetailsData;

    return {
      title: `${ticket.title}`,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Ticket Not Found',
    };
  }
}

export default async function TicketDetailsPage(props: Props) {
  const params = await props.params;
  const [messagesData, ticketDetailsData] = await Promise.all([
    getTicketMessages(params.id),
    getTicketDetails(params.id),
  ]);

  if (
    messagesData.status !== 'success' ||
    ticketDetailsData.status !== 'success'
  ) {
    notFound();
  }

  const { ticket } = ticketDetailsData;

  const cookieStore = await cookies();
  const token = cookieStore.get('JWT_TOKEN')?.value;
  let currentUserId = null;

  if (token) {
    try {
      const decoded = decodeJwt(token) as JwtPayload;
      currentUserId = decoded.uuid;
    } catch (error) {
      console.error('Error decoding JWT:', error);
    }
  }

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16)-theme(spacing.12))] flex-col pt-4">
      <div className="flex w-full items-center justify-between border-b pb-8 pt-4">
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold">{ticket.title}</h2>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>Ticket ID: {ticket.id}</TooltipContent>
            </Tooltip>
          </div>
          <div className="mt-1 flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{new Date(ticket.created_at).toLocaleString()}</span>
            </div>
            {ticket.closed_at && (
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Archive className="h-4 w-4" />
                <span>{new Date(ticket.closed_at).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          {ticket.ticket_status === 'CLOSED' ? (
            <RoleCheck role="team" fallback={<></>}>
              <form>
                <Button
                  formAction={async () => {
                    'use server';
                    await updateTicketStatus(params.id, true);
                  }}
                  variant="secondary"
                >
                  <CircleDot /> Reopen Ticket
                </Button>
              </form>
            </RoleCheck>
          ) : ticket.resolution_status === 'RESOLVED' ? (
            <>
              <form>
                <Button
                  formAction={async () => {
                    'use server';
                    await updateTicketStatus(params.id, undefined, false);
                  }}
                  variant="secondary"
                >
                  <X /> Mark as Unresolved
                </Button>
              </form>
              <form>
                <Button
                  formAction={async () => {
                    'use server';
                    await updateTicketStatus(params.id, false);
                  }}
                  variant="secondary"
                >
                  <X /> Close Ticket
                </Button>
              </form>
            </>
          ) : (
            <>
              <form>
                <Button
                  formAction={async () => {
                    'use server';
                    await updateTicketStatus(params.id, undefined, true);
                  }}
                  variant="secondary"
                >
                  <Check /> Mark as Resolved
                </Button>
              </form>
              <form>
                <Button
                  formAction={async () => {
                    'use server';
                    await updateTicketStatus(params.id, false);
                  }}
                  variant="secondary"
                >
                  <X /> Close Ticket
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
      <div className="grid flex-grow grid-cols-3 gap-4 overflow-hidden pt-8">
        <div className="col-span-2 flex flex-col overflow-hidden">
          <TicketTimeline
            messages={messagesData.messages}
            currentUserId={currentUserId}
          />
          <NewMessageForm ticketId={params.id} />
        </div>
        <div>
          <TicketStatus ticket={ticket} />
        </div>
      </div>
    </div>
  );
}
