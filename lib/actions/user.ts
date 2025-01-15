'use server';

import { decodeJwt } from 'jose';

import type { JwtPayload } from '@/types';

import { runtimeEnv } from '@/config/env';

import { getToken } from '@/lib/api';

class AuthenticationError extends Error {
  redirect: boolean;
  constructor(message: string, redirect: boolean) {
    super(message);
    this.name = 'AuthenticationError';
    this.redirect = redirect;
  }
}

export async function fetchUserData() {
  try {
    const token = await getToken();
    const decoded = decodeJwt(token) as JwtPayload;

    const response = await fetch(`${runtimeEnv.BACKEND_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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
