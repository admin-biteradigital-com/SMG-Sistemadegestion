import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, ShoppingCart, Package, Truck, TrendingUp, AlertCircle } from "lucide-react"
import api from '@/api/axios';

export default function Sales() {
    const [todayStats, setTodayStats] = useState({
        sales: 0,
        amount: 0,
        pending: 0
    });
    const [recentSales, setRecentSales] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [salesRes, productsRes] = await Promise.all([
                api.get('/sales'),
                api.get('/products')
            ]);

            // Calculate today's stats
            const today = new Date().toDateString();
            const todaySales = salesRes.data.filter(s =>
                new Date(s.fecha_orden_venta).toDateString() === today
            );

            setTodayStats({
                sales: todaySales.length,
                amount: todaySales.reduce((sum, sale) => sum + parseFloat(sale.total_venta || 0), 0),
                pending: todaySales.filter(s => s.estado_orden_venta === 'pendiente').length
            });

            setRecentSales(salesRes.data.slice(0, 5));

            // Find low stock products
            const lowStock = productsRes.data.filter(p =>
                p.stock_actual < p.stock_seguridad_minimo
            );
            setLowStockProducts(lowStock);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    const quickActions = [
        {
            title: 'Nueva Venta',
            description: 'Registrar venta a cliente',
            icon: ShoppingCart,
            href: '/sales/new',
            color: 'bg-teal-600 hover:bg-teal-700'
        },
        {
            title: 'Orden de Carga',
            description: 'Preparar vehículo para distribución',
            icon: Package,
            href: '/load-orders',
            color: 'bg-orange-600 hover:bg-orange-700'
        },
        {
            title: 'Gestionar Productos',
            description: 'Ver y editar inventario',
            icon: Truck,
            href: '/products',
            color: 'bg-amber-600 hover:bg-amber-700'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Ventas</h2>
                <p className="text-muted-foreground">
                    Gestión de ventas y operaciones diarias
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ventas de Hoy</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-teal-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{todayStats.sales}</div>
                        <p className="text-xs text-muted-foreground">
                            ${todayStats.amount.toFixed(2)} en total
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                        <Package className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{todayStats.pending}</div>
                        <p className="text-xs text-muted-foreground">
                            Órdenes por completar
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Alertas de Stock</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{lowStockProducts.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Productos bajo mínimo
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Acciones Rápidas</CardTitle>
                    <CardDescription>Accede a las operaciones más frecuentes</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                    {quickActions.map((action) => {
                        const Icon = action.icon;
                        return (
                            <Link
                                key={action.title}
                                to={action.href}
                                className={`flex flex-col items-start gap-3 p-4 rounded-lg border hover:bg-accent transition-colors`}
                            >
                                <div className={`p-2 rounded-md ${action.color.split(' ')[0]} text-white`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="font-medium">{action.title}</div>
                                    <div className="text-sm text-muted-foreground">{action.description}</div>
                                </div>
                            </Link>
                        );
                    })}
                </CardContent>
            </Card>

            {/* Recent Sales */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Ventas Recientes</CardTitle>
                            <CardDescription>Últimas transacciones registradas</CardDescription>
                        </div>
                        <Button size="sm" variant="outline">Ver Todas</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {recentSales.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No hay ventas registradas aún</p>
                            <Button className="mt-4 bg-teal-600 hover:bg-teal-700">
                                <Plus className="mr-2 h-4 w-4" />
                                Registrar Primera Venta
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentSales.map((sale, idx) => (
                                <div key={idx} className="flex items-center justify-between border-b pb-3 last:border-0">
                                    <div>
                                        <p className="font-medium">Orden #{sale.id_orden_venta}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Cliente #{sale.id_cliente}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">${sale.total_venta}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(sale.fecha_orden_venta).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Low Stock Alerts */}
            {lowStockProducts.length > 0 && (
                <Card className="border-red-200 bg-red-50/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-900">
                            <AlertCircle className="h-5 w-5" />
                            Alertas de Stock Bajo
                        </CardTitle>
                        <CardDescription>Productos que requieren reabastecimiento</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {lowStockProducts.map(product => (
                                <div key={product.id_producto_servicio} className="flex items-center justify-between p-3 bg-white rounded-md border">
                                    <div>
                                        <p className="font-medium">{product.nombre_producto_servicio}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Stock actual: {product.stock_actual} | Mínimo: {product.stock_seguridad_minimo}
                                        </p>
                                    </div>
                                    <Button size="sm" variant="outline">Reabastecer</Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
