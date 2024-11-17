'use server';

import { cookies } from 'next/headers';

export async function createTicket({
  title,
  subcategory_id,
  initial_message,
}: {
  title: string;
  subcategory_id: string;
  initial_message: string;
}) {
  const cookieStore = cookies();
  const token = cookieStore.get('JWT_TOKEN')?.value;

  if (!token) {
    throw new Error('No authentication token found');
  }

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

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create ticket');
  }

  return await response.json();
}

export async function getTicketMessages(ticketId: string) {
  const cookieStore = cookies();
  const token = cookieStore.get('JWT_TOKEN')?.value;

  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(
    `https://helpdesk-staging.alphaspiderman.dev/api/tickets/${ticketId}/messages`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch ticket messages');
  }

  return response.json();
}

export async function getTicketStatus(ticketId: string) {
  const cookieStore = cookies();
  const token = cookieStore.get('JWT_TOKEN')?.value;

  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(
    `https://helpdesk-staging.alphaspiderman.dev/api/tickets/${ticketId}/status`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch ticket status');
  }

  return response.json();
}

export async function getTicketDetails(ticketId: string) {
  const cookieStore = cookies();
  const token = cookieStore.get('JWT_TOKEN')?.value;

  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(
    `https://helpdesk-staging.alphaspiderman.dev/api/tickets/${ticketId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch ticket details');
  }

  return response.json();
}

export async function addTicketMessage(ticketId: string, message: string) {
  const cookieStore = cookies();
  const token = cookieStore.get('JWT_TOKEN')?.value;

  if (!token) {
    throw new Error('Authentication required');
  }

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

  if (!response.ok) {
    throw new Error('Failed to add message');
  }

  return response.json();
}
