import React, { useState } from 'react';
import api from '../services/axios';
import { useNavigate } from 'react-router-dom';

//Jsx returns 
//Set the constant variables and setters you need for the login form
const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    //Handle submit of my form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await api.post('Auth/Login', { email, password });
            const token = response.data.token;

            if (token) {
                localStorage.setItem('token', token);
                navigate('/');  //Immediately navigates to my home page!
            } else {
                setError('No token was returned from the server, what happened?');
            }
        } catch (err) {
            //If unauthorized => 401
            if (err.response?.status === 401) {
                setError('Invalid email or password...');
            } else {
                setError('An error ocurred, try again');
            }
            console.error(err);
        }

    };

    //finally the html form
    return (
        <div className='m-10'>
            <h2 className='text-center text-3xl font-semibold text-indigo-500 mb-10'>Formulario de ingreso</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit} className='max-w-sm mx-auto'>
                <div>
                    <div className='mb-5'>
                        <label for='email' className="block mb-2 text-m font-medium text-indigo-950 dark:text-white">
                            Correo Electrónico</label>
                        <input
                            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                            type="email"
                            placeholder="Correo Electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        /> <br />
                    </div>
                    <div className='mb-5'>
                        <label className="block mb-2 text-m font-medium text-indigo-950 dark:text-white">
                            Contraseña
                        </label>
                        <input
                            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        /> <br />
                    </div>

                    <button type="submit" className='bg-indigo-600 text-white hover:bg-indigo-300 dark:bg-indigo-500 dark:hover:bg-indigo-600 py-2 px-4 rounded-xl text-l'>
                        Ingresar</button>
                </div>

            </form>
        </div>

    );

};

export default LoginForm;
