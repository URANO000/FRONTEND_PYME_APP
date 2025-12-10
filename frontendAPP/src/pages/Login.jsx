import LoginForm from "../components/LoginForm";

const Login = () => {
    return (
        <div className="w-full flex justify-center mt-24">
            <div className="login-page">
                <h1 className="text-4xl font-bold mt-5 mb-5 text-center">
                    <span className="text-indigo-500 dark:text-indigo-400">Bienvenido</span>
                </h1>
                <p className='text-center text-m mb-10'>
                    Por favor ingrese sus credenciales para acceder al sistema de gestión
                </p>
                <LoginForm />
            </div>
        </div>
    );
};

export default Login;