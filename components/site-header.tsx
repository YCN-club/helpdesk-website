'use client';

import { UserCircle } from '@phosphor-icons/react';
import { toast } from 'sonner';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { siteConfig } from '@/config/site';

import { cn } from '@/lib/utils';

import { ThemeSwitcher } from '@/components/theme-switcher';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';

export function SiteHeader({ role }: { role: 'USER' | 'RESOLVER' | 'ADMIN' }) {
  const pathname = usePathname();

  return (
    <header
      className={cn(
        'container flex h-20 w-full flex-row items-center justify-between',
        pathname === '/' ? '' : 'border-b'
      )}
    >
      <div className="flex flex-row items-center gap-2 p-2">
        <div className="flex flex-row items-center space-x-0.5 text-xl font-semibold tracking-tight">
          <Image
            src="/logo.png"
            alt="Institute Logo"
            height={30}
            width={30}
            className="dark:brightness-0 dark:invert"
          />
          <svg height="32" width="32" role="separator" viewBox="0 0 32 32">
            <path
              d="M22 5L9 28"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="stroke-black dark:stroke-white"
            />
          </svg>
          helpdesk.
        </div>
        {pathname !== '/' && (
          <div className="flex space-x-2 pl-4 text-sm font-medium">
            {siteConfig.navLinks.map(
              (item, index) =>
                item.href &&
                item.requiredRoles.includes(role) && (
                  <Button
                    key={index}
                    variant="ghost"
                    className="rounded-full"
                    onClick={() =>
                      item.href !== pathname &&
                      toast.info(`Loading ${item.title.toLowerCase()}...`)
                    }
                    asChild
                  >
                    <Link href={item.href}>{item.title}</Link>
                  </Button>
                )
            )}
          </div>
        )}
      </div>
      <div className="flex gap-2 p-2">
        <ThemeSwitcher />
        {pathname !== '/' && (
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full"
            asChild
          >
            <Link href="/profile">
              <UserCircle className="size-6" />
              <span className="sr-only">Toggle user menu</span>
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
