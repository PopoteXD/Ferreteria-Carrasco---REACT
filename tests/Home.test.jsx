import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "../src/components/Home";
import { useProductos } from "../src/context/ProductsContext";
import { useCart } from "../src/context/CartContext";
import { CATEGORIAS } from "../src/data/productos";

vi.mock("../src/context/ProductsContext", () => ({ useProductos: vi.fn() }));
vi.mock("../src/context/CartContext", () => ({ useCart: vi.fn() }));

function crearProducto(i) {
  return {
    codigo: `P${i}`,
    nombre: `Producto ${i}`,
    categoria: "herramientas-manuales",
    precio: 1000 + i,
    imagen: `/img/${i}.jpg`,
  };
}

function renderHome(productos) {
  useProductos.mockReturnValue({ productos });
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
}

describe("Home", () => {
  beforeEach(() => {
    useCart.mockReturnValue({ agregar: vi.fn() });
  });

  it("muestra el hero y sus llamados a la accion", () => {
    renderHome([]);

    expect(screen.getByRole("heading", { name: /todo lo que tu proyecto necesita/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /ver catalogo/i })).toHaveAttribute("href", "/productos");
    expect(screen.getByRole("link", { name: /conocenos/i })).toHaveAttribute("href", "/nosotros");
  });

  it("lista todas las categorias con su enlace de filtro", () => {
    renderHome([]);

    CATEGORIAS.forEach((cat) => {
      expect(screen.getByRole("link", { name: cat.nombre })).toHaveAttribute(
        "href",
        `/productos?categoria=${cat.id}`
      );
    });
  });

  it("muestra los productos destacados", () => {
    const productos = [crearProducto(1), crearProducto(2), crearProducto(3)];
    renderHome(productos);

    expect(screen.getByRole("heading", { name: "Producto 1" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Producto 2" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Producto 3" })).toBeInTheDocument();
  });

  it("limita los destacados a los primeros 8 productos", () => {
    const productos = Array.from({ length: 12 }, (_, i) => crearProducto(i + 1));
    renderHome(productos);

    expect(screen.getAllByRole("button", { name: /añadir/i })).toHaveLength(8);
    expect(screen.getByRole("heading", { name: "Producto 8" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Producto 9" })).not.toBeInTheDocument();
  });

  it("no muestra tarjetas cuando no hay productos", () => {
    renderHome([]);

    expect(screen.queryByRole("button", { name: /añadir/i })).not.toBeInTheDocument();
  });
});
