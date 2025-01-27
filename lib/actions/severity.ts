'use server';

import { redirect } from 'next/navigation';

import type { Ticket } from '@/types';

import { runtimeEnv } from '@/config/env';

import { AuthenticationError, getToken, handleApiResponse } from '@/lib/api';

export async function getSeverity(): Promise<Ticket['severity'][]> {
  try {
    const token = await getToken();
    const response = await fetch(`${runtimeEnv.BACKEND_URL}/options/severity`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await handleApiResponse(response);
    return data.levels;
  } catch (error) {
    if (error instanceof AuthenticationError && error.expired) {
      redirect('/?session_expired=true');
    }
    console.error('Error fetching severity:', error);
    throw error;
  }
}

export async function createSeverity({
  name,
  level,
  note,
}: {
  name: string;
  level: number;
  note?: string;
}) {
  try {
    const token = await getToken();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('level', level.toString());
    if (note) {
      formData.append('note', note);
    }

    const response = await fetch(`${runtimeEnv.BACKEND_URL}/admin/severity`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    return await handleApiResponse(response);
  } catch (error) {
    if (error instanceof AuthenticationError && error.expired) {
      redirect('/?session_expired=true');
    }
    console.error('Error creating severity:', error);
    throw error;
  }
}
