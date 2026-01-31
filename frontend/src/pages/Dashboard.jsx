import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Truck, ShoppingCart, Clock, Sun, Moon } from "lucide-react"

export default function Dashboard() {
    const dailyPhases = [
        {
            title: "Preparación Matutina",
            description: "Cargar productos en vehículos",
            icon: Sun,
            time: "6:00 AM - 8:00 AM",
            link: "/load-orders",
            color: "text-orange-600",
            bgColor: "bg-orange-50"
        },
        {
            title: "Operación en Calle",
            description: "Distribución y ventas",
            icon: Truck,
            time: "8:00 AM - 6:00 PM",
            link: "/sales",
            color: "text-teal-600",
            bgColor: "bg-teal-50"
        },
        {
            title: "Cierre del Día",
            description: "Balance y reabastecimiento",
            icon: Moon,
            time: "6:00 PM - 8:00 PM",
            link: "/products",
            color: "text-amber-600",
            bgColor: "bg-amber-50"
        }
    ]

    const quickActions = [
        {
            title: "Gestionar Productos",
            description: "Inventario y catálogo",
            icon: Package,
            link: "/products",
            color: "bg-teal-600 hover:bg-teal-700"
        },
        {
            title: "Registrar Venta",
            description: "Nueva transacción",
            icon: ShoppingCart,
            link: "/sales",
            color: "bg-orange-600 hover:bg-orange-700"
        },
        {
            title: "Orden de Carga",
            description: "Preparar distribución",
            icon: Truck,
            link: "/load-orders",
            color: "bg-amber-600 hover:bg-amber-700"
        }
    ]

    const currentHour = new Date().getHours()
    const currentPhase = currentHour < 8 ? 0 : currentHour < 18 ? 1 : 2

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Panel de Control</h2>
                <p className="text-muted-foreground mt-1">
                    Sistema de Gestión SMG - Distribuidor de Productos
                </p>
            </div>

            {/* Daily Workflow */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Flujo de Trabajo Diario</h3>
                <div className="grid gap-4 md:grid-cols-3">
                    {dailyPhases.map((phase, index) => {
                        const Icon = phase.icon
                        const isActive = currentPhase === index
                        return (
                            <Link key={index} to={phase.link}>
                                <Card className={`hover:shadow-lg transition-all ${isActive ? 'ring-2 ring-teal-500' : ''}`}>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div className={`p-2 rounded-lg ${phase.bgColor}`}>
                                                <Icon className={`h-5 w-5 ${phase.color}`} />
                                            </div>
                                            {isActive && (
                                                <span className="text-xs px-2 py-1 rounded-full bg-teal-100 text-teal-700 font-medium">
                                                    Ahora
                                                </span>
                                            )}
                                        </div>
                                        <CardTitle className="text-lg mt-3">{phase.title}</CardTitle>
                                        <CardDescription>{phase.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Clock className="h-4 w-4 mr-2" />
                                            {phase.time}
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        )
                    })}
                </div>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Acceso Rápido</CardTitle>
                    <CardDescription>
                        Accede directamente a las funciones principales
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                    {quickActions.map((action, index) => {
                        const Icon = action.icon
                        return (
                            <Link
                                key={index}
                                to={action.link}
                                className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-colors"
                            >
                                <div className={`p-2 rounded-md ${action.color} text-white`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className="text-left">
                                    <div className="font-medium">{action.title}</div>
                                    <div className="text-sm text-muted-foreground">{action.description}</div>
                                </div>
                            </Link>
                        )
                    })}
                </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="bg-gradient-to-r from-teal-50 to-orange-50 border-teal-200">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-full bg-white">
                            <Package className="h-6 w-6 text-teal-600" />
                        </div>
                        <div>
                            <h4 className="font-semibold mb-1">Sistema Organizado por Rutina</h4>
                            <p className="text-sm text-muted-foreground">
                                El SMG está diseñado siguiendo el flujo natural de trabajo: preparación matutina,
                                operación en calle durante el día, y cierre vespertino con balance y compras.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
