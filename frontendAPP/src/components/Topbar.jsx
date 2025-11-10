import React from "react";
import { Link } from "react-router-dom";
import { getUserRole } from "../utils/auth";

//Create a very simple topbar
function Topbar() {

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }

    //Some params for showing routes for some roles only
    const userRole = getUserRole();
    const canSeeClient = userRole === "ADMINISTRADOR";



    return (

        <div>
            <nav className="bg-gray-200 shadow shadow-gray-300 max-w-full px-8 md:px-auto dark:bg-[#101657] dark:shadow-gray-900">
                <div className="md:h-16 h-28 mx-auto md:px-4 container flex items-center justify-between flex-wrap md:flex-nowrap">
                    {/* Logo or name goes here */}
                    <div className="text-[#70e7df]">
                        <Link to="/">
                            <h1 className="text-xl font-semibold"><span className="text-transparent bg-clip-text bg-linear-to-r to-[#d9bcff] from-[#90abff]">Pyme</span> Management</h1>
                        </Link>
                    </div>

                    <div className="text-gray-500 order-3 w-full md:w-auto md:order-2">
                        <ul className="flex font-semibold justify between">
                            <li className="md:px-4 md:py-2 text-indigo-500">
                                <Link to="/">Home</Link>
                            </li>
                            {
                                canSeeClient && (
                                    <li className="md:px-4 md:py-2 text-indigo-500">
                                        <Link to="/clients">Clientes</Link>
                                    </li >
                                )
                            }
                            <li className="md:px-4 md:py-2 text-indigo-500">
                                <Link to="/products">Productos</Link>
                            </li>
                            <li className="md:px-4 md:py-2 text-indigo-500">
                                <Link to="/orders">Órdenes</Link>
                            </li>
                        </ul>

                    </div>

                    <div class="order-2 md:order-3">
                        <button class="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-gray-50 rounded-xl flex items-center gap-2" onClick={handleLogout}>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                            <span>Log out</span>
                        </button>
                    </div>

                </div>
            </nav>

        </div>
    );
};

export default Topbar;