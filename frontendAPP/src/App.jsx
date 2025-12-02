import { Routes, Route, Outlet } from 'react-router-dom';
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
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import { useState } from 'react';
import { getUserRole } from './utils/auth';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  //ThenI use a toggle, this is when I click on my burger icon
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); //If it's true then false, if false then true!
  }
  return (
    <Routes>

      {/*Login page*/}
      <Route path="/login" element={<Login />} />

      {/* Main page is protected*/}
      <Route element={
        <div className="flex flex-col h-screen">
          <Topbar toggleSidebar={toggleSidebar} />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} />
            <main className="flex-1 overflow-auto">
              <Outlet />
            </main>
          </div>
        </div>
      }>




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
        <Route path="/orders" element={<RoleRoute allowedRoles={['ADMINISTRADOR', 'VENTAS', 'OPERACIONES']}> <Order /></RoleRoute>} />
      </Route>
    </Routes>
  )
}

export default App