'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Basic auth check
        const token = localStorage.getItem('siglo_token');
        const userData = localStorage.getItem('siglo_user');

        if (!token || !userData) {
            router.push('/login');
        } else {
            setUser(JSON.parse(userData));
            setLoading(false);
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('siglo_token');
        localStorage.removeItem('siglo_user');
        router.push('/login');
    };

    if (loading) return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-500">Cargando plataforma...</div>;

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden text-gray-900 dark:text-gray-100 transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-64 bg-sidebar-bg text-sidebar-fg flex-shrink-0 flex flex-col shadow-2xl z-10 transition-colors duration-300">
                <div className="h-16 flex items-center px-6 border-b border-gray-700/50">
                    <h1 className="text-xl font-black tracking-wider text-white">SIGLO</h1>
                </div>

                <div className="p-4 border-b border-gray-700/50">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Entorno Activo</p>
                    <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-green-400"></span>
                        <p className="font-semibold text-sm truncate">{user?.tenantId}</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    <Link href="/dashboard" className="flex items-center px-3 py-2.5 bg-blue-600/10 text-blue-400 rounded-lg hover:bg-blue-600/20 transition-all font-medium text-sm">
                        Panel de Control
                    </Link>
                    <Link href="/dashboard/products" className="flex items-center px-3 py-2.5 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-all font-medium text-sm">
                        Logística / Productos
                    </Link>
                    <Link href="/dashboard/orders" className="flex items-center px-3 py-2.5 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-all font-medium text-sm">
                        Órdenes Comerciales
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-700/50">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center px-4 py-2 text-sm text-red-400 bg-red-400/10 hover:bg-red-400/20 rounded-lg transition-all font-medium"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700/50 flex items-center justify-between px-8 z-0 shadow-sm transition-colors duration-300">
                    <h2 className="font-semibold text-lg">Workframe Dashboard</h2>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Hola, <strong className="text-gray-900 dark:text-white">{user?.username}</strong></span>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 shadow-md"></div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-6xl mx-auto animate-in slide-in-from-bottom-4 duration-500 fade-in">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
