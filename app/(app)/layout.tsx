import { SiteHeader } from '@/components/site-header';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SiteHeader role={'USER'} />
      <div className="container flex-1">{children}</div>
    </>
  );
}
