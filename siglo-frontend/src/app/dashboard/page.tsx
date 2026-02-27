export default function DashboardIndex() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50">
                <div>
                    <h1 className="text-2xl font-bold">Resumen General</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        Panel de control principal del ecosistema SIGLO.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: "Órdenes Activas", value: "24", color: "bg-blue-500" },
                    { title: "Alertas de Stock", value: "3", color: "bg-orange-500" },
                    { title: "Vehículos en Ruta", value: "8", color: "bg-green-500" }
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-xl text-white flex items-center justify-center font-bold text-xl shadow-lg ${stat.color}`}>
                                #
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.title}</p>
                                <p className="text-3xl font-black mt-1 dark:text-white">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50">
                <h3 className="font-semibold text-lg mb-4">Actividad Reciente</h3>
                <div className="space-y-4">
                    <div className="flex items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-4"></div>
                        <p className="text-sm font-medium">Autenticación exitosa confirmada vía JWT para el tenant actual.</p>
                    </div>
                    <div className="flex items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-4"></div>
                        <p className="text-sm font-medium">Bases de datos aisladas y políticas RLS activas.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
