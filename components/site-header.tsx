'use client';

import { siteConfig } from '@/config/site';
import { CircleUser } from 'lucide-react';
import { toast } from 'sonner';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

import { ThemeSwitcher } from '@/components/theme-switcher';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';

export function SiteHeader({ role }: { role: string }) {
  const pathname = usePathname();

  return (
    <header
      className={cn(
        'container flex h-20 w-full flex-row items-center justify-between',
        pathname === '/' ? '' : 'border-b'
      )}
    >
      <div className="flex flex-row items-center gap-2 p-2">
        <div className="h-9 w-9">
          <AspectRatio ratio={1 / 1}>
            <Image
              src="/institute.png"
              alt="Institute Logo"
              fill
              className="object-contain"
            />
          </AspectRatio>
        </div>
        <h1 className="block text-2xl font-semibold">helpdesk.</h1>
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
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
