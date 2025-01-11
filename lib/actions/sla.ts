'use server';

import { redirect } from 'next/navigation';

import type { Ticket } from '@/types';

import { runtimeEnv } from '@/config/env';

import { getToken, handleApiResponse } from '@/lib/api';
import { AuthenticationError } from '@/lib/api';

export async function getSlas(): Promise<Ticket['sla'][]> {
  try {
    const token = getToken();
    const response = await fetch(`${runtimeEnv.BACKEND_URL}/options/sla`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const data = await handleApiResponse(response);
    return data.slas;
  } catch (error) {
    if (error instanceof AuthenticationError && error.expired) {
      redirect('/?session_expired=true');
    }
    console.error('Error fetching tickets:', error);
    throw error;
  }
}
