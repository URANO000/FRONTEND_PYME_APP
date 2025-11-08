import { Routes, Route } from 'react-router-dom';
import './App.css';
import PageNotFound from "./customPages/404Page";
import ServerError from "./customPages/500Page";
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Client from './pages/Client';
import Product from './pages/Product';
import PrivateRoute from './utils/PrivateRoute';
import RoleRoute from './utils/RoleRoute';
import Order from './pages/Order'

function App() {
  return (
    <Routes>

      {/*Login page*/}
      <Route path="/login"  element={<Login />} />

      {/* Main page is protected*/}
      <Route path="/" element={
        <PrivateRoute>
                  <HomePage />
        </PrivateRoute>
        } />

      {/* Catch-all 404 route */}
      <Route path="/500" element={<ServerError />} />
      <Route path="*" element={<PageNotFound />} />
      <Route path="/clients" element={<RoleRoute allowedRoles={['ADMINISTRADOR']}><Client /></RoleRoute>} />
      <Route path="/products" element={<RoleRoute allowedRoles={['ADMINISTRADOR', 'OPERACIONES', 'VENTAS']}> <Product /></RoleRoute>} />
      <Route path="/orders" element={<RoleRoute allowedRoles={['ADMINISTRADOR']}> <Order /></RoleRoute>} />  
    </Routes>
  )
}

export default App