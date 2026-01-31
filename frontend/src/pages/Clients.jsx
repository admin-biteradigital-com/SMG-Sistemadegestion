import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Loader2, Users } from "lucide-react"
import api from '@/api/axios';

export default function Clients() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [formData, setFormData] = useState({
        razon_social: '',
        rut_cliente: '',
        ciclo_reabastecimiento_dias: 7,
        limite_credito_autorizado: 0,
        segmento_cliente: ''
    });

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await api.get('/clients');
            setClients(response.data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Generate ID if creating new client
            let clientData = { ...formData };
            if (!editingClient) {
                const maxId = clients.length > 0 ? Math.max(...clients.map(c => c.id_cliente)) : 0;
                clientData.ID_Cliente = maxId + 1;
                clientData.Razon_Social = formData.razon_social;
                clientData.RUT_Cliente = formData.rut_cliente;
                clientData.Ciclo_Reabastecimiento_Dias = parseInt(formData.ciclo_reabastecimiento_dias);
                clientData.Limite_Credito_Autorizado = parseFloat(formData.limite_credito_autorizado);
                clientData.Segmento_Cliente = formData.segmento_cliente;
                await api.post('/clients', clientData);
            } else {
                clientData.Razon_Social = formData.razon_social;
                clientData.RUT_Cliente = formData.rut_cliente;
                clientData.Ciclo_Reabastecimiento_Dias = parseInt(formData.ciclo_reabastecimiento_dias);
                clientData.Limite_Credito_Autorizado = parseFloat(formData.limite_credito_autorizado);
                clientData.Segmento_Cliente = formData.segmento_cliente;
                await api.put(`/clients/${editingClient.id_cliente}`, clientData);
            }
            fetchClients();
            resetForm();
        } catch (error) {
            console.error('Error saving client:', error);
            alert('Error al guardar el cliente');
        }
    };

    const handleEdit = (client) => {
        setEditingClient(client);
        setFormData({
            razon_social: client.razon_social,
            rut_cliente: client.rut_cliente,
            ciclo_reabastecimiento_dias: client.ciclo_reabastecimiento_dias || 7,
            limite_credito_autorizado: client.limite_credito_autorizado || 0,
            segmento_cliente: client.segmento_cliente || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este cliente?')) return;
        try {
            await api.delete(`/clients/${id}`);
            fetchClients();
        } catch (error) {
            console.error('Error deleting client:', error);
            alert('Error al eliminar el cliente');
        }
    };

    const resetForm = () => {
        setFormData({
            razon_social: '',
            rut_cliente: '',
            ciclo_reabastecimiento_dias: 7,
            limite_credito_autorizado: 0,
            segmento_cliente: ''
        });
        setEditingClient(null);
        setShowForm(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
                    <p className="text-muted-foreground">
                        Gestión de clientes y puntos de venta
                    </p>
                </div>
                {!showForm && (
                    <Button onClick={() => setShowForm(true)} className="bg-teal-600 hover:bg-teal-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Cliente
                    </Button>
                )}
            </div>

            {showForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>{editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Razón Social *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.razon_social}
                                        onChange={(e) => setFormData({ ...formData, razon_social: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">RUT *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.rut_cliente}
                                        onChange={(e) => setFormData({ ...formData, rut_cliente: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Ciclo Reabastecimiento (días)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.ciclo_reabastecimiento_dias}
                                        onChange={(e) => setFormData({ ...formData, ciclo_reabastecimiento_dias: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Límite de Crédito</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formData.limite_credito_autorizado}
                                        onChange={(e) => setFormData({ ...formData, limite_credito_autorizado: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Segmento</label>
                                    <select
                                        value={formData.segmento_cliente}
                                        onChange={(e) => setFormData({ ...formData, segmento_cliente: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-md"
                                    >
                                        <option value="">Seleccione...</option>
                                        <option value="Premium">Premium</option>
                                        <option value="Estándar">Estándar</option>
                                        <option value="Básico">Básico</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
                                    {editingClient ? 'Actualizar' : 'Crear'} Cliente
                                </Button>
                                <Button type="button" variant="outline" onClick={resetForm}>
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Listado de Clientes</CardTitle>
                    <CardDescription>{clients.length} cliente(s) registrado(s)</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
                            <p className="mt-4 text-sm text-muted-foreground">Cargando clientes...</p>
                        </div>
                    ) : clients.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Users className="h-12 w-12 text-muted-foreground/50" />
                            <h3 className="mt-4 text-lg font-semibold">No hay clientes</h3>
                            <Button onClick={() => setShowForm(true)} className="mt-6 bg-teal-600 hover:bg-teal-700">
                                <Plus className="mr-2 h-4 w-4" />
                                Agregar Primer Cliente
                            </Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Razón Social</TableHead>
                                    <TableHead>RUT</TableHead>
                                    <TableHead>Ciclo (días)</TableHead>
                                    <TableHead>Límite Crédito</TableHead>
                                    <TableHead>Segmento</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clients.map((client) => (
                                    <TableRow key={client.id_cliente}>
                                        <TableCell className="font-medium">{client.razon_social}</TableCell>
                                        <TableCell>{client.rut_cliente}</TableCell>
                                        <TableCell>{client.ciclo_reabastecimiento_dias || '-'}</TableCell>
                                        <TableCell>${parseFloat(client.limite_credito_autorizado || 0).toLocaleString('es-CL')}</TableCell>
                                        <TableCell>{client.segmento_cliente || '-'}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEdit(client)}
                                                className="text-teal-600 hover:text-teal-700"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(client.id_cliente)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
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
