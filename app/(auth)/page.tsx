'use client';

import { siteConfig } from '@/config/site';
import { toast } from 'sonner';

import { Suspense, useEffect, useState } from 'react';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

import { UserAuthForm } from '@/components/auth-form';
import { ThemeSwitcher } from '@/components/theme-switcher';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AuthenticationPage() {
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const cookieEnabled = navigator.cookieEnabled;

    if (!cookieEnabled) {
      setMessage(
        'Cookies are disabled. Please enable cookies to use this site.'
      );
    }
  }, []);

  useEffect(() => {
    const error = searchParams.get('session_expired');
    if (error === 'true') {
      setMessage('Your session has expired. Please log in again.');
    }
  }, [searchParams]);

  return (
    <>
      <ThemeSwitcher className="absolute right-4 top-4 md:right-8 md:top-8" />
      <Card className="sm:w-[350px]">
        <CardHeader>
          <CardTitle>Login with Outlook</CardTitle>
          <CardDescription>
            Use your Manipal ID to log into HelpDesk.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserAuthForm />
        </CardContent>

        <Suspense fallback={null}>
          {message !== '' && (
            <CardFooter>
              <p className="text-sm text-destructive">
                Cookies are disabled. Please enable cookies to use this site.
              </p>
            </CardFooter>
          )}
        </Suspense>
      </Card>
    </>
  );
}
