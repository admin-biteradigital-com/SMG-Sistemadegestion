import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import {
    Home, Package, Users, Truck, ShoppingCart, PackageOpen,
    Menu, X, User, LogOut
} from 'lucide-react';

const navigation = [
    { name: 'Dashboard', href: '/', icon: Home, color: 'hover:bg-teal-700' },
    { name: 'Órdenes de Carga', href: '/load-orders', icon: PackageOpen, color: 'hover:bg-orange-700' },
    { name: 'Ventas', href: '/sales', icon: ShoppingCart, color: 'hover:bg-teal-700' },
    { name: 'Productos', href: '/products', icon: Package, color: 'hover:bg-amber-700' },
    { name: 'Clientes', href: '/clients', icon: Users, color: 'hover:bg-teal-700' },
    { name: 'Proveedores', href: '/suppliers', icon: Truck, color: 'hover:bg-orange-700' },
];

export default function Layout() {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-stone-50 overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-amber-950 via-amber-900 to-amber-950 flex flex-col shadow-2xl
        transform transition-transform duration-300 ease-out
        lg:translate-x-0 lg:static lg:z-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                {/* Logo Header */}
                <div className="flex items-center justify-between px-6 h-20 border-b border-amber-700/30 flex-shrink-0 bg-black/20">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-teal-500 via-teal-600 to-orange-500 flex items-center justify-center text-white font-black text-xl shadow-xl ring-2 ring-white/20">
                            SMG
                        </div>
                        <div>
                            <span className="text-xl font-bold text-white tracking-tight">Sistema SMG</span>
                            <p className="text-xs text-amber-200">Gestión & Distribución</p>
                        </div>
                    </div>

                    {/* Mobile Close Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden text-amber-100 hover:text-white hover:bg-white/10"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="h-6 w-6" />
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                  group flex items-center gap-4 px-4 py-3.5 rounded-xl text-base font-medium
                  transition-all duration-200
                  ${isActive
                                        ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-900/50 scale-105'
                                        : 'text-amber-50 hover:bg-white/10 hover:text-white hover:scale-105'
                                    }
                `}
                            >
                                <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-amber-300'}`} />
                                <span className="flex-1">{item.name}</span>
                                {isActive && (
                                    <div className="w-2 h-2 rounded-full bg-white shadow-lg"></div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-amber-700/30 flex-shrink-0 bg-black/20">
                    <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/10 backdrop-blur-sm">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-400 to-orange-500 flex items-center justify-center text-white shadow-lg">
                            <User className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate text-white">Administrador</p>
                            <p className="text-xs text-amber-200 truncate">Sistema SMG</p>
                        </div>
                        <Button variant="ghost" size="icon" className="text-amber-200 hover:text-white hover:bg-white/10 flex-shrink-0">
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Mobile Header */}
                <header className="lg:hidden h-16 bg-white border-b border-stone-200 flex items-center justify-between px-4 flex-shrink-0 shadow-sm">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(true)}
                        className="text-stone-700 hover:text-stone-900 hover:bg-stone-100"
                    >
                        <Menu className="h-6 w-6" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-teal-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                            SMG
                        </div>
                        <span className="font-bold text-stone-900">Sistema SMG</span>
                    </div>
                    <div className="w-10" /> {/* Spacer */}
                </header>

                {/* Desktop Header */}
                <header className="hidden lg:flex h-16 bg-white border-b border-stone-200 items-center justify-between px-8 flex-shrink-0 shadow-sm">
                    <div>
                        <h1 className="text-xl font-bold text-stone-900">
                            {navigation.find((n) => n.href === location.pathname)?.name || 'Dashboard'}
                        </h1>
                        <p className="text-xs text-stone-500 mt-0.5">Sistema de Gestión y Distribución</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="text-right mr-3">
                            <p className="text-sm font-semibold text-stone-900">Administrador</p>
                            <p className="text-xs text-stone-500">Sesión activa</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-500 to-orange-500 flex items-center justify-center text-white shadow-md">
                            <User className="h-5 w-5" />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto bg-stone-50 custom-scrollbar">
                    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
