import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Package, AlertCircle } from "lucide-react"

export default function Dashboard() {
    const stats = [
        {
            title: "Ventas de Hoy",
            value: "$0.00",
            description: "Total de ventas registradas",
            icon: DollarSign,
            trend: "+0%",
            color: "text-teal-600"
        },
        {
            title: "Pedidos Pendientes",
            value: "0",
            description: "Ordenes en proceso",
            icon: Package,
            trend: "0 nuevos",
            color: "text-orange-600"
        },
        {
            title: "Alertas de Stock",
            value: "0",
            description: "Productos bajo mínimo",
            icon: AlertCircle,
            trend: "Todo OK",
            color: "text-amber-600"
        }
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Panel de Control</h2>
                <p className="text-muted-foreground">
                    Resumen general del sistema SMG
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <Icon className={`h-4 w-4 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {stat.description}
                                </p>
                                <p className={`text-xs mt-2 ${stat.color}`}>
                                    {stat.trend}
                                </p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Quick Access */}
            <Card>
                <CardHeader>
                    <CardTitle>Acceso Rápido</CardTitle>
                    <CardDescription>
                        Accede a las funciones más utilizadas
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <button className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-colors">
                        <Package className="h-5 w-5 text-teal-600" />
                        <div className="text-left">
                            <div className="font-medium">Gestionar Productos</div>
                            <div className="text-sm text-muted-foreground">Ver y editar catálogo</div>
                        </div>
                    </button>
                    <button className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-colors">
                        <DollarSign className="h-5 w-5 text-orange-600" />
                        <div className="text-left">
                            <div className="font-medium">Nueva Venta</div>
                            <div className="text-sm text-muted-foreground">Registrar orden</div>
                        </div>
                    </button>
                </CardContent>
            </Card>
        </div>
    )
}
