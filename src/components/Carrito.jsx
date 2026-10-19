import { useState } from "react";
import { Link } from "react-router-dom";
import { formatoCLP } from "../data/productos";
import { useCart } from "../context/CartContext";
import { useProductos } from "../context/ProductsContext";
import { tieneControlDeStock } from "../utils/stock";

function Carrito() {
  const { carrito, cambiarCantidad, quitar, vaciar } = useCart();
  const [compraOk, setCompraOk] = useState(false);
  const [errorStock, setErrorStock] = useState(null);
  const { productos, descontarStock } = useProductos();

  const lineas = carrito
    .map((l) => ({ ...l, producto: productos.find((p) => p.codigo === l.codigo) }))
    .filter((l) => l.producto);

  const subtotal = lineas.reduce((acc, l) => acc + l.producto.precio * l.cantidad, 0);
  const envio = subtotal > 0 ? 4990 : 0;

  // Lineas cuya cantidad supera el stock disponible (por ejemplo, datos
  // guardados antes de que existiera el control de stock).
  const excedidas = lineas.filter(
    (l) => tieneControlDeStock(l.producto) && l.cantidad > l.producto.stock
  );

  function finalizarCompra() {
    if (excedidas.length > 0) {
      setCompraOk(false);
      setErrorStock(
        "No hay stock suficiente para: " + excedidas.map((l) => l.producto.nombre).join(", ")
      );
      return;
    }
    // descuenta del stock la cantidad comprada de cada producto
    lineas.forEach((l) => descontarStock(l.codigo, l.cantidad));
    vaciar();
    setErrorStock(null);
    setCompraOk(true);
  }

  return (
    <section className="seccion">
      <div className="contenedor">
        <div className="titulo-seccion">
          <h2>Tu carrito de compras</h2>
        </div>

        {compraOk && (
          <div className="aviso exito">
            Compra registrada con exito (simulacion)
          </div>
        )}

        {errorStock && <div className="aviso error">{errorStock}</div>}

        {lineas.length === 0 ? (
          <div className="carrito-vacio">
            <h3>Tu carrito esta vacio</h3>
            <p>Agrega productos desde el <Link to="/productos">catalogo</Link>.</p>
          </div>
        ) : (
          <>
            <table className="tabla-carrito">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {lineas.map((l) => (
                  <tr key={l.codigo}>
                    <td>
                      <div className="fila-producto-carrito">
                        <img src={l.producto.imagen} alt={l.producto.nombre} />
                        <div>
                          <div>{l.producto.nombre}</div>
                          <div className="codigo">Codigo: {l.codigo}</div>
                        </div>
                      </div>
                    </td>
                    <td>{formatoCLP(l.producto.precio)}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => cambiarCantidad(l.codigo, -1)}
                        disabled={l.cantidad <= 1}
                      >
                        -
                      </button>
                      <span style={{ margin: "0 10px" }}>{l.cantidad}</span>
                      <button
                        type="button"
                        onClick={() => cambiarCantidad(l.codigo, 1)}
                        disabled={tieneControlDeStock(l.producto) && l.cantidad >= l.producto.stock}
                      >
                        +
                      </button>
                      {tieneControlDeStock(l.producto) && (
                        <div className="codigo">Stock disponible: {l.producto.stock}</div>
                      )}
                      {tieneControlDeStock(l.producto) && l.cantidad > l.producto.stock && (
                        <div className="codigo" style={{ color: "#b00020" }}>
                          Supera el stock disponible
                        </div>
                      )}
                    </td>
                    <td>{formatoCLP(l.producto.precio * l.cantidad)}</td>
                    <td>
                      <button type="button" className="btn-quitar" onClick={() => quitar(l.codigo)}>
                        Quitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              type="button"
              className="btn btn-secundario btn-sm"
              style={{ marginTop: "15px" }}
              onClick={vaciar}
            >
              Vaciar carrito
            </button>

            <div className="resumen-carrito">
              <div className="linea"><span>Subtotal</span><span>{formatoCLP(subtotal)}</span></div>
              <div className="linea"><span>Envio</span><span>{formatoCLP(envio)}</span></div>
              <div className="linea total"><span>Total</span><span>{formatoCLP(subtotal + envio)}</span></div>
              <button
                type="button"
                className="btn btn-primario"
                style={{ width: "100%", marginTop: "15px" }}
                onClick={finalizarCompra}
              >
                Finalizar compra
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default Carrito;