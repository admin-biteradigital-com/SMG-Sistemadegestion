import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Clients from './pages/Clients';
import Sales from './pages/Sales';
import LoadOrders from './pages/LoadOrders';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="clients" element={<Clients />} />
          <Route path="sales" element={<Sales />} />
          <Route path="load-orders" element={<LoadOrders />} />
          {/* Placeholders for future routes */}
          <Route path="suppliers" element={<div className="p-4 text-center text-muted-foreground">Módulo de Proveedores (Próximamente)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
