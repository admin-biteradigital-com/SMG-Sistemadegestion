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
        nombre_cliente: '',
        direccion_cliente: '',
        telefono_cliente: '',
        email_cliente: ''
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
            if (editingClient) {
                await api.put(`/clients/${editingClient.id_cliente}`, formData);
            } else {
                await api.post('/clients', formData);
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
            nombre_cliente: client.nombre_cliente,
            direccion_cliente: client.direccion_cliente || '',
            telefono_cliente: client.telefono_cliente || '',
            email_cliente: client.email_cliente || ''
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
            nombre_cliente: '',
            direccion_cliente: '',
            telefono_cliente: '',
            email_cliente: ''
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
                                    <label className="text-sm font-medium">Nombre *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.nombre_cliente}
                                        onChange={(e) => setFormData({ ...formData, nombre_cliente: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Teléfono</label>
                                    <input
                                        type="tel"
                                        value={formData.telefono_cliente}
                                        onChange={(e) => setFormData({ ...formData, telefono_cliente: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email_cliente}
                                        onChange={(e) => setFormData({ ...formData, email_cliente: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Dirección</label>
                                    <input
                                        type="text"
                                        value={formData.direccion_cliente}
                                        onChange={(e) => setFormData({ ...formData, direccion_cliente: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
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
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Teléfono</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Dirección</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clients.map((client) => (
                                    <TableRow key={client.id_cliente}>
                                        <TableCell className="font-medium">{client.nombre_cliente}</TableCell>
                                        <TableCell>{client.telefono_cliente || '-'}</TableCell>
                                        <TableCell>{client.email_cliente || '-'}</TableCell>
                                        <TableCell>{client.direccion_cliente || '-'}</TableCell>
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
