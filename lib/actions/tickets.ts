'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import type { Ticket } from '@/types';

import { runtimeEnv } from '@/config/env';

import { getToken, handleApiResponse } from '@/lib/api';
import { AuthenticationError } from '@/lib/api';

export async function getTickets(): Promise<Ticket[]> {
  try {
    const token = getToken();
    const response = await fetch(`${runtimeEnv.BACKEND_URL}/tickets`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const data = await handleApiResponse(response);
    return data.tickets;
  } catch (error) {
    if (error instanceof AuthenticationError && error.expired) {
      redirect('/?session_expired=true');
    }
    console.error('Error fetching tickets:', error);
    throw error;
  }
}

export async function createTicket({
  title,
  subcategory_id,
  initial_message,
}: {
  title: string;
  subcategory_id: string;
  initial_message: string;
}) {
  try {
    const token = getToken();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('subcategory_id', subcategory_id);
    formData.append('initial_message', initial_message);

    const response = await fetch(`${runtimeEnv.BACKEND_URL}/me/create`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await handleApiResponse(response);
    revalidatePath('/tickets');
    return data;
  } catch (error) {
    if (error instanceof AuthenticationError && error.expired) {
      redirect('/?session_expired=true');
    }
    console.error('Error creating ticket:', error);
    throw error;
  }
}

export async function getTicketMessages(ticketId: string) {
  try {
    const token = getToken();
    const response = await fetch(
      `${runtimeEnv.BACKEND_URL}/tickets/${ticketId}/messages`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return await handleApiResponse(response);
  } catch (error) {
    if (error instanceof AuthenticationError && error.expired) {
      redirect('/?session_expired=true');
    }
    console.error(`Error fetching messages for ticket ${ticketId}:`, error);
    throw error;
  }
}

export async function getTicketStatus(ticketId: string) {
  try {
    const token = getToken();
    const response = await fetch(
      `${runtimeEnv.BACKEND_URL}/tickets/${ticketId}/status`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return await handleApiResponse(response);
  } catch (error) {
    if (error instanceof AuthenticationError && error.expired) {
      redirect('/?session_expired=true');
    }
    console.error(`Error fetching status for ticket ${ticketId}:`, error);
    throw error;
  }
}

export async function getTicketDetails(ticketId: string) {
  try {
    const token = getToken();
    const response = await fetch(
      `${runtimeEnv.BACKEND_URL}/tickets/${ticketId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return await handleApiResponse(response);
  } catch (error) {
    if (error instanceof AuthenticationError && error.expired) {
      redirect('/?session_expired=true');
    }
    console.error(`Error fetching details for ticket ${ticketId}:`, error);
    throw error;
  }
}

export async function addTicketMessage(ticketId: string, message: string) {
  try {
    const token = getToken();
    const formData = new FormData();
    formData.append('content', message);

    const response = await fetch(
      `${runtimeEnv.BACKEND_URL}/tickets/${ticketId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await handleApiResponse(response);
    revalidatePath(`/tickets/${ticketId}`);
    return data;
  } catch (error) {
    if (error instanceof AuthenticationError && error.expired) {
      redirect('/?session_expired=true');
    }
    console.error(`Error adding message to ticket ${ticketId}:`, error);
    throw error;
  }
}
