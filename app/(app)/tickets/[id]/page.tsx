import { decodeJwt } from 'jose';
import { Check, X } from 'lucide-react';

import { Suspense } from 'react';

import { Metadata, ResolvingMetadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import type { JwtPayload } from '@/types';

import { getTicketDetails, getTicketMessages } from '@/lib/actions/tickets';

import { RoleCheck } from '@/components/role-check';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import { NewMessageForm } from '@/app/(app)/tickets/[id]/new-message-form';
import { TicketStatus } from '@/app/(app)/tickets/[id]/ticket-status';
import { TicketTimeline } from '@/app/(app)/tickets/[id]/ticket-timeline';

type Props = {
  params: { id: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
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

export default async function TicketDetailsPage({ params }: Props) {
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

  const cookieStore = cookies();
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
          <h2 className="text-lg font-semibold">{ticket.title}</h2>
          <span className="text-sm text-muted-foreground">ID: {ticket.id}</span>
        </div>
        <div className="flex space-x-2">
          <RoleCheck role="user" fallback={<></>}>
            <Button variant="secondary">
              <Check /> Mark as Resolved
            </Button>
            <Button variant="secondary">
              <X /> Close Ticket
            </Button>
          </RoleCheck>
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
