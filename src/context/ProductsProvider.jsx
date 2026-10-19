import { useEffect, useState } from "react";
import { PRODUCTOS_SEMILLA } from "../data/productos";
import { ProductsContext } from "./ProductsContext";

const CLAVE = "productos_carrasco";

/**
 * Combina lo guardado en localStorage con la semilla actual.
 * Los datos del usuario tienen prioridad, pero si a un producto guardado
 * le faltan campos nuevos (stock, stockCritico, descripcion, imagen) se
 * completan con los de la semilla. Asi, datos antiguos no dejan el stock
 * vacio ni rompen la tienda.
 */
function normalizarProductos(guardado) {
  let lista;
  try {
    lista = JSON.parse(guardado);
  } catch {
    return PRODUCTOS_SEMILLA;
  }
  if (!Array.isArray(lista) || lista.length === 0) return PRODUCTOS_SEMILLA;

  return lista.map((p) => {
    const semilla = PRODUCTOS_SEMILLA.find((s) => s.codigo === p?.codigo);
    return semilla ? { ...semilla, ...p } : p;
  });
}

export function ProductsProvider({ children }) {
  const [productos, setProductos] = useState(() => {
    const guardado = localStorage.getItem(CLAVE);
    return guardado ? normalizarProductos(guardado) : PRODUCTOS_SEMILLA;
  });

  useEffect(() => {
    localStorage.setItem(CLAVE, JSON.stringify(productos));
  }, [productos]);

  function agregarProducto(producto) {
    if (productos.some((p) => p.codigo === producto.codigo)) {
      return { ok: false, mensaje: "Ya existe un producto con ese código" };
    }
    setProductos([...productos, producto]);
    return { ok: true };
  }

  function editarProducto(codigo, datos) {
    setProductos(productos.map((p) => (p.codigo === codigo ? { ...p, ...datos } : p)));
  }

  function eliminarProducto(codigo) {
    setProductos(productos.filter((p) => p.codigo !== codigo));
  }

  // descuenta stock de una compra, sin bajar nunca de 0
  function descontarStock(codigo, cantidad) {
    setProductos((actual) =>
      actual.map((p) =>
        p.codigo === codigo
          ? { ...p, stock: Math.max(0, (p.stock ?? 0) - cantidad) }
          : p
      )
    );
  }

  return (
    <ProductsContext.Provider
      value={{ productos, agregarProducto, editarProducto, eliminarProducto, descontarStock }}
    >
      {children}
    </ProductsContext.Provider>
  );
}
