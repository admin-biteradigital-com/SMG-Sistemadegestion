import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, ShoppingCart, Loader2 } from "lucide-react"
import api from '@/api/axios';

export default function NewSale() {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [formData, setFormData] = useState({
        id_cliente: '',
        id_sucursal_cliente: '',
        tipo_pago: 'efectivo',
        notas: ''
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
            setClients(clientsRes.data);
            setProducts(productsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const addProduct = () => {
        setSelectedProducts([...selectedProducts, {
            id_producto_servicio: '',
            cantidad_vendida: '',
            precio_unitario_venta: '',
            temp: Math.random()
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
                        updated.precio_unitario_venta = product.precio_venta_sugerido;
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

        try {
            const saleData = {
                id_cliente: parseInt(formData.id_cliente),
                id_sucursal_cliente: formData.id_sucursal_cliente ? parseInt(formData.id_sucursal_cliente) : null,
                tipo_pago: formData.tipo_pago,
                total_venta: calculateTotal(),
                notas: formData.notas,
                productos: selectedProducts
                    .filter(p => p.id_producto_servicio && p.cantidad_vendida)
                    .map(p => ({
                        id_producto_servicio: parseInt(p.id_producto_servicio),
                        cantidad_vendida: parseInt(p.cantidad_vendida),
                        precio_unitario_venta: parseFloat(p.precio_unitario_venta)
                    }))
            };

            await api.post('/sales', saleData);
            alert('Venta registrada exitosamente');
            navigate('/sales');
        } catch (error) {
            console.error('Error creating sale:', error);
            alert('Error al registrar la venta: ' + (error.response?.data?.error || error.message));
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Nueva Venta</h2>
                    <p className="text-muted-foreground">
                        Registrar venta a cliente
                    </p>
                </div>
                <Button variant="outline" onClick={() => navigate('/sales')}>
                    Cancelar
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Información de la Venta</CardTitle>
                    <CardDescription>Complete los datos de la transacción</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Client Selection */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Cliente *</label>
                                <select
                                    required
                                    value={formData.id_cliente}
                                    onChange={(e) => setFormData({ ...formData, id_cliente: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md"
                                >
                                    <option value="">Seleccionar cliente</option>
                                    {clients.map(c => (
                                        <option key={c.id_cliente} value={c.id_cliente}>
                                            {c.razon_social} - RUT: {c.rut_cliente}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tipo de Pago *</label>
                                <select
                                    required
                                    value={formData.tipo_pago}
                                    onChange={(e) => setFormData({ ...formData, tipo_pago: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md"
                                >
                                    <option value="efectivo">Efectivo</option>
                                    <option value="transferencia">Transferencia</option>
                                    <option value="credito">Crédito</option>
                                    <option value="debito">Débito</option>
                                </select>
                            </div>
                        </div>

                        {/* Products Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">Productos *</label>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={addProduct}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Añadir Producto
                                </Button>
                            </div>

                            {selectedProducts.length === 0 ? (
                                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                                    <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground/50" />
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        No hay productos agregados. Haz clic en "Añadir Producto" para comenzar.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {selectedProducts.map((item) => (
                                        <div key={item.temp} className="flex gap-2 items-start">
                                            <select
                                                value={item.id_producto_servicio}
                                                onChange={(e) => updateProduct(item.temp, 'id_producto_servicio', e.target.value)}
                                                className="flex-1 px-3 py-2 border rounded-md"
                                            >
                                                <option value="">Seleccionar producto</option>
                                                {products.map(p => (
                                                    <option key={p.id_producto_servicio} value={p.id_producto_servicio}>
                                                        {p.nombre_producto_servicio} (Stock: {p.stock_actual || 0})
                                                    </option>
                                                ))}
                                            </select>
                                            <Input
                                                type="number"
                                                placeholder="Cantidad"
                                                value={item.cantidad_vendida}
                                                onChange={(e) => updateProduct(item.temp, 'cantidad_vendida', e.target.value)}
                                                className="w-24"
                                                min="1"
                                            />
                                            <Input
                                                type="number"
                                                placeholder="Precio"
                                                value={item.precio_unitario_venta}
                                                onChange={(e) => updateProduct(item.temp, 'precio_unitario_venta', e.target.value)}
                                                className="w-32"
                                                step="0.01"
                                                min="0"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeProduct(item.temp)}
                                                className="text-red-600"
                                            >
                                                ×
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Total */}
                        {selectedProducts.length > 0 && (
                            <div className="flex justify-end">
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground">Total</p>
                                    <p className="text-2xl font-bold text-teal-600">
                                        ${calculateTotal().toLocaleString('es-CL', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Notes */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Notas</label>
                            <textarea
                                value={formData.notas}
                                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md"
                                rows={3}
                                placeholder="Observaciones adicionales..."
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Registrar Venta
                            </Button>
                            <Button type="button" variant="outline" onClick={() => navigate('/sales')}>
                                Cancelar
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
