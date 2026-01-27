import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    HomeIcon, CubeIcon, UsersIcon, TruckIcon, ShoppingCartIcon,
    Bars3Icon, XMarkIcon
} from '@heroicons/react/24/outline';

const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Productos', href: '/products', icon: CubeIcon },
    { name: 'Clientes', href: '/clients', icon: UsersIcon },
    { name: 'Proveedores', href: '/suppliers', icon: TruckIcon },
    { name: 'Ventas', href: '/sales', icon: ShoppingCartIcon },
];

export default function Layout() {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-amber-900 to-amber-950 
        transform transition-transform duration-300 ease-in-out 
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                {/* Logo Header */}
                <div className="flex items-center gap-3 px-6 h-16 border-b border-amber-800/50">
                    <img
                        src="/logo.jpg"
                        alt="SMG"
                        className="h-10 w-10 rounded-lg object-cover shadow-md"
                    />
                    <span className="text-xl font-bold text-amber-50 tracking-tight">SMG Sistema</span>

                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="ml-auto lg:hidden text-amber-200 hover:text-white"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                  flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${isActive
                                        ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/50'
                                        : 'text-amber-100 hover:bg-amber-800/50 hover:text-white'
                                    }
                `}
                            >
                                <item.icon className="h-5 w-5 flex-shrink-0" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-amber-800/50">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold text-sm">
                            AD
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">Admin</p>
                            <p className="text-xs text-amber-300 truncate">Administrador</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* Mobile Header */}
                <header className="lg:hidden h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                    >
                        <Bars3Icon className="h-6 w-6" />
                    </button>
                    <span className="font-semibold text-gray-900">SMG</span>
                    <div className="w-10" /> {/* Spacer */}
                </header>

                {/* Desktop Header */}
                <header className="hidden lg:block h-14 bg-white border-b border-gray-200 px-6">
                    <div className="h-full flex items-center">
                        <h1 className="text-lg font-semibold text-gray-900">
                            {navigation.find((n) => n.href === location.pathname)?.name || 'Dashboard'}
                        </h1>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto">
                    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
