'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await fetchApi('/logistica/products');
                setProducts(data.data || data); // Adjust based on exact backend response wrapper
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50">
                <div>
                    <h1 className="text-2xl font-bold">Catálogo de Productos</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        Visualización aislada para el tenant mediante RLS y JWT.
                    </p>
                </div>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    + Nuevo Producto
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
                    Error: {error}
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900/50 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-semibold">ID</th>
                                <th scope="col" className="px-6 py-4 font-semibold">Nombre</th>
                                <th scope="col" className="px-6 py-4 font-semibold">Tipo</th>
                                <th scope="col" className="px-6 py-4 font-semibold">Precio Base</th>
                                <th scope="col" className="px-6 py-4 font-semibold">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                                        <div className="flex justify-center items-center space-x-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></div>
                                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                        No se encontraron productos para este entorno.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id_producto_servicio} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {product.id_producto_servicio}
                                        </td>
                                        <td className="px-6 py-4">{product.nombre_producto}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full dark:bg-blue-900 dark:text-blue-300">
                                                {product.tipo}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">${product.precio_base}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                                                Activo
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
