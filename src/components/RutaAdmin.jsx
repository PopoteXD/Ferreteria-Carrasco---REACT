import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RutaAdmin({ children }) {
  const { usuario } = useAuth();

  if (!usuario || usuario.tipoUsuario !== "Administrador") {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default RutaAdmin;