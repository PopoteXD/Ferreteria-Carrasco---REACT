import { formatoCLP } from "../data/productos";
import { useCart } from "../context/CartContext";
import { unidadesDisponibles } from "../utils/stock";
import { Link } from "react-router-dom";

function ProductCard({ producto }) {
  const { agregar, carrito } = useCart();

  const enCarrito = carrito?.find((l) => l.codigo === producto.codigo)?.cantidad ?? 0;
  const disponibles = unidadesDisponibles(producto, enCarrito);
  const agotado = typeof producto.stock === "number" && producto.stock <= 0;
  const sinDisponibles = disponibles <= 0;

  const textoBoton = agotado ? "Sin stock" : sinDisponibles ? "Max. en carrito" : "Añadir";

  return (
    <div className="tarjeta-producto">
      <div className="miniatura">
        <img src={producto.imagen} alt={producto.nombre} />
      </div>
      <div className="cuerpo">
        <h3>{producto.nombre}</h3>
        <span className="codigo">Codigo: {producto.codigo}</span>
        <span className="precio">{formatoCLP(producto.precio)}</span>
        {typeof producto.stock === "number" && (
          <span className="codigo">Stock disponible: {producto.stock}</span>
        )}
      </div>
      <div className="acciones-tarjeta">
        <Link to={`/producto/${producto.codigo}`} className="btn btn-secundario btn-sm">
          Ver detalle
        </Link>
            <button
              type="button"
              className="btn btn-primario btn-sm"
              disabled={sinDisponibles}
              onClick={() => agregar(producto.codigo)}
            >
              {textoBoton}
          </button>
      </div>
    </div>
  );
}

export default ProductCard;