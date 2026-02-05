import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Plus,
    ShoppingCart,
    Clock,
    CheckCircle2,
    AlertTriangle,
    TrendingUp,
    Calendar
} from "lucide-react";
import api from '@/api/axios';

export default function Sales() {
    const navigate = useNavigate();
    const [todayStats, setTodayStats] = useState({
        sales: 0,
        amount: 0,
        pending: 0
    });
    const [recentSales, setRecentSales] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, salesRes] = await Promise.all([
                api.get('/sales/stats'),
                api.get('/sales?page=1&limit=5')
            ]);

            setTodayStats({
                sales: statsRes.data.todaySalesCount || 0,
                amount: statsRes.data.todaySalesAmount || 0,
                pending: statsRes.data.pendingSales || 0
            });

            const salesData = salesRes.data.data || salesRes.data;
            setRecentSales(salesData);
        } catch (error) {
            console.error('Error fetching sales data:', error);
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-6">
            {/* Header with CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-stone-900">Ventas</h1>
                    <p className="text-stone-600 mt-1">Gestiona tus transacciones y operaciones</p>
                </div>
                <Button
                    onClick={() => navigate('/sales/new')}
                    className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white shadow-teal"
                >
                    <Plus className="mr-2 h-5 w-5" />
                    Nueva Venta
                </Button>
            </div>

            {/* Stats Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
                {/* Today's Sales */}
                <motion.div variants={itemVariants}>
                    <Card className="glass border-white/20 hover:shadow-teal transition-smooth overflow-hidden">
                        <div className="absolute inset-0 gradient-teal-emerald opacity-5"></div>
                        <CardHeader className="relative z-10">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm text-stone-600">Ventas Hoy</CardTitle>
                                <div className="p-2 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500">
                                    <CheckCircle2 className="h-5 w-5 text-white" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <p className="text-4xl font-bold gradient-teal-emerald bg-clip-text text-transparent">
                                {todayStats.sales}
                            </p>
                            <p className="text-sm text-stone-500 mt-1">
                                ${todayStats.amount.toLocaleString('es-CL')} facturado
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Pending Sales */}
                <motion.div variants={itemVariants}>
                    <Card className="glass border-orange-200/50 hover:shadow-xl transition-smooth">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm text-stone-600">Pendientes</CardTitle>
                                <div className="p-2 rounded-lg bg-orange-100">
                                    <Clock className="h-5 w-5 text-orange-600" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold text-orange-600">{todayStats.pending}</p>
                            <p className="text-sm text-stone-500 mt-1">Requieren atención</p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Growth Indicator */}
                <motion.div variants={itemVariants}>
                    <Card className="glass border-white/20 hover:shadow-xl transition-smooth">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm text-stone-600">Tendencia</CardTitle>
                                <div className="p-2 rounded-lg bg-violet-100">
                                    <TrendingUp className="h-5 w-5 text-violet-600" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold text-violet-600">+12%</p>
                            <p className="text-sm text-stone-500 mt-1">vs. semana anterior</p>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

            {/* Recent Sales Table */}
            <Card className="glass border-white/20">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl">Ventas Recientes</CardTitle>
                            <p className="text-sm text-stone-500 mt-1">Últimas 5 transacciones</p>
                        </div>
                        <Calendar className="h-5 w-5 text-stone-400" />
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-stone-500">Cargando...</div>
                    ) : recentSales.length === 0 ? (
                        <div className="text-center py-12">
                            <ShoppingCart className="h-12 w-12 text-stone-300 mx-auto mb-3" />
                            <p className="text-stone-500">No hay ventas registradas hoy</p>
                            <Button
                                onClick={() => navigate('/sales/new')}
                                variant="outline"
                                className="mt-4"
                            >
                                Registrar primera venta
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentSales.map((sale, index) => (
                                <motion.div
                                    key={sale.id_orden_venta}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center justify-between p-4 rounded-xl hover:bg-stone-50 transition-smooth border border-stone-100"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500">
                                            <ShoppingCart className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-stone-900">
                                                Venta #{sale.id_orden_venta}
                                            </p>
                                            <p className="text-sm text-stone-500">
                                                {new Date(sale.fecha_orden).toLocaleDateString('es-CL')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-stone-900">
                                            ${parseFloat(sale.monto_total || 0).toLocaleString('es-CL')}
                                        </p>
                                        <p className="text-xs text-stone-500 capitalize">
                                            {sale.estado_pago || 'Pendiente'}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link to="/sales/new">
                    <Card className="glass border-white/20 hover:shadow-teal transition-smooth group overflow-hidden h-full">
                        <div className="absolute inset-0 gradient-teal-emerald opacity-5 group-hover:opacity-10 transition-smooth"></div>
                        <CardContent className="pt-6 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 shadow-lg group-hover:scale-110 transition-smooth">
                                    <Plus className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-stone-900">Punto de Venta</h3>
                                    <p className="text-stone-600">Registrar nueva transacción</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link to="/load-orders">
                    <Card className="glass border-white/20 hover:shadow-xl transition-smooth group overflow-hidden h-full">
                        <div className="absolute inset-0 gradient-orange opacity-5 group-hover:opacity-10 transition-smooth"></div>
                        <CardContent className="pt-6 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg group-hover:scale-110 transition-smooth">
                                    <AlertTriangle className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-stone-900">Órdenes de Carga</h3>
                                    <p className="text-stone-600">Preparar distribución</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
