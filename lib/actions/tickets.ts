'use server';

import { cookies } from 'next/headers';

interface CreateTicketParams {
  title: string;
  subcategory_id: string;
  initial_message: string;
}

export async function createTicket({
  title,
  subcategory_id,
  initial_message,
}: CreateTicketParams) {
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
