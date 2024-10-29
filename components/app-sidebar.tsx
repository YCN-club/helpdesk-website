import Image from 'next/image';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export function AppSidebar() {
  return (
    <Sidebar variant="inset" className="h-full">
      <SidebarHeader className="m-4 flex items-start">
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
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent></SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
