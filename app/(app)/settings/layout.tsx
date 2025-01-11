import Link from 'next/link';
export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex h-[calc(100vh-theme(spacing.16)-theme(spacing.12))]  w-full overflow-hidden bg-gray-100 rounded-lg">
            {/* Sidebar */}
            <aside className="h-screen w-64 shadow-lg rounded-l-lg">
                <nav className="flex flex-col p-4 space-y-2">
                    <Link href="/settings/sla" className="block px-4 py-2 rounded transition-colors duration-200 hover:bg-gray-200">
                        SLA
                    </Link>
                    <Link href="/settings/severity" className="block px-4 py-2 rounded transition-colors duration-200 hover:bg-gray-200">
                        Severity
                    </Link>
                    <Link href="/settings/support" className="block px-4 py-2 rounded transition-colors duration-200 hover:bg-gray-200">
                        Support User
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-grow bg-white overflow-y-auto p-4 rounded-r-lg">
                {children}
            </main>
        </div>
    );
}