import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Plus,
    Package,
    Calendar,
    Check,
    X,
    Truck,
    Loader2,
    Search,
    ChevronRight,
    ClipboardList
} from "lucide-react";
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
        setLoading(true);
        try {
            const [ordersRes, productsRes, vehiclesRes] = await Promise.all([
                api.get('/load-orders'),
                api.get('/products'),
                api.get('/vehicles')
            ]);

            // Robust data handling
            setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : (ordersRes.data?.data || []));
            setProducts(Array.isArray(productsRes.data) ? productsRes.data : (productsRes.data?.data || []));
            setVehicles(Array.isArray(vehiclesRes.data) ? vehiclesRes.data : (vehiclesRes.data?.data || []));
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const addProductToLoad = () => {
        setSelectedProducts([...selectedProducts, {
            id_producto_servicio: '',
            cantidad_cargada: 1,
            temp: Math.random().toString(36).substr(2, 9)
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
                ID_Vehiculo: parseInt(formData.get('id_vehiculo')),
                ID_Ruta: formData.get('id_ruta') ? parseInt(formData.get('id_ruta')) : null,
                Items: selectedProducts
                    .filter(p => p.id_producto_servicio && p.cantidad_cargada)
                    .map(p => ({
                        ID_Producto_Servicio: parseInt(p.id_producto_servicio),
                        Cantidad_Cargada: parseInt(p.cantidad_cargada)
                    }))
            };

            await api.post('/load-orders', orderData);
            fetchData();
            setShowForm(false);
            setSelectedProducts([]);
            alert('Orden de carga registrada exitosamente');
        } catch (error) {
            console.error('Error creating load order:', error);
            alert('Error al crear orden de carga: ' + (error.response?.data?.details || error.message));
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Hoy';
        return new Date(dateString).toLocaleDateString('es-CL', {
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
                    <h2 className="text-3xl font-bold text-stone-900 flex items-center gap-2">
                        <Truck className="h-8 w-8 text-orange-600" />
                        Logística y Despacho
                    </h2>
                    <p className="text-stone-600 mt-1">
                        Preparación de carga matutina para distribución.
                    </p>
                </div>
                {!showForm && (
                    <Button
                        onClick={() => setShowForm(true)}
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-200"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva Orden de Carga
                    </Button>
                )}
            </div>

            {showForm && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="border-2 border-orange-100 shadow-2xl overflow-hidden rounded-[2rem]">
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-2"></div>
                        <CardHeader className="bg-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-2xl text-stone-900">Configurar Carga</CardTitle>
                                    <CardDescription>Asignación de productos a flota vehicular</CardDescription>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                                    <X className="h-6 w-6" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 bg-white">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-stone-700 flex items-center gap-2">
                                            <Truck className="h-4 w-4 text-orange-600" /> Vehículo Responsable *
                                        </label>
                                        <select
                                            name="id_vehiculo"
                                            required
                                            className="w-full px-4 py-3 bg-stone-50 border-2 border-stone-100 rounded-2xl focus:border-orange-500 outline-none transition-all font-medium"
                                        >
                                            <option value="">Seleccionar vehículo de la flota</option>
                                            {vehicles.map(v => (
                                                <option key={v.id_vehiculo} value={v.id_vehiculo}>
                                                    {v.patente} - {v.marca} {v.modelo}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b pb-4">
                                        <h3 className="font-bold text-stone-800 flex items-center gap-2">
                                            <Package className="h-5 w-5 text-orange-600" /> Detalle de Productos
                                        </h3>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={addProductToLoad}
                                            className="border-orange-200 text-orange-700 hover:bg-orange-50 rounded-xl"
                                        >
                                            <Plus className="h-4 w-4 mr-2" /> Agregar Item
                                        </Button>
                                    </div>

                                    <div className="space-y-3">
                                        {selectedProducts.map((item) => (
                                            <div key={item.temp} className="flex gap-3 animate-in fade-in slide-in-from-right-4 duration-300">
                                                <div className="flex-grow">
                                                    <select
                                                        value={item.id_producto_servicio}
                                                        onChange={(e) => updateProduct(item.temp, 'id_producto_servicio', e.target.value)}
                                                        className="w-full px-4 py-3 bg-stone-50 border-2 border-stone-100 rounded-2xl focus:border-orange-500 outline-none transition-all font-medium"
                                                    >
                                                        <option value="">Buscar producto...</option>
                                                        {products.map(p => (
                                                            <option key={p.id_producto_servicio} value={p.id_producto_servicio}>
                                                                {p.nombre_producto_servicio} (Stock: {p.stock_actual || 0})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="w-32">
                                                    <input
                                                        type="number"
                                                        placeholder="Cant."
                                                        value={item.cantidad_cargada}
                                                        onChange={(e) => updateProduct(item.temp, 'cantidad_cargada', e.target.value)}
                                                        className="w-full px-4 py-3 bg-stone-50 border-2 border-stone-100 rounded-2xl focus:border-orange-500 outline-none transition-all font-bold text-center"
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeProduct(item.temp)}
                                                    className="h-12 w-12 rounded-xl text-stone-300 hover:text-red-500 hover:bg-red-50"
                                                >
                                                    <X className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-6 border-t font-bold">
                                    <Button
                                        type="submit"
                                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:scale-105 transition-all text-white shadow-xl rounded-2xl h-12 px-8"
                                    >
                                        Registrar Orden de Carga
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => {
                                        setShowForm(false);
                                        setSelectedProducts([]);
                                    }} className="border-2 rounded-2xl h-12">
                                        Cancelar
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            <Card className="glass-white border-white/20 shadow-xl overflow-hidden rounded-[2rem]">
                <CardHeader className="bg-stone-50/50 border-b border-stone-100">
                    <CardTitle className="text-xl">Historial de Carga</CardTitle>
                    <CardDescription>Seguimiento de despacho y flota</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center">
                            <Loader2 className="h-10 w-10 animate-spin text-orange-600 mb-4" />
                            <p className="text-stone-500 font-medium">Consultando registros...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="py-20 text-center">
                            <ClipboardList className="h-16 w-16 text-stone-200 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-stone-800">Sin órdenes recientes</h3>
                            <p className="text-stone-500 mt-2">No se han registrado despachos para la fecha actual.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-stone-50/50">
                                        <TableHead className="font-bold py-4 pl-8">Fecha y Hora</TableHead>
                                        <TableHead className="font-bold">Vehículo</TableHead>
                                        <TableHead className="font-bold">Estado Logístico</TableHead>
                                        <TableHead className="font-bold text-right pr-8">Ficha</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.map((order) => (
                                        <TableRow key={order.id_orden_carga} className="group hover:bg-stone-50 transition-all border-stone-100">
                                            <TableCell className="py-4 pl-8">
                                                <div className="font-bold text-stone-900 leading-tight">
                                                    {formatDate(order.fecha_carga)}
                                                </div>
                                                <div className="text-[10px] text-stone-400 mt-1 uppercase font-bold">ID: #{order.id_orden_carga}</div>
                                            </TableCell>
                                            <TableCell className="font-medium text-stone-600">
                                                <div className="flex items-center gap-2">
                                                    <Truck className="h-4 w-4 text-stone-400" />
                                                    Vehículo ID: {order.id_vehiculo}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-wider border border-orange-100">
                                                    Listo para Ruta
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right pr-8">
                                                <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg group-hover:translate-x-1 transition-all">
                                                    Detalles <ChevronRight className="h-4 w-4 ml-1" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
