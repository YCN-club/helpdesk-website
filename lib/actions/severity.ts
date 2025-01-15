'use server';

import { redirect } from 'next/navigation';

import type { Ticket } from '@/types';

import { runtimeEnv } from '@/config/env';

import { getToken, handleApiResponse } from '@/lib/api';
import { AuthenticationError } from '@/lib/api';

export async function getCategories(): Promise<
  Ticket['subcategory']['category'][]
> {
  try {
    const token = await getToken();
    const response = await fetch(`${runtimeEnv.BACKEND_URL}/options/severity`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    const data = await handleApiResponse(response);
    return data.options;
  } catch (error) {
    if (error instanceof AuthenticationError && error.expired) {
      redirect('/?session_expired=true');
    }
    console.error(`Error getting categories:`, error);
    throw error;
  }
}
