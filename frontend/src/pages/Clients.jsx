import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Plus,
    Edit,
    Trash2,
    Loader2,
    Users,
    X,
    Search,
    CreditCard,
    Calendar,
    Target,
    ShieldCheck,
    Building2
} from "lucide-react";
import api from '@/api/axios';

export default function Clients() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Form Data - Using PascalCase to match backend expectations
    const [formData, setFormData] = useState({
        Razon_Social: '',
        RUT_Cliente: '',
        Ciclo_Reabastecimiento_Dias: 7,
        Limite_Credito_Autorizado: 0,
        Segmento_Cliente: 'Estándar'
    });

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        setLoading(true);
        try {
            const response = await api.get('/clients');
            setClients(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching clients:', error);
            setClients([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const clientData = {
                ...formData,
                Ciclo_Reabastecimiento_Dias: parseInt(formData.Ciclo_Reabastecimiento_Dias) || 0,
                Limite_Credito_Autorizado: parseFloat(formData.Limite_Credito_Autorizado) || 0
            };

            if (editingClient) {
                await api.put(`/clients/${editingClient.id_cliente}`, clientData);
            } else {
                // Manually handle ID as the backend/schema seems to expect it
                const maxId = clients.length > 0 ? Math.max(...clients.map(c => c.id_cliente || 0)) : 0;
                clientData.ID_Cliente = maxId + 1;
                await api.post('/clients', clientData);
            }
            fetchClients();
            resetForm();
        } catch (error) {
            console.error('Error saving client:', error);
            alert('Error al guardar el cliente: ' + (error.response?.data?.details || error.message));
        }
    };

    const handleEdit = (client) => {
        setEditingClient(client);
        setFormData({
            Razon_Social: client.razon_social || '',
            RUT_Cliente: client.rut_cliente || '',
            Ciclo_Reabastecimiento_Dias: client.ciclo_reabastecimiento_dias || 7,
            Limite_Credito_Autorizado: client.limite_credito_autorizado || 0,
            Segmento_Cliente: client.segmento_cliente || 'Estándar'
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
            Razon_Social: '',
            RUT_Cliente: '',
            Ciclo_Reabastecimiento_Dias: 7,
            Limite_Credito_Autorizado: 0,
            Segmento_Cliente: 'Estándar'
        });
        setEditingClient(null);
        setShowForm(false);
    };

    const filteredClients = clients.filter(c =>
        c.razon_social?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.rut_cliente?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-stone-900 flex items-center gap-2">
                        <Users className="h-8 w-8 text-teal-600" />
                        Cartera de Clientes
                    </h2>
                    <p className="text-stone-600 mt-1">
                        Gestión centralizada de relaciones comerciales y crédito.
                    </p>
                </div>
                {!showForm && (
                    <Button
                        onClick={() => setShowForm(true)}
                        className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white shadow-teal"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Cliente
                    </Button>
                )}
            </div>

            {/* Form Section */}
            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="border-2 border-teal-200 shadow-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2"></div>
                        <CardHeader className="bg-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-2xl text-stone-900">
                                        {editingClient ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}
                                    </CardTitle>
                                    <CardDescription>Información legal y comercial del cliente</CardDescription>
                                </div>
                                <Button variant="ghost" size="icon" onClick={resetForm}>
                                    <X className="h-6 w-6" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 bg-white">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-stone-700 flex items-center gap-2">
                                            <Building2 className="h-4 w-4 text-teal-600" /> Razón Social *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.Razon_Social}
                                            onChange={(e) => setFormData({ ...formData, Razon_Social: e.target.value })}
                                            className="w-full px-4 py-2 bg-stone-50 border-2 border-stone-200 rounded-xl focus:border-teal-500 outline-none transition-all"
                                            placeholder="Nombre de la empresa o persona"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-stone-700 flex items-center gap-2">
                                            <ShieldCheck className="h-4 w-4 text-teal-600" /> RUT / Identificador *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.RUT_Cliente}
                                            onChange={(e) => setFormData({ ...formData, RUT_Cliente: e.target.value })}
                                            className="w-full px-4 py-2 bg-stone-50 border-2 border-stone-200 rounded-xl focus:border-teal-500 outline-none transition-all"
                                            placeholder="12.345.678-9"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-stone-700 flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-orange-600" /> Ciclo de Reabastecimiento (días)
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.Ciclo_Reabastecimiento_Dias}
                                            onChange={(e) => setFormData({ ...formData, Ciclo_Reabastecimiento_Dias: e.target.value })}
                                            className="w-full px-4 py-2 bg-stone-50 border-2 border-stone-200 rounded-xl focus:border-orange-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-stone-700 flex items-center gap-2">
                                            <CreditCard className="h-4 w-4 text-emerald-600" /> Límite de Crédito Autorizado ($)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={formData.Limite_Credito_Autorizado}
                                            onChange={(e) => setFormData({ ...formData, Limite_Credito_Autorizado: e.target.value })}
                                            className="w-full px-4 py-2 bg-stone-50 border-2 border-stone-200 rounded-xl focus:border-emerald-500 outline-none transition-all font-bold text-emerald-700"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-stone-700 flex items-center gap-2">
                                            <Target className="h-4 w-4 text-violet-600" /> Segmento del Cliente
                                        </label>
                                        <select
                                            value={formData.Segmento_Cliente}
                                            onChange={(e) => setFormData({ ...formData, Segmento_Cliente: e.target.value })}
                                            className="w-full px-4 py-2 bg-stone-50 border-2 border-stone-200 rounded-xl focus:border-violet-500 outline-none transition-all"
                                        >
                                            <option value="Premium">💎 Premium</option>
                                            <option value="Estándar">⭐ Estándar</option>
                                            <option value="Básico">📦 Básico</option>
                                        </select>
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
                                        {editingClient ? 'Actualizar Cliente' : 'Registrar Cliente'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Main List */}
            <Card className="glass-white border-white/20 shadow-xl overflow-hidden">
                <CardHeader className="border-b border-stone-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-xl">Gestión de Clientes</CardTitle>
                            <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-bold">
                                {clients.length} registrados
                            </span>
                        </div>
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre o RUT..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:border-teal-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center">
                            <Loader2 className="h-10 w-10 animate-spin text-teal-600 mb-4" />
                            <p className="text-stone-500 font-medium">Cargando base de datos...</p>
                        </div>
                    ) : filteredClients.length === 0 ? (
                        <div className="py-20 text-center">
                            <Users className="h-16 w-16 text-stone-200 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-stone-800">No se encontraron clientes</h3>
                            <p className="text-stone-500 mt-2">Prueba con otro término o registra un nuevo cliente.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-stone-50/50">
                                        <TableHead className="font-bold text-stone-800 py-4">Razón Social</TableHead>
                                        <TableHead className="font-bold text-stone-800">Identificador (RUT)</TableHead>
                                        <TableHead className="font-bold text-stone-800">Logística</TableHead>
                                        <TableHead className="font-bold text-stone-800">Finanzas</TableHead>
                                        <TableHead className="font-bold text-stone-800">Segmento</TableHead>
                                        <TableHead className="font-bold text-stone-800 text-right pr-8">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredClients.map((client) => (
                                        <TableRow key={client.id_cliente} className="group hover:bg-stone-50 transition-all border-stone-100">
                                            <TableCell className="py-4">
                                                <div className="font-bold text-stone-900 leading-tight">
                                                    {client.razon_social}
                                                </div>
                                                <div className="text-xs text-stone-400 mt-1">ID: #{client.id_cliente}</div>
                                            </TableCell>
                                            <TableCell className="font-medium text-stone-600">
                                                {client.rut_cliente}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Calendar className="h-3 w-3 text-stone-400" />
                                                    Cada {client.ciclo_reabastecimiento_dias || 7} días
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-bold text-emerald-600">
                                                    ${parseFloat(client.limite_credito_autorizado || 0).toLocaleString('es-CL')}
                                                </div>
                                                <div className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Límite de Crédito</div>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${client.segmento_cliente === 'Premium' ? 'bg-violet-100 text-violet-700' :
                                                        client.segmento_cliente === 'Estándar' ? 'bg-teal-100 text-teal-700' :
                                                            'bg-stone-100 text-stone-700'
                                                    }`}>
                                                    {client.segmento_cliente || 'Estándar'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right pr-8">
                                                <div className="flex items-center justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleEdit(client)}
                                                        className="text-stone-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(client.id_cliente)}
                                                        className="text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
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
