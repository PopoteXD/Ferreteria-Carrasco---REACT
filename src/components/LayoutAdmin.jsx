import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LayoutAdmin() {
  const { usuario } = useAuth();

  return (
    <div className="diseno-admin">
      <div className="admin-lateral">
        <div className="marca-admin">
          Carrasco
          <br />
          <small style={{ fontWeight: "normal", fontSize: "0.7rem" }}>PANEL ADMIN</small>
        </div>
        <nav>
          <NavLink to="/admin" end>📊 Resumen</NavLink>
          <NavLink to="/admin/productos">📦 Productos</NavLink>
          <NavLink to="/">🌐 Ver tienda</NavLink>
        </nav>
      </div>

      <div className="admin-principal">
        <div className="admin-encabezado">
          <h1 style={{ fontSize: "1.4rem", margin: 0 }}>Panel administrador</h1>
          <span>Hola, <strong>{usuario.nombre} {usuario.apellidos}</strong></span>
        </div>
        <div className="admin-contenido">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default LayoutAdmin;