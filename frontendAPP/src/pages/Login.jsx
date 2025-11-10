import LoginForm from "../components/LoginForm";

const Login = () => {
    return (
        <div className="login-page mt-24">
            <h1 className="text-4xl font-bold mt-5 mb-5 text-center"><span className=" text-indigo-900 dark:text-indigo-400">Bienvenido</span></h1>
            <p className='text-center text-m mb-10'>Por favor ingrese sus credenciales para acceder al sistema de gestión</p>
            <LoginForm />
        </div>
    );
};

export default Login;