'use server';

import { decodeJwt } from 'jose';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import type { JwtPayload } from '@/types';

import { runtimeEnv } from '@/config/env';

import { getToken } from '@/lib/api';
import { ApiError, AuthenticationError } from '@/lib/api';

const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getJwt(): Promise<JwtPayload> {
  try {
    const token = getToken();
    const payload = (await decodeJwt(token)) as JwtPayload;
    return payload;
  } catch (error) {
    if (error instanceof AuthenticationError) {
      redirect('/?session_expired=true');
    }
    console.error('Failed to decode JWT:', error);
    throw new Error('Invalid JWT token');
  }
}

export async function registerUser(
  formData: FormData,
  retryCount = 0
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = getToken();

    const dataToSend = new FormData();
    dataToSend.append('name', formData.get('name') as string);
    dataToSend.append('email', formData.get('email') as string);

    const otherFields = [
      'yearOfGraduation',
      'degree',
      'hostelBlock',
      'roomNumber',
    ];
    const dataObject = otherFields.reduce(
      (acc, field) => {
        acc[field] = { name: field, value: formData.get(field) as string };
        return acc;
      },
      {} as Record<string, { name: string; value: string }>
    );

    dataToSend.append('data', JSON.stringify(dataObject));

    const response = await fetch(`${runtimeEnv.BACKEND_URL}/me/register`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: dataToSend,
    });

    const responseData = await response.json();

    if (response.ok && responseData.authenticated) {
      // Set the new JWT_TOKEN cookie
      (await cookies()).set('JWT_TOKEN', responseData.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });

      return { success: true };
    } else {
      if (
        responseData.message ===
          'Please attempt to login after a few minutes' &&
        retryCount < MAX_RETRIES
      ) {
        await delay(RETRY_DELAY);
        return registerUser(formData, retryCount + 1);
      }
      throw new ApiError(
        responseData.message || 'Failed to register user',
        response.status
      );
    }
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof AuthenticationError && error.expired) {
      redirect('/?session_expired=true');
    }
    if (
      error instanceof ApiError &&
      error.message === 'Please attempt to login after a few minutes'
    ) {
      return {
        success: false,
        error:
          'Registration is temporarily unavailable. Please try again in a few minutes.',
      };
    }
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred. Please try again later.',
    };
  }
}

export async function logoutUser() {
  (await cookies()).delete('JWT_TOKEN');
  redirect('/');
}
