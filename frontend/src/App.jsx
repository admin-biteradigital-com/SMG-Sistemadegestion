import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          {/* Placeholders for future routes */}
          <Route path="clients" element={<div className="p-4">Módulo de Clientes (Próximamente)</div>} />
          <Route path="suppliers" element={<div className="p-4">Módulo de Proveedores (Próximamente)</div>} />
          <Route path="sales" element={<div className="p-4">Módulo de Ventas (Próximamente)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
