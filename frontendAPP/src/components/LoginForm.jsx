import React, {useState} from 'react';
import api from '../services/axios';
import {useNavigate} from 'react-router-dom';

//Jsx returns 
//Set the constant variables and setters you need for the login form
const LoginForm = () =>{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    //Handle submit of my form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try{
            const response = await api.post('Auth/Login', {email, password});
            const token = response.data.token;

            if(token) {
                localStorage.setItem('token', token);
                navigate('/');  //Immediately navigates to my home page!
            }else {
                setError('No token was returned from the server, what happened?');
            }
        }catch(err){
            //If unauthorized => 401
            if(err.response?.status === 401){
                setError('Invalid email or password...');
            }else {
                setError('An error ocurred, try again');
            }
            console.error(err);
        }

    };

    //finally the html form
    return(
        <div>
            <h2>Login Form</h2>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                /> <br />

                <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                /> <br />

                <button type="submit">Login</button>

            </form>
        </div>

    );

};

export default LoginForm;
