'use client';

import {
  DotsThreeVertical,
  GearSix,
  House,
  type Icon,
  Plus,
  SignOut,
  Ticket,
  User,
} from '@phosphor-icons/react';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { getJwt } from '@/lib/actions/auth';
import { logoutUser } from '@/lib/actions/auth';
import { cn } from '@/lib/utils';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  SidebarMenuSkeleton,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';

const items = [
  {
    title: 'Create Ticket',
    url: '/tickets/create',
    icon: Plus,
    role: 'user',
  },
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: House,
    role: 'team',
  },
  {
    title: 'My Tickets',
    url: '/tickets',
    icon: Ticket,
    role: 'user',
  },
  {
    title: 'Admin Settings',
    url: '/settings/sla',
    icon: GearSix,
    role: 'sys_admin',
  },
] satisfies {
  title: string;
  url: string;
  icon: Icon;
  role: string;
}[];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (url: string) => pathname === url;
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    roles: string[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        setIsLoading(true);
        const jwtPayload = await getJwt();
        setUserData({
          name: jwtPayload.name,
          email: jwtPayload.email,
          roles: jwtPayload.roles,
        });
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // Handle the error appropriately, e.g., redirect to login page
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Sidebar variant="inset" collapsible="icon" className="h-full">
      <SidebarHeader className="my-2 flex">
        <SidebarMenu>
          <SidebarMenuButton className="px-4 py-6" asChild>
            <Link
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
            </Link>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarMenu>
            {isLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
              ))
              : items
                .filter((item) => userData?.roles.includes(item.role))
                .map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton tooltip={item.title} asChild>
                      <Link
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
                      </Link>
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
                  {isLoading ? (
                    <>
                      <Skeleton className="h-8 w-8 rounded-lg" />
                      <div className="grid flex-1 gap-1">
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-3 w-[80px]" />
                      </div>
                    </>
                  ) : (
                    <>
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarFallback className="rounded-lg bg-muted-foreground text-muted dark:bg-secondary dark:text-secondary-foreground">
                          {userData ? getInitials(userData.name) : '??'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {userData?.name || 'Unknown User'}
                        </span>
                        <span className="truncate text-xs">
                          {userData?.email || 'unknown@example.com'}
                        </span>
                      </div>
                    </>
                  )}
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
                      <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                        {userData ? getInitials(userData.name) : '??'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {userData?.name || 'Unknown User'}
                      </span>
                      <span className="truncate text-xs">
                        {userData?.email || 'unknown@example.com'}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onSelect={() => router.push('/profile')}>
                    <User weight="bold" />
                    Profile
                  </DropdownMenuItem>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <SignOut weight="bold" />
                        Log Out
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to log out?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will end your current session and redirect
                          you to the login page.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogAction onClick={() => logoutUser()}>
                          Log Out
                        </AlertDialogAction>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
