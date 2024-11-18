import type { Metadata } from 'next';

import { fetchUserData } from '@/lib/actions/user';

import ProfilePageClient from './page.client';

export const metadata: Metadata = {
  title: 'Profile',
};

export default async function ProfilePage() {
  const data = await fetchUserData();

  return <ProfilePageClient userData={data} />;
}
