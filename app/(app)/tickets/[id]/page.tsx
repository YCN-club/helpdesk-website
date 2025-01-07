import { decodeJwt } from 'jose';

import { Suspense } from 'react';

import { Metadata, ResolvingMetadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import type { JwtPayload } from '@/types';

import { getTicketDetails, getTicketMessages } from '@/lib/actions/tickets';

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
      <div className="grid flex-grow grid-cols-3 gap-4 overflow-hidden">
        <div className="col-span-2 flex flex-col overflow-hidden">
          <Card className="flex h-full flex-col">
            <CardHeader className="flex-shrink-0">
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold">{ticket.title}</h2>
                <span className="text-sm text-muted-foreground">
                  ID: {ticket.id}
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-grow flex-col overflow-hidden">
              <Suspense fallback={<div>Loading messages...</div>}>
                <TicketTimeline
                  messages={messagesData.messages}
                  currentUserId={currentUserId}
                />
              </Suspense>
              <NewMessageForm ticketId={params.id} />
            </CardContent>
          </Card>
        </div>
        <div className="overflow-y-auto">
          <TicketStatus ticket={ticket} />
        </div>
      </div>
    </div>
  );
}
