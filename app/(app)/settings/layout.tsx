'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

const items: {
  name: string;
  href: string;
}[] = [
  {
    name: 'Categories',
    href: '/settings/categories',
  },
  {
    name: 'SLA',
    href: '/settings/sla',
  },
  {
    name: 'Severity',
    href: '/settings/severity',
  },
  {
    name: 'Support Users',
    href: '/settings/support',
  },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16)-theme(spacing.12))] w-full space-x-2 overflow-hidden py-4">
      {/* Sidebar */}
      <div className="flex min-w-36 flex-col space-y-2 text-sm">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'rounded px-4 py-2 transition-colors duration-200',
              item.href === pathname
                ? 'bg-accent/50 text-accent-foreground'
                : 'hover:bg-accent/50 hover:text-accent-foreground'
            )}
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto">{children}</main>
    </div>
  );
}
