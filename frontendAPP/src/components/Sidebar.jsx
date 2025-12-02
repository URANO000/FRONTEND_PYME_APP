import React from "react";
import { Link } from "react-router-dom";
import { getUserRole } from "../utils/auth";

function Sidebar({ isOpen }) {

    //Some params for showing routes for some roles only
    const userRole = getUserRole();
    const canSeeClient = userRole === "ADMINISTRADOR";


    return (
        <div className="sidebar">
            <aside id="my-sidebar" className={`fiex top-0 left-0 z-40 w-64 h-full transition-transform -translate-x-full sm:translate-x-0 ${isOpen ? 'w-64' : 'w-0 md:w-16'}`} aria-label="Sidebar">
                <div className={`bg-gray-50 shadow dark:bg-[#04061a] h-full px-3 py-4 overflow-y-auto ${isOpen ? 'block' : 'hidden'}`}>
                    <ul className="space-y-2 font-medium">
                        <li className="pb-2.5 hover:bg-gray-200 dark:hover:bg-[#14184d] rounded-xl">
                            <a className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group text-indigo-400  dark:text-indigo-400 font-semibold">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">
                                    <Link to="/">Home</Link>
                                </span>
                            </a>
                        </li>
                        {
                            canSeeClient && (
                                <li className="pb-2.5 hover:bg-gray-200 dark:hover:bg-[#14184d] rounded-xl">
                                    <a className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group text-indigo-400  dark:text-indigo-400  font-semibold">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" />
                                        </svg>


                                        <span className="flex-1 ms-3 whitespace-nowra">

                                            <Link to="/clients">Clientes</Link>


                                        </span>
                                    </a>
                                </li>
                            )
                        }
                        <li className="pb-2.5 hover:bg-gray-200 dark:hover:bg-[#14184d] rounded-xl">
                            <a className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group text-indigo-400  dark:text-indigo-400 font-semibold">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                </svg>

                                <span className="flex-1 ms-3 whitespace-nowrap">
                                    <Link to="/products">Productos</Link>
                                </span>
                            </a>
                        </li >
                        <li className="pb-2.5  hover:bg-gray-200 dark:hover:bg-[#14184d] rounded-xl">
                            <a className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group text-indigo-400  dark:text-indigo-400 font-semibold">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                                </svg>

                                <span className="flex-1 ms-3 whitespace-nowrap">
                                    <Link to="/orders">Órdenes</Link>
                                </span>
                            </a>
                        </li>

                    </ul>
                </div>
            </aside>
        </div>
    );
};

export default Sidebar;