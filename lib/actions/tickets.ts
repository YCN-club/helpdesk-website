'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import type { Ticket } from '@/types';

// Custom error classes
class AuthenticationError extends Error {
  constructor(
    message = 'Authentication required',
    public expired = false
  ) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Helper function to get token
function getToken(): string {
  const token = cookies().get('JWT_TOKEN')?.value;
  if (!token) {
    throw new AuthenticationError('Authentication required', true);
  }
  return token;
}

// Helper function to handle API responses
async function handleApiResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 401) {
      throw new AuthenticationError(
        'Session expired. Please log in again.',
        true
      );
    }
    throw new ApiError(
      errorData.message || `API error: ${response.statusText}`,
      response.status
    );
  }
  return response.json();
}

export async function getTickets(): Promise<Ticket[]> {
  try {
    const token = getToken();
    const response = await fetch(
      'https://helpdesk-staging.alphaspiderman.dev/api/tickets',
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

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

    const response = await fetch(
      'https://helpdesk-staging.alphaspiderman.dev/api/me/create',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

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
      `https://helpdesk-staging.alphaspiderman.dev/api/tickets/${ticketId}/messages`,
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
      `https://helpdesk-staging.alphaspiderman.dev/api/tickets/${ticketId}/status`,
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
      `https://helpdesk-staging.alphaspiderman.dev/api/tickets/${ticketId}`,
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
      `https://helpdesk-staging.alphaspiderman.dev/api/tickets/${ticketId}/messages`,
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

export async function getCategories() {
  try {
    const token = getToken();
    const response = await fetch(
      'https://helpdesk-staging.alphaspiderman.dev/api/options/category',
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );
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

export async function getSubcategories(categoryId: string) {
  try {
    const token = getToken();
    const response = await fetch(
      `https://helpdesk-staging.alphaspiderman.dev/api/options/category?category_id=${categoryId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );
    const data = await handleApiResponse(response);
    return data.options;
  } catch (error) {
    if (error instanceof AuthenticationError && error.expired) {
      redirect('/?session_expired=true');
    }
    console.error(
      `Error getting subcategories for category ${categoryId}:`,
      error
    );
    throw error;
  }
}
