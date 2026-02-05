import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    ShoppingCart,
    Package,
    Users,
    TruckIcon,
    BarChart3,
    Settings,
    Menu,
    X
} from 'lucide-react';

const navigation = [
    { name: 'Inicio', href: '/', icon: Home },
    { name: 'Ventas', href: '/sales', icon: ShoppingCart },
    { name: 'Productos', href: '/products', icon: Package },
    { name: 'Clientes', href: '/clients', icon: Users },
    { name: 'Cargas', href: '/load-orders', icon: TruckIcon },
    { name: 'Reportes', href: '/reports', icon: BarChart3 },
];

export default function AppShell({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    return (
        <div className="min-h-screen bg-stone-50">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass border-b border-stone-200/50">
                <div className="flex items-center justify-between px-4 h-16">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-xl hover:bg-stone-100 transition-smooth"
                    >
                        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                    <h1 className="text-xl font-bold gradient-teal-emerald bg-clip-text text-transparent">
                        SIGLO
                    </h1>
                    <div className="w-10" /> {/* Spacer for centering */}
                </div>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 glass border-r border-stone-200/50 z-40">
                <div className="flex flex-col flex-1 min-h-0 pt-8 pb-4">
                    {/* Logo */}
                    <div className="flex items-center flex-shrink-0 px-6 mb-8">
                        <h1 className="text-2xl font-bold gradient-teal-emerald bg-clip-text text-transparent">
                            SIGLO
                        </h1>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-3 space-y-1">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`
                    group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-smooth
                    ${isActive
                                            ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-teal'
                                            : 'text-stone-700 hover:bg-stone-100'
                                        }
                  `}
                                >
                                    <item.icon
                                        className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-stone-500 group-hover:text-teal-600'}`}
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Settings at bottom */}
                    <div className="px-3 mt-auto">
                        <Link
                            to="/settings"
                            className="group flex items-center px-3 py-3 text-sm font-medium text-stone-700 rounded-xl hover:bg-stone-100 transition-smooth"
                        >
                            <Settings className="mr-3 h-5 w-5 text-stone-500 group-hover:text-teal-600" />
                            Configuración
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-64 glass-dark z-50 lg:hidden"
                        >
                            <div className="flex flex-col flex-1 min-h-0 pt-20 pb-4">
                                <nav className="flex-1 px-3 space-y-1">
                                    {navigation.map((item) => {
                                        const isActive = location.pathname === item.href;
                                        return (
                                            <Link
                                                key={item.name}
                                                to={item.href}
                                                onClick={() => setSidebarOpen(false)}
                                                className={`
                          group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-smooth
                          ${isActive
                                                        ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-teal'
                                                        : 'text-stone-100 hover:bg-white/10'
                                                    }
                        `}
                                            >
                                                <item.icon className="mr-3 h-5 w-5" />
                                                {item.name}
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="lg:pl-64 flex flex-col flex-1">
                <main className="flex-1 pt-16 lg:pt-0">
                    <div className="py-6 px-4 sm:px-6 lg:px-8">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {children}
                        </motion.div>
                    </div>
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 glass border-t border-stone-200/50 z-40">
                <nav className="flex justify-around items-center h-16 px-2">
                    {navigation.slice(0, 4).map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`
                  flex flex-col items-center justify-center flex-1 h-full transition-smooth
                  ${isActive ? 'text-teal-600' : 'text-stone-500'}
                `}
                            >
                                <item.icon className="h-6 w-6 mb-1" />
                                <span className="text-xs font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
