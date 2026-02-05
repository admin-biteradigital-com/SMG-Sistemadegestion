import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Plus,
    ShoppingCart,
    Loader2,
    Trash2,
    ArrowLeft,
    User,
    CreditCard,
    Calendar,
    ChevronRight,
    Search,
    AlertCircle,
    Package
} from "lucide-react";
import api from '@/api/axios';

export default function NewSale() {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);

    // Form Data
    const [formData, setFormData] = useState({
        ID_Orden_Venta: '',
        ID_Destino_Transporte: '', // used as Client ID in this context
        Fecha_Venta: new Date().toISOString().split('T')[0],
        Tipo_Documento_Venta: 'Boleta',
        Estado_Venta: 'Completada',
        ID_Agente_Venta: 1, // Default agent
        ID_Pedido: null,
        Metodo_Pago: 'Efectivo',
        Fecha_Vencimiento_Credito: null,
        Notas: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [clientsRes, productsRes] = await Promise.all([
                api.get('/clients'),
                api.get('/products')
            ]);

            // Handle potentially structured responses { data: [], meta: {} }
            const clientList = Array.isArray(clientsRes.data) ? clientsRes.data : (clientsRes.data?.data || []);
            const productList = Array.isArray(productsRes.data) ? productsRes.data : (productsRes.data?.data || []);

            setClients(clientList);
            setProducts(productList);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const addProduct = () => {
        const tempId = Math.random().toString(36).substr(2, 9);
        setSelectedProducts([...selectedProducts, {
            id_producto_servicio: '',
            cantidad_vendida: 1,
            precio_unitario_venta: 0,
            temp: tempId
        }]);
    };

    const removeProduct = (tempId) => {
        setSelectedProducts(selectedProducts.filter(p => p.temp !== tempId));
    };

    const updateProduct = (tempId, field, value) => {
        setSelectedProducts(selectedProducts.map(p => {
            if (p.temp === tempId) {
                const updated = { ...p, [field]: value };

                // Auto-fill price when product is selected
                if (field === 'id_producto_servicio') {
                    const product = products.find(pr => pr.id_producto_servicio === parseInt(value));
                    if (product) {
                        updated.precio_unitario_venta = product.precio_unitario_sugerido || 0;
                    }
                }

                return updated;
            }
            return p;
        }));
    };

    const calculateTotal = () => {
        return selectedProducts.reduce((sum, item) => {
            const cantidad = parseFloat(item.cantidad_vendida) || 0;
            const precio = parseFloat(item.precio_unitario_venta) || 0;
            return sum + (cantidad * precio);
        }, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedProducts.length === 0) {
            alert('Debe agregar al menos un producto');
            return;
        }

        const missingFields = selectedProducts.some(p => !p.id_producto_servicio || !p.cantidad_vendida);
        if (missingFields) {
            alert('Por favor complete todos los campos de los productos seleccionados');
            return;
        }

        setSubmitting(true);
        try {
            const saleData = {
                ...formData,
                Monto_Total_Venta: calculateTotal(),
                Items: selectedProducts.map((p) => ({
                    ID_Producto_Servicio: parseInt(p.id_producto_servicio),
                    Cantidad_Vendida: parseInt(p.cantidad_vendida),
                    Precio_Unitario_Venta: parseFloat(p.precio_unitario_venta)
                }))
            };

            await api.post('/sales', saleData);
            alert('Venta registrada exitosamente');
            navigate('/sales');
        } catch (error) {
            console.error('Error creating sale:', error);
            alert('Error al registrar la venta: ' + (error.response?.data?.details || error.message));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-stone-50">
                <Loader2 className="h-12 w-12 animate-spin text-teal-600 mb-4" />
                <p className="text-stone-500 font-bold animate-pulse">Sincronizando Inventario...</p>
            </div>
        );
    }

    const totalVenta = calculateTotal();

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/sales')}
                        className="text-stone-500 hover:text-stone-900 -ml-2 mb-2 p-0 h-8 font-bold flex items-center gap-1"
                    >
                        <ArrowLeft className="h-4 w-4" /> Volver a Ventas
                    </Button>
                    <h2 className="text-4xl font-extrabold text-stone-900 tracking-tight flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-teal-600 flex items-center justify-center text-white shadow-teal">
                            <ShoppingCart className="h-6 w-6" />
                        </div>
                        Punto de Venta
                    </h2>
                </div>
                <div className="bg-white px-6 py-4 rounded-3xl shadow-xl border border-stone-100 flex items-center gap-4">
                    <div className="text-right">
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Total Orden</span>
                        <div className="text-3xl font-black text-teal-600">
                            ${totalVenta.toLocaleString('es-CL')}
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Transaction Details */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="glass-white border-0 shadow-2xl overflow-hidden rounded-[2rem]">
                        <div className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2"></div>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-teal-600" />
                                Datos de Venta
                            </CardTitle>
                            <CardDescription>Información general del documento</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Cliente/Entidad *</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                                    <select
                                        required
                                        value={formData.ID_Destino_Transporte}
                                        onChange={(e) => setFormData({ ...formData, ID_Destino_Transporte: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-stone-50 border-2 border-stone-100 rounded-2xl focus:border-teal-500 outline-none transition-all font-medium"
                                    >
                                        <option value="">Seleccionar cliente</option>
                                        {clients.map(c => (
                                            <option key={c.id_cliente} value={c.id_cliente}>
                                                {c.razon_social}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Fecha</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                                        <input
                                            type="date"
                                            required
                                            value={formData.Fecha_Venta}
                                            onChange={(e) => setFormData({ ...formData, Fecha_Venta: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 bg-stone-50 border-2 border-stone-100 rounded-2xl focus:border-teal-500 outline-none transition-all font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Documento</label>
                                    <select
                                        value={formData.Tipo_Documento_Venta}
                                        onChange={(e) => setFormData({ ...formData, Tipo_Documento_Venta: e.target.value })}
                                        className="w-full px-4 py-3 bg-stone-50 border-2 border-stone-100 rounded-2xl focus:border-teal-500 outline-none transition-all font-medium"
                                    >
                                        <option value="Boleta">Boleta</option>
                                        <option value="Factura">Factura</option>
                                        <option value="Guía">Guía</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Método de Pago</label>
                                <select
                                    value={formData.Metodo_Pago}
                                    onChange={(e) => setFormData({ ...formData, Metodo_Pago: e.target.value })}
                                    className="w-full px-4 py-3 bg-stone-50 border-2 border-stone-100 rounded-2xl focus:border-teal-500 outline-none transition-all font-medium"
                                >
                                    <option value="Efectivo">💵 Efectivo</option>
                                    <option value="Transferencia">📱 Transferencia</option>
                                    <option value="Crédito">💳 Crédito</option>
                                    <option value="Débito">🏦 Débito</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Observaciones</label>
                                <textarea
                                    value={formData.Notas}
                                    onChange={(e) => setFormData({ ...formData, Notas: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-stone-50 border-2 border-stone-100 rounded-2xl focus:border-teal-500 outline-none transition-all font-medium resize-none"
                                    placeholder="Detalles internos de la venta..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Button
                        type="submit"
                        disabled={submitting || selectedProducts.length === 0}
                        className="w-full h-16 rounded-[2rem] bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-black text-lg shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
                    >
                        {submitting ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                            <>PROCESAR VENTA <ChevronRight className="ml-2 h-6 w-6" /></>
                        )}
                    </Button>
                </div>

                {/* Right Column: Items Selection */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="glass-white border-0 shadow-2xl overflow-hidden rounded-[2rem] min-h-[600px] flex flex-col">
                        <CardHeader className="bg-stone-50/50 border-b border-stone-100 py-6 px-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-2xl text-stone-900 font-black">Detalle de Productos</CardTitle>
                                    <CardDescription>Puntos de venta habilitados para stock</CardDescription>
                                </div>
                                <Button
                                    type="button"
                                    onClick={addProduct}
                                    className="bg-white text-teal-600 border-2 border-teal-100 hover:bg-teal-50 rounded-2xl font-bold transition-all px-6 py-2 shadow-sm"
                                >
                                    <Plus className="h-5 w-5 mr-2" /> Agregar Item
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 flex-grow">
                            <AnimatePresence mode="popLayout">
                                {selectedProducts.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="h-full flex flex-col items-center justify-center py-32 text-center"
                                    >
                                        <div className="h-24 w-24 bg-stone-50 rounded-full flex items-center justify-center mb-6">
                                            <Package className="h-12 w-12 text-stone-200" />
                                        </div>
                                        <h3 className="text-xl font-bold text-stone-800">Canasta Vacía</h3>
                                        <p className="text-stone-400 mt-2 max-w-[280px]">Inicie la venta agregando productos desde el botón superior.</p>
                                    </motion.div>
                                ) : (
                                    <div className="divide-y divide-stone-100">
                                        {selectedProducts.map((item, index) => (
                                            <motion.div
                                                layout
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                key={item.temp}
                                                className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-end md:items-center group"
                                            >
                                                <div className="flex-grow space-y-2">
                                                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-1">Item #{index + 1}</label>
                                                    <div className="relative">
                                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                                                        <select
                                                            value={item.id_producto_servicio}
                                                            onChange={(e) => updateProduct(item.temp, 'id_producto_servicio', e.target.value)}
                                                            className="w-full pl-12 pr-4 py-4 bg-stone-50 border-2 border-stone-100 rounded-3xl focus:border-teal-500 outline-none transition-all font-bold text-stone-800 appearance-none"
                                                        >
                                                            <option value="">Seleccionar producto disponible</option>
                                                            {products.map(p => (
                                                                <option key={p.id_producto_servicio} value={p.id_producto_servicio}>
                                                                    {p.nombre_producto_servicio} (Stock: {p.stock_actual || 0})
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="flex gap-4 w-full md:w-auto">
                                                    <div className="space-y-2 flex-grow md:w-32">
                                                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-1">Cant.</label>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={item.cantidad_vendida}
                                                            onChange={(e) => updateProduct(item.temp, 'cantidad_vendida', e.target.value)}
                                                            className="w-full px-4 py-4 bg-stone-50 border-2 border-stone-100 rounded-3xl focus:border-teal-500 outline-none transition-all font-black text-center"
                                                        />
                                                    </div>
                                                    <div className="space-y-2 flex-grow md:w-44">
                                                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-1">P. Unitario ($)</label>
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            value={item.precio_unitario_venta}
                                                            onChange={(e) => updateProduct(item.temp, 'precio_unitario_venta', e.target.value)}
                                                            className="w-full px-6 py-4 bg-teal-50/30 border-2 border-teal-100/50 rounded-3xl focus:border-teal-500 outline-none transition-all font-black text-teal-700"
                                                        />
                                                    </div>
                                                    <div className="flex items-end pb-1">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => removeProduct(item.temp)}
                                                            className="h-14 w-14 rounded-full text-stone-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                                        >
                                                            <Trash2 className="h-6 w-6" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </AnimatePresence>
                        </CardContent>
                        <div className="bg-stone-50/50 p-8 border-t border-stone-100">
                            <div className="flex justify-between items-center max-w-sm ml-auto">
                                <span className="font-bold text-stone-400 uppercase tracking-widest text-sm">Resumen Total</span>
                                <span className="text-4xl font-black text-stone-900">${totalVenta.toLocaleString('es-CL')}</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </form>
        </div>
    );
}
