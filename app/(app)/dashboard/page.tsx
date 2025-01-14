import { Metadata } from 'next';

import { getTickets } from '@/lib/actions/tickets';

import DashboardPageClient from './page.client';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function DashboardPage() {
  const tickets = await getTickets();

  return <DashboardPageClient tickets={tickets} />;
}
