'use client';

import {
  Bell,
  CreditCard,
  DotsThreeVertical,
  GearSix,
  House,
  type Icon,
  Plus,
  SealCheck,
  SignOut,
  Sparkle,
  Ticket,
} from '@phosphor-icons/react';

import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const data = {
  user: {
    name: 'Test User',
    email: 'example@learner.manipal.edu',
    avatar: '/avatars/shadcn.jpg',
  },
};

const items = [
  {
    title: 'Create Ticket',
    url: '/tickets/create',
    icon: Plus,
  },
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: House,
  },
  {
    title: 'Tickets',
    url: '/tickets',
    icon: Ticket,
  },
  {
    title: 'Admin Settings',
    url: '/settings',
    icon: GearSix,
  },
] satisfies {
  title: string;
  url: string;
  icon: Icon;
}[];

export function AppSidebar() {
  const pathname = usePathname();
  const isActive = (url: string) => pathname === url;

  return (
    <Sidebar variant="inset" collapsible="icon" className="h-full">
      <SidebarHeader className="my-2 flex">
        <SidebarMenu>
          <SidebarMenuButton className="px-4 py-6" asChild>
            <a
              href="/dashboard"
              className="flex items-center text-xl font-semibold tracking-tight"
            >
              <Image
                src="/logo.png"
                alt="Institute Logo"
                height={28}
                width={28}
                className="dark:brightness-0 dark:invert"
              />
              <span className="-mx-1 flex items-center">
                <svg
                  height="32"
                  width="32"
                  role="separator"
                  viewBox="0 0 32 32"
                >
                  <path
                    d="M22 5L9 28"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="stroke-black dark:stroke-white"
                  />
                </svg>
                helpdesk.
              </span>
            </a>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} asChild>
                  <a
                    href={item.url}
                    className={cn(
                      isActive(item.url) &&
                        'bg-sidebar-accent text-sidebar-accent-foreground'
                    )}
                  >
                    <item.icon
                      weight={isActive(item.url) ? 'fill' : undefined}
                    />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={data.user.avatar} alt={data.user.name} />
                    <AvatarFallback className="rounded-lg bg-background dark:bg-secondary">
                      TU
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {data.user.name}
                    </span>
                    <span className="truncate text-xs">{data.user.email}</span>
                  </div>
                  <DotsThreeVertical weight="bold" className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={data.user.avatar}
                        alt={data.user.name}
                      />
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {data.user.name}
                      </span>
                      <span className="truncate text-xs">
                        {data.user.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Sparkle weight="bold" />
                    Upgrade to Pro
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <SealCheck weight="bold" />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard weight="bold" />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell weight="bold" />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <SignOut weight="bold" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
