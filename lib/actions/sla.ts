import { cookies } from 'next/headers';
import type { Ticket } from '@/types';
import { runtimeEnv } from '@/config/env';
import { redirect } from 'next/navigation';

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

export async function getSlas(): Promise<Ticket['sla'][]> {
    try {
        const token = getToken();
        const response = await fetch(`${runtimeEnv.BACKEND_URL}/options/sla`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        const data = await handleApiResponse(response);
        return data.slas;
    } catch (error) {
        if (error instanceof AuthenticationError && error.expired) {
            redirect('/?session_expired=true');
        }
        console.error('Error fetching tickets:', error);
        throw error;
    }
}
