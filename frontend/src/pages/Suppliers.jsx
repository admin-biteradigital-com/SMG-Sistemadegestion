import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Plus, Pencil, Trash2, Search, Truck } from 'lucide-react';

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentSupplier, setCurrentSupplier] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        Nombre_Proveedor: '',
        Contacto_Proveedor: '',
        Telefono_Proveedor: '',
        Email_Proveedor: '',
        Direccion_Proveedor: '',
        RUT_Proveedor: ''
    });

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const response = await api.get('/suppliers');
            setSuppliers(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/suppliers/${currentSupplier.id_proveedor}`, formData);
            } else {
                await api.post('/suppliers', formData);
            }
            fetchSuppliers();
            resetForm();
        } catch (error) {
            console.error('Error saving supplier:', error);
            alert('Error al guardar el proveedor. Verifique que el RUT no esté duplicado.');
        }
    };

    const handleEdit = (supplier) => {
        setCurrentSupplier(supplier);
        setFormData({
            Nombre_Proveedor: supplier.nombre_proveedor,
            Contacto_Proveedor: supplier.contacto_proveedor || '',
            Telefono_Proveedor: supplier.telefono_proveedor || '',
            Email_Proveedor: supplier.email_proveedor || '',
            Direccion_Proveedor: supplier.direccion_proveedor || '',
            RUT_Proveedor: supplier.rut_proveedor
        });
        setIsEditing(true);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar este proveedor?')) {
            try {
                await api.delete(`/suppliers/${id}`);
                fetchSuppliers();
            } catch (error) {
                console.error('Error deleting supplier:', error);
                alert('No se puede eliminar el proveedor. Es posible que tenga órdenes de compra asociadas.');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            Nombre_Proveedor: '',
            Contacto_Proveedor: '',
            Telefono_Proveedor: '',
            Email_Proveedor: '',
            Direccion_Proveedor: '',
            RUT_Proveedor: ''
        });
        setIsEditing(false);
        setCurrentSupplier(null);
        setShowForm(false);
    };

    const filteredSuppliers = suppliers.filter(supplier =>
        (supplier.nombre_proveedor && supplier.nombre_proveedor.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (supplier.rut_proveedor && supplier.rut_proveedor.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-amber-900 flex items-center gap-2">
                        <Truck className="h-8 w-8" />
                        Proveedores
                    </h1>
                    <p className="text-muted-foreground mt-1">Gestión de proveedores y contactos</p>
                </div>
                {!showForm && (
                    <Button
                        onClick={() => setShowForm(true)}
                        className="bg-teal-600 hover:bg-teal-700 text-white"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Nuevo Proveedor
                    </Button>
                )}
            </div>

            {showForm && (
                <Card className="border-amber-200 shadow-md">
                    <CardHeader className="bg-amber-50/50">
                        <CardTitle className="text-amber-900">
                            {isEditing ? 'Editar Proveedor' : 'Registrar Nuevo Proveedor'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Razón Social / Nombre *</label>
                                    <input
                                        type="text"
                                        name="Nombre_Proveedor"
                                        value={formData.Nombre_Proveedor}
                                        onChange={handleInputChange}
                                        required
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">RUT *</label>
                                    <input
                                        type="text"
                                        name="RUT_Proveedor"
                                        value={formData.RUT_Proveedor}
                                        onChange={handleInputChange}
                                        required
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Contacto</label>
                                    <input
                                        type="text"
                                        name="Contacto_Proveedor"
                                        value={formData.Contacto_Proveedor}
                                        onChange={handleInputChange}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Teléfono</label>
                                    <input
                                        type="text"
                                        name="Telefono_Proveedor"
                                        value={formData.Telefono_Proveedor}
                                        onChange={handleInputChange}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <input
                                        type="email"
                                        name="Email_Proveedor"
                                        value={formData.Email_Proveedor}
                                        onChange={handleInputChange}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Dirección</label>
                                    <input
                                        type="text"
                                        name="Direccion_Proveedor"
                                        value={formData.Direccion_Proveedor}
                                        onChange={handleInputChange}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={resetForm}>
                                    Cancelar
                                </Button>
                                <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white">
                                    {isEditing ? 'Actualizar' : 'Guardar'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Buscar por nombre o RUT..."
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 max-w-sm"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead>RUT</TableHead>
                                <TableHead>Razón Social</TableHead>
                                <TableHead>Contacto</TableHead>
                                <TableHead>Teléfono</TableHead>
                                <TableHead>Dirección</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">Cargando proveedores...</TableCell>
                                </TableRow>
                            ) : filteredSuppliers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No se encontraron proveedores
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredSuppliers.map((supplier) => (
                                    <TableRow key={supplier.id_proveedor}>
                                        <TableCell className="font-medium">{supplier.rut_proveedor}</TableCell>
                                        <TableCell>{supplier.nombre_proveedor}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span>{supplier.contacto_proveedor}</span>
                                                <span className="text-xs text-muted-foreground">{supplier.email_proveedor}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{supplier.telefono_proveedor}</TableCell>
                                        <TableCell>{supplier.direccion_proveedor}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-blue-600"
                                                    onClick={() => handleEdit(supplier)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-600"
                                                    onClick={() => handleDelete(supplier.id_proveedor)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default Suppliers;
