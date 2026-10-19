import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../src/context/AuthProvider";
import { ProductsProvider } from "../src/context/ProductsProvider";
import { CartProvider } from "../src/context/CartProvider";

/**
 * Renderiza un componente dentro de un MemoryRouter, util cuando el
 * componente usa <Link>, <NavLink> o hooks de navegacion pero no necesita
 * los contextos reales (normalmente estan simulados con vi.mock).
 */
export function renderConRouter(ui, { route = "/" } = {}) {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
}

/**
 * Renderiza un componente con los tres proveedores reales de la app
 * (auth, productos y carrito) dentro de un MemoryRouter.
 */
export function renderConProveedores(ui, { route = "/" } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        <ProductsProvider>
          <CartProvider>{ui}</CartProvider>
        </ProductsProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}
