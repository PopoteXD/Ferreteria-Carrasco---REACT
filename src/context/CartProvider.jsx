import { useEffect, useState } from "react";
import { CartContext } from "./CartContext";

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem("carrito_carrasco");
    return guardado ? JSON.parse(guardado) : [];
  });

  useEffect(() => {
    localStorage.setItem("carrito_carrasco", JSON.stringify(carrito));
  }, [carrito]);

  function agregar(codigo, cantidad = 1) {
    setCarrito((actual) => {
      const existe = actual.find((l) => l.codigo === codigo);
      if (existe) {
        return actual.map((l) =>
          l.codigo === codigo ? { ...l, cantidad: l.cantidad + cantidad } : l
        );
      }
      return [...actual, { codigo, cantidad }];
    });
  }

  function cambiarCantidad(codigo, delta) {
    setCarrito((actual) =>
      actual.map((l) =>
        l.codigo === codigo ? { ...l, cantidad: Math.max(1, l.cantidad + delta) } : l
      )
    );
  }

  function quitar(codigo) {
    setCarrito((actual) => actual.filter((l) => l.codigo !== codigo));
  }

  function vaciar() {
    setCarrito([]);
  }

  const totalUnidades = carrito.reduce((acc, l) => acc + l.cantidad, 0);

  return (
    <CartContext.Provider
      value={{ carrito, agregar, cambiarCantidad, quitar, vaciar, totalUnidades }}
    >
      {children}
    </CartContext.Provider>
  );
}
