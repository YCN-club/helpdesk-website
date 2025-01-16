'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { runtimeEnv } from '@/config/env';

import { AuthenticationError, getToken, handleApiResponse } from '@/lib/api';

export async function getStaff() {
  try {
    const token = await getToken();
    const response = await fetch(`${runtimeEnv.BACKEND_URL}/admin/staff`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await handleApiResponse(response);
  } catch (error) {
    if (error instanceof AuthenticationError && error.expired) {
      redirect('/?session_expired=true');
    }
    console.error('Error fetching staff:', error);
    throw error;
  }
}

export async function createStaff({
  email,
  userId,
  isSysAdmin,
}: {
  email?: string;
  userId?: string;
  isSysAdmin: boolean;
}) {
  try {
    const token = await getToken();
    const formData = new FormData();

    if (!email && !userId) {
      throw new Error('Either email or user_id must be provided');
    }

    email && formData.append('email', email);
    userId && formData.append('user_id', userId);
    formData.append('is_sys_admin', isSysAdmin.toString());

    const response = await fetch(`${runtimeEnv.BACKEND_URL}/admin/staff`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await handleApiResponse(response);
    revalidatePath('/admin/staff');
    return data;
  } catch (error) {
    if (error instanceof AuthenticationError && error.expired) {
      redirect('/?session_expired=true');
    }
    console.error('Error creating staff:', error);
    throw error;
  }
}
