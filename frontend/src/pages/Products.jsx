import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Loader2, Package } from "lucide-react"
import api from '@/api/axios';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        nombre_producto_servicio: '',
        precio_unitario_sugerido: '',
        stock_seguridad_minimo: '',
        stock_actual: 0
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data);
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
            fetchProducts();
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
            fetchProducts();
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Productos</h2>
                    <p className="text-muted-foreground">
                        Gestión completa del catálogo de productos
                    </p>
                </div>
                {!showForm && (
                    <Button onClick={() => setShowForm(true)} className="bg-teal-600 hover:bg-teal-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Producto
                    </Button>
                )}
            </div>

            {/* Form */}
            {showForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</CardTitle>
                        <CardDescription>
                            {editingProduct ? 'Modifica los datos del producto' : 'Completa la información del nuevo producto'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nombre del Producto *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.nombre_producto_servicio}
                                        onChange={(e) => setFormData({ ...formData, nombre_producto_servicio: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-md"
                                        placeholder="Ej: Agua Mineral 500ml"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Precio Sugerido</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.precio_unitario_sugerido}
                                        onChange={(e) => setFormData({ ...formData, precio_unitario_sugerido: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-md"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Stock Mínimo</label>
                                    <input
                                        type="number"
                                        value={formData.stock_seguridad_minimo}
                                        onChange={(e) => setFormData({ ...formData, stock_seguridad_minimo: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-md"
                                        placeholder="10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Stock Actual</label>
                                    <input
                                        type="number"
                                        value={formData.stock_actual}
                                        onChange={(e) => setFormData({ ...formData, stock_actual: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-md"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
                                    {editingProduct ? 'Actualizar' : 'Crear'} Producto
                                </Button>
                                <Button type="button" variant="outline" onClick={resetForm}>
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Catálogo</CardTitle>
                    <CardDescription>
                        {products.length} producto(s) registrado(s)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
                            <p className="mt-4 text-sm text-muted-foreground">Cargando productos...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Package className="h-12 w-12 text-muted-foreground/50" />
                            <h3 className="mt-4 text-lg font-semibold">No hay productos</h3>
                            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                                Comienza agregando tu primer producto para gestionar el inventario
                            </p>
                            <Button onClick={() => setShowForm(true)} className="mt-6 bg-teal-600 hover:bg-teal-700">
                                <Plus className="mr-2 h-4 w-4" />
                                Crear Primer Producto
                            </Button>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>Precio</TableHead>
                                        <TableHead>Stock Actual</TableHead>
                                        <TableHead>Stock Mínimo</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.map((product) => {
                                        const lowStock = product.stock_actual < product.stock_seguridad_minimo;
                                        return (
                                            <TableRow key={product.id_producto_servicio}>
                                                <TableCell className="font-medium">
                                                    {product.nombre_producto_servicio}
                                                </TableCell>
                                                <TableCell>
                                                    ${product.precio_unitario_sugerido || '0.00'}
                                                </TableCell>
                                                <TableCell>
                                                    <span className={lowStock ? 'text-red-600 font-semibold' : ''}>
                                                        {product.stock_actual || 0}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {product.stock_seguridad_minimo || 0}
                                                </TableCell>
                                                <TableCell className="text-right space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEdit(product)}
                                                        className="text-teal-600 hover:text-teal-700"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(product.id_producto_servicio)}
                                                        className="text-red-600 hover:text-red-700"
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
                </CardContent>
            </Card>
        </div>
    )
}
