import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { totalUnidades } = useCart();
  const { usuario, cerrarSesion } = useAuth();

  return (
    <header className="encabezado">
      <div className="contenedor nav">
        <Link to="/" className="marca">
          <img src="/img/productos/Logo BLANCO.png" alt="Ferreteria Carrasco" className="logo" />
        </Link>
        <nav className="nav-links">
          <Link to="/">Inicio</Link>
          <Link to="/productos">Productos</Link>
          <Link to="/nosotros">Nosotros</Link>
          <Link to="/contacto">Contacto</Link>
        </nav>
        <div className="nav-acciones">
          {usuario ? (
            <>
              {usuario.tipoUsuario === "Administrador" && (
                <Link to="/admin" className="btn btn-sm btn-secundario">Panel admin</Link>
              )}
              <Link to="/perfil" className="btn btn-sm btn-secundario">Mi Perfil</Link>
              <button type="button" className="btn btn-sm btn-secundario" onClick={cerrarSesion}>
                Salir
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-sm btn-secundario">Ingresar</Link>
          )}
          <Link to="/carrito" className="btn-icono">
            Carrito
            {totalUnidades > 0 && <span className="badge-carrito">{totalUnidades}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;