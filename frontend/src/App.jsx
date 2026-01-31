import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Clients from './pages/Clients';
import Sales from './pages/Sales';
import LoadOrders from './pages/LoadOrders';
import Suppliers from './pages/Suppliers';
import PurchaseOrders from './pages/PurchaseOrders';

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
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="purchase-orders" element={<PurchaseOrders />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
