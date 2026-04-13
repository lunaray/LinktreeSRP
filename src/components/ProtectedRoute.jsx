import { Navigate } from "react-router-dom";
import { useAuth } from "../state/context/authContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/admin" replace />;
};

export default ProtectedRoute;
