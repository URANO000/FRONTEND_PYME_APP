import React from 'react';
import { Link } from "react-router-dom";
import { getUserRole } from '../utils/auth';

function Home() {
  //Parameters for super cool thing I'm doing
  const userRole = getUserRole();

  return (
    <>
      <div className='text-center mt-10'>
        <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl"><span class="text-indigo-500 dark:text-indigo-300">Sistema de Gestión</span> para pymes</h1>
        <p className='text-xl'>Usted ha ingresado con rol de <span className='text-indigo-500 dark:text-indigo-500 dark:hover:text-emerald-200'>{userRole}</span></p>
      </div>

    </>
  )
};

export default Home;