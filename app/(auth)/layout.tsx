import Image from 'next/image';

import { siteConfig } from '@/config/site';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container relative flex min-h-screen flex-col items-center justify-center bg-background md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-9 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/institute.jpg"
            alt="Institute Background"
            fill
            className="object-cover"
            quality={100}
            priority
          />
          <div className="absolute inset-0 bg-black opacity-60" />
        </div>
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
      <div className="flex justify-center p-2 lg:p-8">{children}</div>
    </div>
  );
}
