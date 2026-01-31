import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Plus, Eye, FileText, Search, ShoppingCart, Package } from 'lucide-react';

const PurchaseOrders = () => {
    const [orders, setOrders] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        ID_Proveedor: '',
        Fecha_Entrega_Estimada: '',
        Notas: '',
        Items: []
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [ordersRes, suppliersRes, productsRes] = await Promise.all([
                api.get('/purchase-orders'),
                api.get('/suppliers'),
                api.get('/products')
            ]);
            setOrders(ordersRes.data);
            setSuppliers(suppliersRes.data);
            setProducts(productsRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const handleViewDetails = async (orderId) => {
        try {
            const response = await api.get(`/purchase-orders/${orderId}`);
            setSelectedOrder(response.data);
            setShowDetails(true);
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            Items: [...prev.Items, {
                ID_Producto_Servicio: '',
                Cantidad: 1,
                Precio_Unitario_Acordado: 0
            }]
        }));
    };

    const removeItem = (index) => {
        setFormData(prev => ({
            ...prev,
            Items: prev.Items.filter((_, i) => i !== index)
        }));
    };

    const updateItem = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            Items: prev.Items.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        }));
    };

    const calculateTotal = () => {
        return formData.Items.reduce((sum, item) => {
            return sum + (item.Cantidad * item.Precio_Unitario_Acordado);
        }, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.Items.length === 0) {
            alert('Debe agregar al menos un producto a la orden');
            return;
        }

        try {
            // Generate IDs
            const maxOrderId = orders.length > 0 ? Math.max(...orders.map(o => o.id_orden)) : 0;
            const newOrderId = maxOrderId + 1;

            const itemsWithIds = formData.Items.map((item, index) => ({
                ID_Detalle_Orden: newOrderId * 1000 + index + 1,
                ID_Producto_Servicio: parseInt(item.ID_Producto_Servicio),
                Cantidad: parseInt(item.Cantidad),
                Precio_Unitario_Acordado: parseFloat(item.Precio_Unitario_Acordado)
            }));

            const orderData = {
                ID_Orden: newOrderId,
                Fecha_Creacion: new Date().toISOString().split('T')[0],
                Fecha_Entrega_Estimada: formData.Fecha_Entrega_Estimada,
                Estado_Orden: 'Pendiente',
                Total_Orden: calculateTotal(),
                Notas: formData.Notas,
                ID_Proveedor: parseInt(formData.ID_Proveedor),
                Items: itemsWithIds
            };

            await api.post('/purchase-orders', orderData);
            fetchData();
            resetForm();
            alert('Orden de compra creada exitosamente');
        } catch (error) {
            console.error('Error creating purchase order:', error);
            alert('Error al crear la orden de compra');
        }
    };

    const resetForm = () => {
        setFormData({
            ID_Proveedor: '',
            Fecha_Entrega_Estimada: '',
            Notas: '',
            Items: []
        });
        setShowForm(false);
    };

    const getSupplierName = (id) => {
        const supplier = suppliers.find(s => s.id_proveedor === id);
        return supplier ? supplier.nombre_proveedor : 'N/A';
    };

    const getProductName = (id) => {
        const product = products.find(p => p.id_producto_servicio === id);
        return product ? product.nombre_producto_servicio : 'N/A';
    };

    const getStatusBadge = (status) => {
        const statusColors = {
            'Pendiente': 'bg-yellow-100 text-yellow-800',
            'Confirmada': 'bg-blue-100 text-blue-800',
            'En Proceso': 'bg-purple-100 text-purple-800',
            'Completada': 'bg-green-100 text-green-800',
            'Cancelada': 'bg-red-100 text-red-800'
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800';
    };

    const filteredOrders = orders.filter(order => {
        const supplierName = getSupplierName(order.id_proveedor).toLowerCase();
        return supplierName.includes(searchTerm.toLowerCase()) ||
            order.estado_orden.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-amber-900 flex items-center gap-2">
                        <ShoppingCart className="h-8 w-8" />
                        Órdenes de Compra
                    </h1>
                    <p className="text-muted-foreground mt-1">Gestión de pedidos a proveedores</p>
                </div>
                {!showForm && !showDetails && (
                    <Button
                        onClick={() => setShowForm(true)}
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Nueva Orden de Compra
                    </Button>
                )}
            </div>

            {/* Formulario de Nueva Orden */}
            {showForm && (
                <Card className="border-orange-200 shadow-md">
                    <CardHeader className="bg-orange-50/50">
                        <CardTitle className="text-orange-900">Nueva Orden de Compra</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Proveedor *</label>
                                    <select
                                        value={formData.ID_Proveedor}
                                        onChange={(e) => setFormData({ ...formData, ID_Proveedor: e.target.value })}
                                        required
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        <option value="">Seleccione un proveedor</option>
                                        {suppliers.map(supplier => (
                                            <option key={supplier.id_proveedor} value={supplier.id_proveedor}>
                                                {supplier.nombre_proveedor}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Fecha de Entrega Estimada</label>
                                    <input
                                        type="date"
                                        value={formData.Fecha_Entrega_Estimada}
                                        onChange={(e) => setFormData({ ...formData, Fecha_Entrega_Estimada: e.target.value })}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Notas</label>
                                <textarea
                                    value={formData.Notas}
                                    onChange={(e) => setFormData({ ...formData, Notas: e.target.value })}
                                    rows={2}
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                />
                            </div>

                            {/* Items */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold">Productos</h3>
                                    <Button type="button" onClick={addItem} variant="outline" size="sm">
                                        <Plus className="h-4 w-4 mr-1" /> Agregar Producto
                                    </Button>
                                </div>

                                {formData.Items.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        No hay productos agregados. Haga clic en "Agregar Producto" para comenzar.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {formData.Items.map((item, index) => (
                                            <div key={index} className="grid grid-cols-12 gap-2 items-end p-3 bg-gray-50 rounded-lg">
                                                <div className="col-span-5 space-y-1">
                                                    <label className="text-xs font-medium">Producto</label>
                                                    <select
                                                        value={item.ID_Producto_Servicio}
                                                        onChange={(e) => updateItem(index, 'ID_Producto_Servicio', e.target.value)}
                                                        required
                                                        className="flex h-9 w-full rounded-md border border-input bg-white px-2 py-1 text-sm"
                                                    >
                                                        <option value="">Seleccione...</option>
                                                        {products.map(product => (
                                                            <option key={product.id_producto_servicio} value={product.id_producto_servicio}>
                                                                {product.nombre_producto_servicio}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="col-span-2 space-y-1">
                                                    <label className="text-xs font-medium">Cantidad</label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={item.Cantidad}
                                                        onChange={(e) => updateItem(index, 'Cantidad', e.target.value)}
                                                        required
                                                        className="flex h-9 w-full rounded-md border border-input bg-white px-2 py-1 text-sm"
                                                    />
                                                </div>
                                                <div className="col-span-3 space-y-1">
                                                    <label className="text-xs font-medium">Precio Unitario</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={item.Precio_Unitario_Acordado}
                                                        onChange={(e) => updateItem(index, 'Precio_Unitario_Acordado', e.target.value)}
                                                        required
                                                        className="flex h-9 w-full rounded-md border border-input bg-white px-2 py-1 text-sm"
                                                    />
                                                </div>
                                                <div className="col-span-2 flex items-end">
                                                    <Button
                                                        type="button"
                                                        onClick={() => removeItem(index)}
                                                        variant="destructive"
                                                        size="sm"
                                                        className="w-full h-9"
                                                    >
                                                        Eliminar
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {formData.Items.length > 0 && (
                                <div className="flex justify-end">
                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground">Total de la Orden</p>
                                        <p className="text-2xl font-bold text-orange-600">
                                            ${calculateTotal().toLocaleString('es-CL')}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={resetForm}>
                                    Cancelar
                                </Button>
                                <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white">
                                    Crear Orden de Compra
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Detalles de Orden */}
            {showDetails && selectedOrder && (
                <Card className="border-blue-200 shadow-md">
                    <CardHeader className="bg-blue-50/50">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-blue-900">
                                Orden de Compra #{selectedOrder.id_orden}
                            </CardTitle>
                            <Button variant="outline" size="sm" onClick={() => setShowDetails(false)}>
                                Cerrar
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <p className="text-sm text-muted-foreground">Proveedor</p>
                                <p className="font-semibold">{getSupplierName(selectedOrder.id_proveedor)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Estado</p>
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(selectedOrder.estado_orden)}`}>
                                    {selectedOrder.estado_orden}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Fecha de Creación</p>
                                <p className="font-semibold">{new Date(selectedOrder.fecha_creacion).toLocaleDateString('es-CL')}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Entrega Estimada</p>
                                <p className="font-semibold">
                                    {selectedOrder.fecha_entrega_estimada
                                        ? new Date(selectedOrder.fecha_entrega_estimada).toLocaleDateString('es-CL')
                                        : 'No especificada'}
                                </p>
                            </div>
                        </div>

                        {selectedOrder.notas && (
                            <div className="mb-6">
                                <p className="text-sm text-muted-foreground">Notas</p>
                                <p className="text-sm">{selectedOrder.notas}</p>
                            </div>
                        )}

                        <div>
                            <h4 className="font-semibold mb-3">Productos</h4>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Producto</TableHead>
                                        <TableHead className="text-right">Cantidad</TableHead>
                                        <TableHead className="text-right">Precio Unit.</TableHead>
                                        <TableHead className="text-right">Subtotal</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {selectedOrder.items && selectedOrder.items.map((item) => (
                                        <TableRow key={item.id_detalle_orden}>
                                            <TableCell>{getProductName(item.id_producto_servicio)}</TableCell>
                                            <TableCell className="text-right">{item.cantidad}</TableCell>
                                            <TableCell className="text-right">${parseFloat(item.precio_unitario_acordado).toLocaleString('es-CL')}</TableCell>
                                            <TableCell className="text-right font-semibold">
                                                ${parseFloat(item.subtotal_linea).toLocaleString('es-CL')}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="flex justify-end mt-4 pt-4 border-t">
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground">Total de la Orden</p>
                                    <p className="text-2xl font-bold text-orange-600">
                                        ${parseFloat(selectedOrder.total_orden).toLocaleString('es-CL')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Listado de Órdenes */}
            {!showForm && !showDetails && (
                <>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Buscar por proveedor o estado..."
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring max-w-sm"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead>Orden #</TableHead>
                                        <TableHead>Proveedor</TableHead>
                                        <TableHead>Fecha Creación</TableHead>
                                        <TableHead>Entrega Estimada</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8">Cargando órdenes...</TableCell>
                                        </TableRow>
                                    ) : filteredOrders.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                                <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                                                No se encontraron órdenes de compra
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredOrders.map((order) => (
                                            <TableRow key={order.id_orden}>
                                                <TableCell className="font-medium">#{order.id_orden}</TableCell>
                                                <TableCell>{getSupplierName(order.id_proveedor)}</TableCell>
                                                <TableCell>{new Date(order.fecha_creacion).toLocaleDateString('es-CL')}</TableCell>
                                                <TableCell>
                                                    {order.fecha_entrega_estimada
                                                        ? new Date(order.fecha_entrega_estimada).toLocaleDateString('es-CL')
                                                        : '-'}
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(order.estado_orden)}`}>
                                                        {order.estado_orden}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right font-semibold">
                                                    ${parseFloat(order.total_orden).toLocaleString('es-CL')}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-blue-600"
                                                        onClick={() => handleViewDetails(order.id_orden)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
};

export default PurchaseOrders;
