import { Navigate } from 'react-router-dom';
import { getUserRole } from '../utils/auth';

const RoleRoute = ({ children, allowedRoles }) => {
  const tokenRole = getUserRole();

  if (!tokenRole) return <Navigate to="/login" />;
  if (!allowedRoles.includes(tokenRole)) return <Navigate to="/403" />; //Which by default will go to my 404 page nyeeeheheh

  return children;
};

export default RoleRoute;