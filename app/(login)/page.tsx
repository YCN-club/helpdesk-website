import { siteConfig } from '@/config/site';

import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { UserAuthForm } from '@/components/auth-form';
import { ThemeSwitcher } from '@/components/theme-switcher';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Login',
};

export default function AuthenticationPage() {
  return (
    <>
      <div className="container relative flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <ThemeSwitcher className="absolute right-4 top-4 md:right-8 md:top-8" />
        <div className="relative hidden h-full flex-col bg-muted p-9 text-white dark:border-r lg:flex">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/institute.jpg')" }}
          />
          <div className="absolute inset-0 bg-black opacity-60" />
          <div className="relative z-20 flex items-center text-xl font-semibold tracking-tight">
            <div className="flex flex-row items-center space-x-0.5">
              <Image
                src="/logo.png"
                alt="Institute Logo"
                height={28}
                width={28}
                className="brightness-0 invert"
              />
              <svg height="32" role="separator" viewBox="0 0 32 32" width="32">
                <path
                  d="M22 5L9 28"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="stroke-white"
                />
              </svg>
              helpdesk.
            </div>
          </div>
          <div className="relative z-20 mt-auto">
            <p className="text-lg font-semibold tracking-tight">
              {siteConfig.institute}
            </p>
          </div>
        </div>
        <div className="flex justify-center lg:p-8">
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
          </Card>
        </div>
      </div>
    </>
  );
}
