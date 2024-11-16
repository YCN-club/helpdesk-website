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

function SearchParamsHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('session_expired');
    if (error === 'true') {
      toast.error('Your session has expired. Please log in again.');
    }
  }, [searchParams]);

  return null;
}

export default function AuthenticationPage() {
  const [cookiesEnabled, setCookiesEnabled] = useState(true);

  useEffect(() => {
    const cookieEnabled = navigator.cookieEnabled;
    setCookiesEnabled(cookieEnabled);

    if (!cookieEnabled) {
      toast.error(
        'Cookies are disabled. Please enable cookies to use this site.'
      );
    }
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background">
      <ThemeSwitcher className="absolute right-4 top-4 md:right-8 md:top-8" />
      <Card className="w-full max-w-[350px]">
        <CardHeader>
          <CardTitle>Login with Outlook</CardTitle>
          <CardDescription>
            Use your Manipal ID to log into HelpDesk.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserAuthForm />
        </CardContent>

        {!cookiesEnabled && (
          <CardFooter>
            <p className="text-sm text-destructive">
              Cookies are disabled. Please enable cookies to use this site.
            </p>
          </CardFooter>
        )}
      </Card>
      <Suspense fallback={null}>
        <SearchParamsHandler />
      </Suspense>
    </div>
  );
}
