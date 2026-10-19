import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CATEGORIAS, formatoCLP } from "../data/productos";
import { useCart } from "../context/CartContext";
import { useProductos } from "../context/ProductsContext";
import { unidadesDisponibles } from "../utils/stock";

function ProductoDetalle() {
  const { codigo } = useParams(); // lee :codigo de la URL /producto/:codigo
  const { agregar, carrito } = useCart();
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);
  const { productos } = useProductos();

  const producto = productos.find((p) => p.codigo === codigo);

  if (!producto) {
    return (
      <section className="seccion">
        <div className="contenedor">
          <p>No encontramos ese producto. <Link to="/productos">Volver al catálogo</Link></p>
        </div>
      </section>
    );
  }

  const categoria = CATEGORIAS.find((c) => c.id === producto.categoria);
  const enCarrito = carrito?.find((l) => l.codigo === producto.codigo)?.cantidad ?? 0;
  const disponibles = unidadesDisponibles(producto, enCarrito);
  const sinDisponibles = disponibles <= 0;
  // Tope para el input numerico (999 = sin control de stock).
  const tope = disponibles === Infinity ? 999 : Math.max(1, disponibles);

  function añadir() {
    if (sinDisponibles) return;
    const cantidadFinal = Math.min(cantidad, tope);
    agregar(producto.codigo, cantidadFinal);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1500);
  }

  return (
    <section className="seccion">
      <div className="contenedor">
        <p><Link to="/productos">← Volver al catálogo</Link></p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "40px", marginTop: "20px" }}>
          <div className="galeria">
            <img src={producto.imagen} alt={producto.nombre} />
          </div>

          <div>
            <span className="categoria">{categoria ? categoria.nombre : producto.categoria}</span>
            <h1>{producto.nombre}</h1>
            <p>{producto.descripcion}</p>
            <div className="precio-grande">{formatoCLP(producto.precio)}</div>
            <p>Código: {producto.codigo}</p>
            {producto.stock !== undefined && <p>Stock disponible: {producto.stock} unidades</p>}

            <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "20px" }}>
              <input
                type="number"
                min="1"
                max={tope}
                value={cantidad}
                onChange={(e) => {
                  const n = parseInt(e.target.value, 10);
                  if (Number.isNaN(n)) {
                    setCantidad(1);
                    return;
                  }
                  setCantidad(Math.min(Math.max(1, n), tope));
                }}
                style={{ width: "70px", padding: "10px" }}
              />
              <button
                type="button"
                className="btn btn-primario"
                onClick={añadir}
                disabled={sinDisponibles}
              >
                {sinDisponibles ? "Sin stock disponible" : "Agregar al carrito"}
              </button>
            </div>

            {agregado && <p style={{ color: "green" }}>Producto agregado al carrito</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductoDetalle;