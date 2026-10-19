import { Link } from "react-router-dom";
import { CATEGORIAS, formatoCLP } from "../data/productos";
import { useProductos } from "../context/ProductsContext";

function AdminProductos() {
  const { productos, eliminarProducto } = useProductos();

  function nombreCategoria(id) {
    const cat = CATEGORIAS.find((c) => c.id === id);
    return cat ? cat.nombre : id;
  }

  function eliminar(p) {
    // confirm pide confirmacion antes de borrar, por si fue un clic accidental
    if (window.confirm(`¿Eliminar "${p.nombre}" del catálogo?`)) {
      eliminarProducto(p.codigo);
    }
  }

  return (
    <div className="panel-admin">
      <div className="panel-admin-cabecera">
        <h2 style={{ margin: 0, fontSize: "1.1rem" }}>Catálogo de productos</h2>
        <Link to="/admin/productos/nuevo" className="btn btn-primario btn-sm">+ Nuevo producto</Link>
      </div>

      <table className="tabla-admin">
        <thead>
          <tr>
            <th>Código</th><th>Nombre</th><th>Categoría</th><th>Precio</th>
            <th>Stock</th><th>Estado</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.length === 0 && (
            <tr><td colSpan="7">Aún no hay productos. Crea el primero.</td></tr>
          )}
          {productos.map((p) => {
            const critico = p.stockCritico != null && p.stock <= p.stockCritico;
            return (
              <tr key={p.codigo}>
                <td>{p.codigo}</td>
                <td>{p.nombre}</td>
                <td>{nombreCategoria(p.categoria)}</td>
                <td>{formatoCLP(p.precio)}</td>
                <td>{p.stock}</td>
                <td>
                  {critico
                    ? <span className="pastilla critico">Stock crítico</span>
                    : <span className="pastilla ok">Normal</span>}
                </td>
                <td className="acciones-tabla">
                  <Link to={`/admin/productos/editar/${p.codigo}`}>Editar</Link>
                  <button type="button" className="eliminar" onClick={() => eliminar(p)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default AdminProductos;