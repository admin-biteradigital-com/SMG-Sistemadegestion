import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    ChevronRight
} from "lucide-react";
import api from '@/api/axios';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Pagination State
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const ITEMS_PER_PAGE = 10;
    const [formData, setFormData] = useState({
        nombre_producto_servicio: '',
        precio_unitario_sugerido: '',
        stock_seguridad_minimo: '',
        stock_actual: 0
    });

    useEffect(() => {
        // Debounce search to prevent too many requests
        const timeoutId = setTimeout(() => {
            fetchProducts(currentPage, searchTerm);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [currentPage, searchTerm]);

    const fetchProducts = async (page = 1, search = '') => {
        setLoading(true);
        try {
            const response = await api.get(`/products?page=${page}&limit=${ITEMS_PER_PAGE}&search=${search}`);
            // Check if response has new structure
            if (response.data.meta) {
                setProducts(response.data.data);
                setTotalPages(response.data.meta.totalPages);
                setTotalRecords(response.data.meta.total);
            } else {
                // Fallback for legacy format (just in case)
                setProducts(response.data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct.id_producto_servicio}`, formData);
            } else {
                await api.post('/products', formData);
            }
            fetchProducts(currentPage, searchTerm);
            resetForm();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error al guardar el producto');
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            nombre_producto_servicio: product.nombre_producto_servicio,
            precio_unitario_sugerido: product.precio_unitario_sugerido || '',
            stock_seguridad_minimo: product.stock_seguridad_minimo || '',
            stock_actual: product.stock_actual || 0
        });
        setShowForm(true);
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
            nombre_producto_servicio: '',
            precio_unitario_sugerido: '',
            stock_seguridad_minimo: '',
            stock_actual: 0
        });
        setEditingProduct(null);
        setShowForm(false);
    };

    // Server-side filtered products are in 'products' state directly
    const filteredProducts = products;

    const lowStockCount = products.filter(p => p.stock_actual < p.stock_seguridad_minimo).length;

    return (
        <div className="space-y-6">
            {/* Header with Search */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-stone-900">Productos</h2>
                        <p className="text-stone-600 mt-1">
                            Gestión completa del inventario y catálogo
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

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full pl-12 pr-12 py-3 rounded-xl glass border border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-smooth"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-stone-100 rounded-lg transition-smooth"
                        >
                            <X className="h-4 w-4 text-stone-500" />
                        </button>
                    )}
                </div>
            </div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid gap-4 md:grid-cols-3"
            >
                <Card className="glass border-white/20 hover:shadow-xl transition-smooth">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-stone-600">Total Productos</p>
                                <p className="text-4xl font-bold gradient-teal-emerald bg-clip-text text-transparent">
                                    {totalRecords}
                                </p>
                            </div>
                            <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500">
                                <Package className="h-8 w-8 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {lowStockCount > 0 && (
                    <Card className="glass border-orange-200/50 hover:shadow-xl transition-smooth">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-stone-600">Stock Crítico</p>
                                    <p className="text-4xl font-bold text-orange-600">{lowStockCount}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-orange-100">
                                    <AlertTriangle className="h-8 w-8 text-orange-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card className="glass border-white/20 hover:shadow-xl transition-smooth">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-stone-600">Página Actual</p>
                                <p className="text-4xl font-bold text-stone-900">{currentPage}/{totalPages}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Form */}
            {showForm && (
                <Card className="border-2 border-teal-200 shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-teal-50 to-orange-50">
                        <CardTitle className="text-stone-900">
                            {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                        </CardTitle>
                        <CardDescription className="text-stone-700">
                            {editingProduct ? 'Modifica los datos del producto' : 'Completa la información del nuevo producto'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-stone-900">Nombre del Producto *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.nombre_producto_servicio}
                                        onChange={(e) => setFormData({ ...formData, nombre_producto_servicio: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none transition-all text-stone-900 font-medium"
                                        placeholder="Ej: Agua Mineral 500ml"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-stone-900">Precio Sugerido</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.precio_unitario_sugerido}
                                        onChange={(e) => setFormData({ ...formData, precio_unitario_sugerido: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none transition-all text-stone-900 font-medium"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-stone-900">Stock Mínimo</label>
                                    <input
                                        type="number"
                                        value={formData.stock_seguridad_minimo}
                                        onChange={(e) => setFormData({ ...formData, stock_seguridad_minimo: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all text-stone-900 font-medium"
                                        placeholder="10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-stone-900">Stock Actual</label>
                                    <input
                                        type="number"
                                        value={formData.stock_actual}
                                        onChange={(e) => setFormData({ ...formData, stock_actual: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all text-stone-900 font-medium"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button
                                    type="submit"
                                    className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white shadow-lg"
                                >
                                    {editingProduct ? 'Actualizar' : 'Crear'} Producto
                                </Button>
                                <Button type="button" variant="outline" onClick={resetForm} className="border-2">
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Search */}
            {products.length > 0 && (
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reset to page 1 on search
                        }}
                        className="w-full pl-12 pr-12 py-3 border-2 border-stone-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none transition-all text-stone-900"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>
            )}

            {/* Table */}
            <Card className="border-2 border-stone-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-stone-50 to-white border-b-2 border-stone-100">
                    <CardTitle className="text-xl text-stone-900">Catálogo de Productos</CardTitle>
                    <CardDescription className="text-stone-600">
                        Mostrando {filteredProducts.length} de {totalRecords} registros
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="h-12 w-12 animate-spin text-teal-600" />
                            <p className="mt-4 text-stone-600 font-medium">Cargando productos...</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Package className="h-16 w-16 text-stone-300" />
                            <h3 className="mt-4 text-lg font-bold text-stone-900">
                                {searchTerm ? 'No se encontraron productos' : 'No hay productos'}
                            </h3>
                            <p className="mt-2 text-stone-600 max-w-sm">
                                {searchTerm ? 'Intenta con otro término de búsqueda' : 'Comienza agregando tu primer producto'}
                            </p>
                            {!searchTerm && (
                                <Button
                                    onClick={() => setShowForm(true)}
                                    className="mt-6 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Crear Primer Producto
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="rounded-xl border-2 border-stone-200 overflow-hidden">
                            <Table>
                                <TableHeader className="bg-gradient-to-r from-stone-100 to-stone-50">
                                    <TableRow className="border-b-2 border-stone-200">
                                        <TableHead className="font-bold text-stone-900">Nombre</TableHead>
                                        <TableHead className="font-bold text-stone-900">Precio</TableHead>
                                        <TableHead className="font-bold text-stone-900">Stock Actual</TableHead>
                                        <TableHead className="font-bold text-stone-900">Stock Mínimo</TableHead>
                                        <TableHead className="text-right font-bold text-stone-900">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProducts.map((product) => {
                                        const lowStock = product.stock_actual < product.stock_seguridad_minimo;
                                        return (
                                            <TableRow key={product.id_producto_servicio} className="hover:bg-teal-50/50 transition-colors">
                                                <TableCell className="font-semibold text-stone-900">
                                                    {product.nombre_producto_servicio}
                                                </TableCell>
                                                <TableCell className="font-bold text-teal-700">
                                                    ${product.precio_unitario_sugerido || '0.00'}
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`font-bold ${lowStock ? 'text-red-600' : 'text-green-600'}`}>
                                                        {product.stock_actual || 0}
                                                        {lowStock && <AlertTriangle className="inline-block ml-2 h-4 w-4" />}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="font-semibold text-orange-600">
                                                    {product.stock_seguridad_minimo || 0}
                                                </TableCell>
                                                <TableCell className="text-right space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEdit(product)}
                                                        className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 font-medium"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(product.id_producto_servicio)}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 font-medium"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>

                        </div>
                    )}

                    {/* Pagination Controls */}
                    {totalRecords > 0 && (
                        <div className="flex items-center justify-between mt-4 border-t pt-4">
                            <div className="text-sm text-stone-600">
                                Página <span className="font-medium text-stone-900">{currentPage}</span> de <span className="font-medium text-stone-900">{totalPages}</span>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1 || loading}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    Anterior
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages || loading}
                                >
                                    Siguiente
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div >
    )
}
