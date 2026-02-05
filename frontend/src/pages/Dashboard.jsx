import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Package,
    ShoppingCart,
    Users,
    TrendingUp,
    AlertTriangle,
    DollarSign,
    ArrowUpRight,
    Clock
} from "lucide-react";
import api from '@/api/axios';

export default function Dashboard() {
    const [stats, setStats] = useState({
        todaySales: 0,
        todayAmount: 0,
        pendingSales: 0,
        lowStockCount: 0,
        totalProducts: 0,
        totalClients: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [salesStats, productsRes, clientsRes] = await Promise.all([
                api.get('/sales/stats'),
                api.get('/products?page=1&limit=1'),
                api.get('/clients')
            ]);

            const lowStock = productsRes.data.data?.filter(p =>
                p.stock_actual <= p.stock_seguridad_minimo
            ).length || 0;

            setStats({
                todaySales: salesStats.data.todaySalesCount || 0,
                todayAmount: salesStats.data.todaySalesAmount || 0,
                pendingSales: salesStats.data.pendingSales || 0,
                lowStockCount: lowStock,
                totalProducts: productsRes.data.meta?.totalRecords || 0,
                totalClients: clientsRes.data?.length || 0
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-6">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-2xl glass p-8 border border-white/20"
            >
                <div className="absolute inset-0 gradient-teal-emerald opacity-10"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl font-bold gradient-teal-emerald bg-clip-text text-transparent mb-2">
                        Bienvenido a SIGLO
                    </h1>
                    <p className="text-stone-600 text-lg">
                        Tu centro de comando operacional
                    </p>
                </div>
            </motion.div>

            {/* Bento Grid Layout */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                {/* Large Card: Today's Revenue */}
                <motion.div variants={itemVariants} className="lg:col-span-2 lg:row-span-2">
                    <Link to="/sales">
                        <Card className="h-full glass border-white/20 hover:shadow-teal transition-smooth group overflow-hidden">
                            <div className="absolute inset-0 gradient-teal-emerald opacity-5 group-hover:opacity-10 transition-smooth"></div>
                            <CardHeader className="relative z-10">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-stone-600">Ventas de Hoy</CardTitle>
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 shadow-teal">
                                        <DollarSign className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-5xl font-bold gradient-teal-emerald bg-clip-text text-transparent">
                                            ${stats.todayAmount.toLocaleString('es-CL')}
                                        </p>
                                        <p className="text-stone-500 mt-2 flex items-center gap-2">
                                            <span className="text-2xl font-semibold text-stone-700">{stats.todaySales}</span>
                                            transacciones completadas
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 text-emerald-600">
                                        <TrendingUp className="h-4 w-4" />
                                        <span className="text-sm font-medium">En tiempo real</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </motion.div>

                {/* Pending Sales */}
                <motion.div variants={itemVariants}>
                    <Link to="/sales">
                        <Card className="glass border-white/20 hover:shadow-xl transition-smooth group h-full">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm text-stone-600">Pendientes</CardTitle>
                                    <Clock className="h-5 w-5 text-violet-500" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-4xl font-bold text-stone-900">{stats.pendingSales}</p>
                                <p className="text-sm text-stone-500 mt-1">Ventas por procesar</p>
                            </CardContent>
                        </Card>
                    </Link>
                </motion.div>

                {/* Low Stock Alert */}
                <motion.div variants={itemVariants}>
                    <Link to="/products">
                        <Card className="glass border-orange-200/50 hover:shadow-xl transition-smooth group h-full">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm text-stone-600">Stock Crítico</CardTitle>
                                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-4xl font-bold text-orange-600">{stats.lowStockCount}</p>
                                <p className="text-sm text-stone-500 mt-1">Productos bajo mínimo</p>
                            </CardContent>
                        </Card>
                    </Link>
                </motion.div>

                {/* Total Products */}
                <motion.div variants={itemVariants}>
                    <Link to="/products">
                        <Card className="glass border-white/20 hover:shadow-xl transition-smooth group h-full">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm text-stone-600">Catálogo</CardTitle>
                                    <Package className="h-5 w-5 text-teal-500" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-4xl font-bold text-stone-900">{stats.totalProducts}</p>
                                <p className="text-sm text-stone-500 mt-1">Productos activos</p>
                            </CardContent>
                        </Card>
                    </Link>
                </motion.div>

                {/* Total Clients */}
                <motion.div variants={itemVariants}>
                    <Link to="/clients">
                        <Card className="glass border-white/20 hover:shadow-xl transition-smooth group h-full">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm text-stone-600">Clientes</CardTitle>
                                    <Users className="h-5 w-5 text-violet-500" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-4xl font-bold text-stone-900">{stats.totalClients}</p>
                                <p className="text-sm text-stone-500 mt-1">Base de datos</p>
                            </CardContent>
                        </Card>
                    </Link>
                </motion.div>

                {/* Quick Action: New Sale */}
                <motion.div variants={itemVariants} className="lg:col-span-2">
                    <Link to="/sales/new">
                        <Card className="glass border-white/20 hover:shadow-teal transition-smooth group h-full overflow-hidden">
                            <div className="absolute inset-0 gradient-violet opacity-5 group-hover:opacity-10 transition-smooth"></div>
                            <CardContent className="pt-6 relative z-10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-2xl font-bold text-stone-900 mb-1">Nueva Venta</h3>
                                        <p className="text-stone-600">Registrar transacción rápida</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 shadow-xl group-hover:scale-110 transition-smooth">
                                        <ShoppingCart className="h-8 w-8 text-white" />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center text-violet-600 font-medium">
                                    <span>Ir al punto de venta</span>
                                    <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}
