import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Plus,
    Edit,
    Trash2,
    Loader2,
    Package,
    AlertTriangle,
    Search,
    X,
    ChevronLeft,
    ChevronRight,
    QrCode,
    Barcode,
    Truck,
    Info,
    LayoutGrid
} from "lucide-react";
import api from '@/api/axios';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Pagination & Search State
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const ITEMS_PER_PAGE = 10;

    // Form Data - Using PascalCase to match backend expectations
    const [formData, setFormData] = useState({
        Nombre_Producto_Servicio: '',
        Descripcion_Producto_Servicio: '',
        Precio_Unitario_Sugerido: '',
        Tiempo_Entrega_Proveedor_Dias: 0,
        Stock_Seguridad_Minimo: 0,
        Punto_Reorden: 0,
        Cantidad_Reorden_Optima: 0,
        Codigo_Barras: '',
        Codigo_QR: ''
    });

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchProducts(currentPage, searchTerm);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [currentPage, searchTerm]);

    const fetchProducts = async (page = 1, search = '') => {
        setLoading(true);
        try {
            const response = await api.get(`/products?page=${page}&limit=${ITEMS_PER_PAGE}&search=${search}`);
            const data = response.data;

            if (data && data.data) {
                setProducts(data.data);
                setTotalPages(data.meta?.totalPages || 1);
                setTotalRecords(data.meta?.total || data.meta?.totalRecords || data.data.length);
            } else if (Array.isArray(data)) {
                setProducts(data);
                setTotalPages(1);
                setTotalRecords(data.length);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Clean numeric fields
            const cleanData = {
                ...formData,
                Precio_Unitario_Sugerido: parseFloat(formData.Precio_Unitario_Sugerido) || 0,
                Tiempo_Entrega_Proveedor_Dias: parseInt(formData.Tiempo_Entrega_Proveedor_Dias) || 0,
                Stock_Seguridad_Minimo: parseInt(formData.Stock_Seguridad_Minimo) || 0,
                Punto_Reorden: parseInt(formData.Punto_Reorden) || 0,
                Cantidad_Reorden_Optima: parseInt(formData.Cantidad_Reorden_Optima) || 0,
            };

            if (editingProduct) {
                await api.put(`/products/${editingProduct.id_producto_servicio}`, cleanData);
            } else {
                // If creating new, we might need to send an ID if the backend doesn't handle serials
                // But let's assume backend handles it. If it fails, we'll check id management.
                await api.post('/products', cleanData);
            }
            fetchProducts(currentPage, searchTerm);
            resetForm();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error al guardar el producto: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            Nombre_Producto_Servicio: product.nombre_producto_servicio || '',
            Descripcion_Producto_Servicio: product.descripcion_producto_servicio || '',
            Precio_Unitario_Sugerido: product.precio_unitario_sugerido || '',
            Tiempo_Entrega_Proveedor_Dias: product.tiempo_entrega_proveedor_dias || 0,
            Stock_Seguridad_Minimo: product.stock_seguridad_minimo || 0,
            Punto_Reorden: product.punto_reorden || 0,
            Cantidad_Reorden_Optima: product.cantidad_reorden_optima || 0,
            Codigo_Barras: product.codigo_barras || '',
            Codigo_QR: product.codigo_qr || ''
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;
        try {
            await api.delete(`/products/${id}`);
            fetchProducts(currentPage, searchTerm);
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Error al eliminar el producto');
        }
    };

    const resetForm = () => {
        setFormData({
            Nombre_Producto_Servicio: '',
            Descripcion_Producto_Servicio: '',
            Precio_Unitario_Sugerido: '',
            Tiempo_Entrega_Proveedor_Dias: 0,
            Stock_Seguridad_Minimo: 0,
            Punto_Reorden: 0,
            Cantidad_Reorden_Optima: 0,
            Codigo_Barras: '',
            Codigo_QR: ''
        });
        setEditingProduct(null);
        setShowForm(false);
    };

    const lowStockCount = products.filter(p => (p.stock_actual || 0) < (p.stock_seguridad_minimo || 0)).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-stone-900 flex items-center gap-2">
                        <Package className="h-8 w-8 text-teal-600" />
                        Catálogo de Productos
                    </h2>
                    <p className="text-stone-600 mt-1">
                        Gestión detallada de inventario, precios y logística.
                    </p>
                </div>
                {!showForm && (
                    <Button
                        onClick={() => setShowForm(true)}
                        className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white shadow-teal"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Producto
                    </Button>
                )}
            </div>

            {/* Stats */}
            <AnimatePresence>
                {!showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid gap-4 md:grid-cols-3"
                    >
                        <Card className="glass-white hover:shadow-xl transition-smooth">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-stone-500">Total en Catálogo</p>
                                        <p className="text-3xl font-bold gradient-teal-emerald bg-clip-text text-transparent">
                                            {totalRecords}
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-teal-50">
                                        <LayoutGrid className="h-6 w-6 text-teal-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className={`glass-white hover:shadow-xl transition-smooth ${lowStockCount > 0 ? 'border-orange-200 bg-orange-50/10' : ''}`}>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-stone-500">Productos con Alerta</p>
                                        <p className={`text-3xl font-bold ${lowStockCount > 0 ? 'text-orange-600' : 'text-stone-400'}`}>
                                            {lowStockCount}
                                        </p>
                                    </div>
                                    <div className={`p-3 rounded-xl ${lowStockCount > 0 ? 'bg-orange-100' : 'bg-stone-50'}`}>
                                        <AlertTriangle className={`h-6 w-6 ${lowStockCount > 0 ? 'text-orange-600' : 'text-stone-400'}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="glass-white hover:shadow-xl transition-smooth">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-stone-500">Vista Actual</p>
                                        <p className="text-3xl font-bold text-stone-800">
                                            {Math.min(ITEMS_PER_PAGE * currentPage, totalRecords)}
                                            <span className="text-sm text-stone-400 font-normal ml-1">items mostrados</span>
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-stone-50">
                                        <Search className="h-6 w-6 text-stone-400" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Form Section */}
            {showForm && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <Card className="border-2 border-teal-200 shadow-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2"></div>
                        <CardHeader className="bg-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-2xl text-stone-900">
                                        {editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
                                    </CardTitle>
                                    <CardDescription>Completa todos los campos técnicos para una gestión óptima.</CardDescription>
                                </div>
                                <Button variant="ghost" size="icon" onClick={resetForm}>
                                    <X className="h-6 w-6" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 bg-white">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Section: Basic Info */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-teal-700 font-bold border-b pb-2">
                                        <Info className="h-5 w-5" />
                                        Información General
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <div className="lg:col-span-2 space-y-2">
                                            <label className="text-sm font-bold text-stone-700">Nombre del Producto / Servicio *</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.Nombre_Producto_Servicio}
                                                onChange={(e) => setFormData({ ...formData, Nombre_Producto_Servicio: e.target.value })}
                                                className="w-full px-4 py-2 bg-stone-50 border-2 border-stone-200 rounded-xl focus:border-teal-500 outline-none transition-all"
                                                placeholder="Ej: Coca Cola 2L"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-stone-700">Precio Sugerido ($) *</label>
                                            <input
                                                type="number"
                                                required
                                                step="0.01"
                                                value={formData.Precio_Unitario_Sugerido}
                                                onChange={(e) => setFormData({ ...formData, Precio_Unitario_Sugerido: e.target.value })}
                                                className="w-full px-4 py-2 bg-stone-50 border-2 border-stone-200 rounded-xl focus:border-teal-500 outline-none transition-all font-bold text-teal-700"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div className="lg:col-span-3 space-y-2">
                                            <label className="text-sm font-bold text-stone-700">Descripción Detallada</label>
                                            <textarea
                                                value={formData.Descripcion_Producto_Servicio}
                                                onChange={(e) => setFormData({ ...formData, Descripcion_Producto_Servicio: e.target.value })}
                                                className="w-full px-4 py-2 bg-stone-50 border-2 border-stone-200 rounded-xl focus:border-teal-500 outline-none transition-all min-h-[100px]"
                                                placeholder="Escribe detalles sobre el producto..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Logic & Inventory */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-orange-700 font-bold border-b pb-2">
                                        <Truck className="h-5 w-5" />
                                        Logística e Inventario
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-stone-700">Tiempo Entrega (días)</label>
                                            <input
                                                type="number"
                                                value={formData.Tiempo_Entrega_Proveedor_Dias}
                                                onChange={(e) => setFormData({ ...formData, Tiempo_Entrega_Proveedor_Dias: e.target.value })}
                                                className="w-full px-4 py-2 bg-stone-50 border-2 border-stone-200 rounded-xl focus:border-orange-500 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-stone-700">Stock Seguridad</label>
                                            <input
                                                type="number"
                                                value={formData.Stock_Seguridad_Minimo}
                                                onChange={(e) => setFormData({ ...formData, Stock_Seguridad_Minimo: e.target.value })}
                                                className="w-full px-4 py-2 bg-stone-50 border-2 border-stone-200 rounded-xl focus:border-orange-500 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-stone-700">Punto Reorden</label>
                                            <input
                                                type="number"
                                                value={formData.Punto_Reorden}
                                                onChange={(e) => setFormData({ ...formData, Punto_Reorden: e.target.value })}
                                                className="w-full px-4 py-2 bg-stone-50 border-2 border-stone-200 rounded-xl focus:border-orange-500 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-stone-700">Cant. Reorden Óptima</label>
                                            <input
                                                type="number"
                                                value={formData.Cantidad_Reorden_Optima}
                                                onChange={(e) => setFormData({ ...formData, Cantidad_Reorden_Optima: e.target.value })}
                                                className="w-full px-4 py-2 bg-stone-50 border-2 border-stone-200 rounded-xl focus:border-orange-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Codes & Tags */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-violet-700 font-bold border-b pb-2">
                                        <QrCode className="h-5 w-5" />
                                        Identificación (Códigos)
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2 relative">
                                            <label className="text-sm font-bold text-stone-700 flex items-center gap-1">
                                                <Barcode className="h-4 w-4" /> Código de Barras
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.Codigo_Barras}
                                                onChange={(e) => setFormData({ ...formData, Codigo_Barras: e.target.value })}
                                                className="w-full px-4 py-2 bg-stone-50 border-2 border-stone-200 rounded-xl focus:border-violet-500 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-stone-700 flex items-center gap-1">
                                                <QrCode className="h-4 w-4" /> Código QR Interno
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.Codigo_QR}
                                                onChange={(e) => setFormData({ ...formData, Codigo_QR: e.target.value })}
                                                className="w-full px-4 py-2 bg-stone-50 border-2 border-stone-200 rounded-xl focus:border-violet-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-6 border-t font-bold">
                                    <Button type="button" variant="outline" onClick={resetForm} className="border-2 rounded-xl h-12 px-8">
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:scale-105 transition-all text-white shadow-xl rounded-xl h-12 px-8"
                                    >
                                        <Plus className="mr-2 h-5 w-5" />
                                        {editingProduct ? 'Guardar Cambios' : 'Registrar Producto'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Main Catalogue List */}
            <Card className="glass-white border-white/20 shadow-xl">
                <CardHeader className="border-b border-stone-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-xl">Listado Maestro</CardTitle>
                            <span className="px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-xs font-bold">
                                {totalRecords} total
                            </span>
                        </div>
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                            <input
                                type="text"
                                placeholder="Filtrar por nombre..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:border-teal-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center">
                            <Loader2 className="h-10 w-10 animate-spin text-teal-600 mb-4" />
                            <p className="text-stone-500 font-medium">Buscando productos...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="py-20 text-center">
                            <Package className="h-16 w-16 text-stone-200 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-stone-800">No se encontraron productos</h3>
                            <p className="text-stone-500 mt-2">Ajusta tu búsqueda o agrega nuevos items al catálogo.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-stone-50/50">
                                        <TableHead className="font-bold text-stone-800 py-4">Producto</TableHead>
                                        <TableHead className="font-bold text-stone-800">PVP Sugerido</TableHead>
                                        <TableHead className="font-bold text-stone-800">Inventario</TableHead>
                                        <TableHead className="font-bold text-stone-800">Alertas</TableHead>
                                        <TableHead className="font-bold text-stone-800 text-right pr-8">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.map((product) => {
                                        const stock = product.stock_actual || 0;
                                        const minStock = product.stock_seguridad_minimo || 0;
                                        const isLow = stock < minStock;

                                        return (
                                            <TableRow key={product.id_producto_servicio} className="group hover:bg-stone-50 transition-all border-stone-100">
                                                <TableCell className="py-4">
                                                    <div>
                                                        <p className="font-bold text-stone-900 leading-tight">
                                                            {product.nombre_producto_servicio}
                                                        </p>
                                                        <p className="text-xs text-stone-500 truncate max-w-[200px] mt-1">
                                                            ID: #{product.id_producto_servicio} | {product.descripcion_producto_servicio || 'Sin descripción'}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-lg">
                                                        ${parseFloat(product.precio_unitario_sugerido || 0).toLocaleString('es-CL')}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-lg font-bold ${isLow ? 'text-orange-600' : 'text-stone-900'}`}>
                                                            {stock}
                                                        </span>
                                                        <span className="text-stone-400 text-xs font-medium">/ Min {minStock}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {isLow ? (
                                                        <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-3 py-1 rounded-full text-xs font-bold border border-orange-100 animate-pulse">
                                                            <AlertTriangle className="h-3 w-3" />
                                                            STOCK BAJO
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">
                                                            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                                            OPTIMO
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right pr-8">
                                                    <div className="flex items-center justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleEdit(product)}
                                                            className="text-stone-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDelete(product.id_producto_servicio)}
                                                            className="text-stone-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {/* Footer / Pagination */}
                    <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-100">
                        <p className="text-sm text-stone-500">
                            Página <span className="font-bold text-stone-900">{currentPage}</span> de <span className="font-bold text-stone-900">{totalPages}</span>
                        </p>
                        <div className="flex items-center gap-2 font-bold">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1 || loading}
                                className="rounded-xl border-2"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages || loading}
                                className="rounded-xl border-2"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
