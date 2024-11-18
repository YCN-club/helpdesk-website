import { Metadata } from 'next';

import CreateTicketPageClient from '@/app/(app)/tickets/create/page.client';

export const metadata: Metadata = {
  title: 'Create Ticket',
};

export default function CreateTicketPage() {
  return <CreateTicketPageClient />;
}
