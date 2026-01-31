import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Package, Calendar, Check, X } from "lucide-react"
import api from '@/api/axios';

export default function LoadOrders() {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [ordersRes, productsRes, vehiclesRes] = await Promise.all([
                api.get('/load-orders'),
                api.get('/products'),
                api.get('/vehicles')
            ]);
            setOrders(ordersRes.data);
            setProducts(productsRes.data);
            setVehicles(vehiclesRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const addProductToLoad = () => {
        setSelectedProducts([...selectedProducts, {
            id_producto_servicio: '',
            cantidad_cargada: '',
            temp: Math.random()
        }]);
    };

    const removeProduct = (tempId) => {
        setSelectedProducts(selectedProducts.filter(p => p.temp !== tempId));
    };

    const updateProduct = (tempId, field, value) => {
        setSelectedProducts(selectedProducts.map(p =>
            p.temp === tempId ? { ...p, [field]: value } : p
        ));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        try {
            const orderData = {
                id_vehiculo: formData.get('id_vehiculo'),
                id_ruta: formData.get('id_ruta') || null,
                productos: selectedProducts.filter(p => p.id_producto_servicio && p.cantidad_cargada)
            };

            await api.post('/load-orders', orderData);
            fetchData();
            setShowForm(false);
            setSelectedProducts([]);
        } catch (error) {
            console.error('Error creating load order:', error);
            alert('Error al crear orden de carga');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Órdenes de Carga</h2>
                    <p className="text-muted-foreground">
                        Preparación matutina - Cargar productos en vehículos
                    </p>
                </div>
                {!showForm && (
                    <Button onClick={() => setShowForm(true)} className="bg-orange-600 hover:bg-orange-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva Orden de Carga
                    </Button>
                )}
            </div>

            {showForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>Nueva Orden de Carga</CardTitle>
                        <CardDescription>Registra los productos que se cargarán en el vehículo</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Vehículo *</label>
                                    <select
                                        name="id_vehiculo"
                                        required
                                        className="w-full px-3 py-2 border rounded-md"
                                    >
                                        <option value="">Seleccionar vehículo</option>
                                        {vehicles.map(v => (
                                            <option key={v.id_vehiculo} value={v.id_vehiculo}>
                                                {v.patente_vehiculo} - {v.nombre_vehiculo}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">Productos a Cargar</label>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={addProductToLoad}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Añadir Producto
                                    </Button>
                                </div>

                                {selectedProducts.map((item) => (
                                    <div key={item.temp} className="flex gap-2">
                                        <select
                                            value={item.id_producto_servicio}
                                            onChange={(e) => updateProduct(item.temp, 'id_producto_servicio', e.target.value)}
                                            className="flex-1 px-3 py-2 border rounded-md"
                                        >
                                            <option value="">Seleccionar producto</option>
                                            {products.map(p => (
                                                <option key={p.id_producto_servicio} value={p.id_producto_servicio}>
                                                    {p.nombre_producto_servicio} (Stock: {p.stock_actual})
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="number"
                                            placeholder="Cantidad"
                                            value={item.cantidad_cargada}
                                            onChange={(e) => updateProduct(item.temp, 'cantidad_cargada', e.target.value)}
                                            className="w-32 px-3 py-2 border rounded-md"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeProduct(item.temp)}
                                            className="text-red-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                                    Crear Orden de Carga
                                </Button>
                                <Button type="button" variant="outline" onClick={() => {
                                    setShowForm(false);
                                    setSelectedProducts([]);
                                }}>
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Órdenes de Hoy</CardTitle>
                    <CardDescription>{orders.length} orden(es) de carga</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-8">Cargando...</div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="h-12 w-12 mx-auto text-muted-foreground/50" />
                            <h3 className="mt-4 font-semibold">Sin órdenes de carga</h3>
                            <p className="text-sm text-muted-foreground mt-2">
                                Crea una orden para comenzar la jornada
                            </p>
                            <Button onClick={() => setShowForm(true)} className="mt-4 bg-orange-600 hover:bg-orange-700">
                                <Plus className="mr-2 h-4 w-4" />
                                Crear Primera Orden
                            </Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Vehículo</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order.id_orden_carga}>
                                        <TableCell>{formatDate(order.fecha_carga)}</TableCell>
                                        <TableCell className="font-medium">
                                            Vehículo #{order.id_vehiculo}
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-800">
                                                Cargado
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" className="text-teal-600">
                                                Ver Detalle
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
