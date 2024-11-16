'use server';

import { decodeJwt } from 'jose';

import { cookies } from 'next/headers';

interface JwtPayload {
  name: string;
  email: string;
  uuid: string;
  roles: string[];
  exp: string;
  iat: string;
  nbf: string;
  iss: string;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getJwt(): Promise<JwtPayload> {
  const cookieStore = cookies();
  const token = cookieStore.get('JWT_TOKEN')?.value;

  if (!token) {
    throw new Error('No JWT token found');
  }

  try {
    const payload = (await decodeJwt(token)) as JwtPayload;
    return payload;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    throw new Error('Invalid JWT token');
  }
}

export async function registerUser(
  formData: FormData,
  retryCount = 0
): Promise<{ success: boolean; error?: string }> {
  const cookieStore = cookies();
  const token = cookieStore.get('JWT_TOKEN');

  if (!token) {
    return {
      success: false,
      error: 'No authentication token found. Please log in again.',
    };
  }

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

  try {
    const response = await fetch(
      'https://helpdesk-staging.alphaspiderman.dev/api/me/register',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
        body: dataToSend,
      }
    );

    const responseData = await response.json();

    if (response.ok && responseData.authenticated) {
      // Set the new JWT_TOKEN cookie
      cookieStore.set('JWT_TOKEN', responseData.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });

      // Return success instead of redirecting
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
      throw new Error(responseData.message || 'Failed to register user');
    }
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error:
        (error as Error).message ===
        'Please attempt to login after a few minutes'
          ? 'Registration is temporarily unavailable. Please try again in a few minutes.'
          : (error as Error).message ||
            'An unexpected error occurred. Please try again later.',
    };
  }
}
