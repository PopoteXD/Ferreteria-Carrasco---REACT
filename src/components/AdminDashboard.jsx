import { Link } from "react-router-dom";
import { useProductos } from "../context/ProductsContext";

function AdminDashboard() {
  const { productos } = useProductos();
  const usuarios = JSON.parse(localStorage.getItem("usuarios_carrasco") || "[]");

  const criticos = productos.filter(
    (p) => p.stockCritico != null && p.stock <= p.stockCritico
  );

  return (
    <>
      <div className="tarjetas-metricas">
        <div className="tarjeta-metrica"><strong>{productos.length}</strong><span>Productos publicados</span></div>
        <div className="tarjeta-metrica"><strong>{usuarios.length}</strong><span>Usuarios registrados</span></div>
        <div className="tarjeta-metrica"><strong>{criticos.length}</strong><span>Productos con stock crítico</span></div>
      </div>

      <div className="panel-admin">
        <div className="panel-admin-cabecera">
          <h2 style={{ margin: 0, fontSize: "1.1rem" }}>Productos con stock crítico</h2>
          <Link to="/admin/productos" className="btn btn-secundario btn-sm">Ir a productos</Link>
        </div>
        <table className="tabla-admin">
          <thead>
            <tr><th>Código</th><th>Producto</th><th>Stock</th><th>Stock crítico</th></tr>
          </thead>
          <tbody>
            {criticos.length === 0 ? (
              <tr><td colSpan="4">Ningún producto bajo el umbral crítico.</td></tr>
            ) : (
              criticos.map((p) => (
                <tr key={p.codigo}>
                  <td>{p.codigo}</td><td>{p.nombre}</td><td>{p.stock}</td><td>{p.stockCritico}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AdminDashboard;