import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Truck, ShoppingCart, ArrowRight, TrendingUp, Users, Box } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
    const workflowPhases = [
        {
            title: "Preparación",
            description: "Carga de productos y preparación de vehículos",
            icon: Box,
            link: "/load-orders",
            gradient: "gradient-orange",
            textColor: "text-orange-900",
            bgColor: "bg-orange-50",
            borderColor: "border-orange-200"
        },
        {
            title: "Operación",
            description: "Distribución, ventas y atención a clientes",
            icon: Truck,
            link: "/sales",
            gradient: "gradient-teal",
            textColor: "text-teal-900",
            bgColor: "bg-teal-50",
            borderColor: "border-teal-200"
        },
        {
            title: "Gestión",
            description: "Control de inventario y administración",
            icon: TrendingUp,
            link: "/products",
            gradient: "gradient-amber",
            textColor: "text-amber-900",
            bgColor: "bg-amber-50",
            borderColor: "border-amber-200"
        }
    ]

    const quickActions = [
        {
            title: "Productos",
            count: "Inventario",
            icon: Package,
            link: "/products",
            color: "teal",
            gradient: "from-teal-500 to-teal-600"
        },
        {
            title: "Clientes",
            count: "Base de datos",
            icon: Users,
            link: "/clients",
            color: "orange",
            gradient: "from-orange-500 to-orange-600"
        },
        {
            title: "Ventas",
            count: "Operaciones",
            icon: ShoppingCart,
            link: "/sales",
            color: "amber",
            gradient: "from-amber-500 to-amber-600"
        }
    ]

    return (
        <div className="space-y-8">
            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-900 via-amber-800 to-teal-900 p-8 md:p-10 text-white shadow-2xl">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI0ZGRiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold mb-3 text-balance">
                        Sistema de Gestión SMG
                    </h1>
                    <p className="text-amber-100 text-lg md:text-xl max-w-2xl text-balance">
                        Organiza tu operación diaria de distribución de productos
                    </p>
                </div>
            </div>

            {/* Workflow Phases */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-stone-900">Flujo de Trabajo</h2>
                        <p className="text-stone-600 mt-1">Organiza tus tareas por fases operativas</p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {workflowPhases.map((phase, index) => {
                        const Icon = phase.icon
                        return (
                            <Link key={index} to={phase.link} className="group">
                                <Card className={`border-2 ${phase.borderColor} hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden h-full`}>
                                    <div className={`h-2 ${phase.gradient}`}></div>
                                    <CardHeader className="space-y-3">
                                        <div className={`w-14 h-14 rounded-xl ${phase.gradient} flex items-center justify-center shadow-lg`}>
                                            <Icon className="h-7 w-7 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl group-hover:text-teal-600 transition-colors">
                                                {phase.title}
                                            </CardTitle>
                                            <CardDescription className="text-base mt-2">
                                                {phase.description}
                                            </CardDescription>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <Button
                                            variant="ghost"
                                            className={`w-full ${phase.textColor} hover:bg-${phase.bgColor} group-hover:translate-x-1 transition-transform`}
                                        >
                                            Acceder
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Link>
                        )
                    })}
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-2xl font-bold text-stone-900 mb-6">Acceso Rápido</h2>
                <div className="grid gap-4 md:grid-cols-3">
                    {quickActions.map((action, index) => {
                        const Icon = action.icon
                        return (
                            <Link key={index} to={action.link}>
                                <Card className="group hover:shadow-xl transition-all duration-300 border-stone-200 hover:border-teal-300 overflow-hidden">
                                    <CardContent className="pt-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-stone-600 mb-1">{action.count}</p>
                                                <h3 className="text-2xl font-bold text-stone-900 group-hover:text-teal-600 transition-colors">
                                                    {action.title}
                                                </h3>
                                            </div>
                                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                                <Icon className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        )
                    })}
                </div>
            </div>

            {/* Info Banner */}
            <Card className="border-2 border-teal-200 bg-gradient-to-r from-teal-50 to-orange-50">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-full bg-white shadow-md">
                            <TrendingUp className="h-6 w-6 text-teal-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-lg text-stone-900 mb-2">
                                Sistema Organizado por Fases
                            </h4>
                            <p className="text-stone-700 text-balance leading-relaxed">
                                SMG agrupa las tareas en tres fases operativas para facilitar tu flujo de trabajo:
                                <span className="font-semibold text-orange-700"> Preparación</span>,
                                <span className="font-semibold text-teal-700"> Operación</span> y
                                <span className="font-semibold text-amber-700"> Gestión</span>.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
