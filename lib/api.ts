import { cookies } from 'next/headers';

export class AuthenticationError extends Error {
  constructor(
    message = 'Authentication required',
    public expired = false
  ) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function getToken(): string {
  const token = cookies().get('JWT_TOKEN')?.value;
  if (!token) {
    throw new AuthenticationError('No JWT token found', true);
  }
  return token;
}

// Helper function to handle API responses
export async function handleApiResponse(response: Response) {
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
