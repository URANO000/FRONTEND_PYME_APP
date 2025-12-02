import React from "react";
import { Link } from "react-router-dom";
import { getUserRole } from "../utils/auth";

//Create a very simple topbar
function Topbar({toggleSidebar}) {

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }

    //Some params for showing routes for some roles only
    const userRole = getUserRole();
    const canSeeClient = userRole === "ADMINISTRADOR";



    return (

        <div>
            <nav className="bg-white shadow shadow-gray-300 max-w-full pr-8 md:px-auto dark:bg-[#101657] dark:shadow-gray-900">
                <div className="md:h-16 h-28 mx-auto md:pl-4 container flex items-center justify-between flex-wrap md:flex-nowrap">
                    <div className="order-1">
                        <button id="burger" onClick={toggleSidebar}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-7">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5" />
                            </svg>
                        </button>

                    </div>
                    {/* Logo or name goes here */}
                    <div className="text-[#70e7df] order-2 flex-1 text-center ">
                        <Link to="/">
                            <h1 className="text-xl font-semibold"><span className="text-transparent bg-clip-text bg-linear-to-r to-[#ae6fff] from-[#5a83ff] dark:bg-clip-text dark:bg-linear-to-r dark:to-[#d9bcff] dark:from-[#90abff] ">Pyme</span> Management</h1>
                        </Link>
                    </div>

                    <div className="order-3 md:order-3">
                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-300 dark:hover:bg-indigo-700 text-gray-50 rounded-xl flex items-center gap-2" onClick={handleLogout}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>Log out</span>
                        </button>
                    </div>

                    {/* <div className="order-3 md:order-3">
                        <button className="text-indigo-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                            </svg>

                        </button>
                    </div> */}


                    {/* This one's the little moon one
                    
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
</svg>

                    */}

                </div>
            </nav>

        </div>
    );
};

export default Topbar;