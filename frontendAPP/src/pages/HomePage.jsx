import React from 'react';
import { Link } from "react-router-dom";

function Home() {

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }


  return (
    <>
      <div>
        <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl"><span class="text-transparent bg-clip-text bg-linear-to-r to-[#5efff4] from-[#3c6dff]">Sistema de Gestión</span> para pymes</h1>
        <p>Quick links </p>

        <Link to="/">Home</Link> <br />
        <Link to="/clients">Clientes</Link> <br />
        <Link to="/products">Productos</Link> <br />
        <Link to="/orders">Orders</Link> <br />
        <button onClick={handleLogout} className="text-white bg-[#161D6F] hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-m px-5 py-2.5 me-2 mb-2 dark:bg-[#70e7df] dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 dark:text-gray-800 ">Logout</button>
      </div>

    </>
  )
};

export default Home;