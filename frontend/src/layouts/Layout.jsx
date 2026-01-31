import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import {
    Home, Package, Users, Truck, ShoppingCart,
    Menu, X, User
} from 'lucide-react';

const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Productos', href: '/products', icon: Package },
    { name: 'Clientes', href: '/clients', icon: Users },
    { name: 'Proveedores', href: '/suppliers', icon: Truck },
    { name: 'Ventas', href: '/sales', icon: ShoppingCart },
];

export default function Layout() {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-background">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card border-r
        transform transition-transform duration-300 ease-in-out 
        lg:translate-x-0 lg:static
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                {/* Logo Header */}
                <div className="flex items-center justify-between px-6 h-16 border-b">
                    <div className="flex items-center gap-3">
                        <img
                            src="/logo.jpg"
                            alt="SMG"
                            className="h-8 w-8 rounded-lg object-cover"
                        />
                        <span className="text-lg font-bold">SMG Sistema</span>
                    </div>

                    {/* Mobile Close Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-6 space-y-1">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                  transition-colors
                  ${isActive
                                        ? 'bg-teal-600 text-white'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                    }
                `}
                            >
                                <Icon className="h-5 w-5 flex-shrink-0" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="h-8 w-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm font-semibold">
                            <User className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">Administrador</p>
                            <p className="text-xs text-muted-foreground truncate">admin@smg.com</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Mobile Header */}
                <header className="lg:hidden h-16 bg-card border-b flex items-center justify-between px-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </Button>
                    <span className="font-semibold">SMG</span>
                    <div className="w-10" /> {/* Spacer */}
                </header>

                {/* Desktop Header */}
                <header className="hidden lg:flex h-16 bg-card border-b items-center px-8">
                    <h1 className="text-xl font-semibold">
                        {navigation.find((n) => n.href === location.pathname)?.name || 'SMG'}
                    </h1>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto">
                    <div className="container mx-auto p-6 lg:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
