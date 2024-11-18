'use server';

import type { JwtPayload } from '@/types';
import { decodeJwt } from 'jose';

import { cookies } from 'next/headers';

class AuthenticationError extends Error {
  redirect: boolean;
  constructor(message: string, redirect: boolean) {
    super(message);
    this.name = 'AuthenticationError';
    this.redirect = redirect;
  }
}

function getToken(): string {
  const token = cookies().get('JWT_TOKEN')?.value;
  if (!token) {
    throw new AuthenticationError('No JWT token found', true);
  }
  return token;
}

export async function fetchUserData() {
  try {
    const token = getToken();
    const decoded = decodeJwt(token) as JwtPayload;

    const response = await fetch(
      'https://helpdesk-staging.alphaspiderman.dev/api/me',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const data = await response.json();
    if (data.status !== 'success') {
      throw new Error('Invalid response from server');
    }

    return {
      name: decoded.name,
      email: decoded.email,
      data: data.user.data,
    };
  } catch (error) {
    if (error instanceof AuthenticationError && error.redirect) {
      // Handle redirect to login page if needed
      throw error;
    }
    console.error('Failed to fetch user data:', error);
    throw new Error('Failed to load user data');
  }
}
