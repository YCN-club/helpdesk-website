import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { ThemeSwitcher } from '@/components/theme-switcher';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SidebarProvider>
        <div className="flex h-screen w-full overflow-hidden">
          <AppSidebar />
          <SidebarInset className="!ml-0 flex flex-grow flex-col overflow-hidden">
            <main className="container flex-1 overflow-y-auto py-4">
              <div className="flex h-12 items-center justify-between">
                <SidebarTrigger />
                <ThemeSwitcher />
              </div>
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </>
  );
}
