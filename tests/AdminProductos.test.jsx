import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import AdminProductos from "../src/components/AdminProductos";
import { useProductos } from "../src/context/ProductsContext";

vi.mock("../src/context/ProductsContext", () => ({ useProductos: vi.fn() }));

const PRODUCTOS = [
  { codigo: "HM001", nombre: "Martillo", categoria: "herramientas-manuales", precio: 7990, stock: 3, stockCritico: 5 },
  { codigo: "HE001", nombre: "Taladro", categoria: "herramientas-electricas", precio: 44990, stock: 10, stockCritico: 3 },
  { codigo: "XX001", nombre: "Misterio", categoria: "categoria-rara", precio: 100, stock: 1, stockCritico: 0 },
];

let eliminarProducto;

function renderAdmin(productos = PRODUCTOS) {
  useProductos.mockReturnValue({ productos, eliminarProducto });
  return render(
    <MemoryRouter>
      <AdminProductos />
    </MemoryRouter>
  );
}

describe("AdminProductos", () => {
  beforeEach(() => {
    eliminarProducto = vi.fn();
  });

  it("lista los productos con su categoria y precio", () => {
    renderAdmin();

    expect(screen.getByRole("cell", { name: "HM001" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Herramientas Manuales" })).toBeInTheDocument();
    expect(screen.getByText("$7.990")).toBeInTheDocument();
  });

  it("muestra el id cuando la categoria no existe", () => {
    renderAdmin([PRODUCTOS[2]]);

    expect(screen.getByRole("cell", { name: "categoria-rara" })).toBeInTheDocument();
  });

  it("marca los productos con stock critico", () => {
    renderAdmin();

    expect(screen.getAllByText("Stock crítico")).toHaveLength(1);
    expect(screen.getAllByText("Normal")).toHaveLength(2);
  });

  it("muestra el estado vacio cuando no hay productos", () => {
    renderAdmin([]);

    expect(screen.getByText(/aún no hay productos/i)).toBeInTheDocument();
  });

  it("enlaza al formulario de nuevo producto", () => {
    renderAdmin();

    expect(screen.getByRole("link", { name: /nuevo producto/i })).toHaveAttribute(
      "href",
      "/admin/productos/nuevo"
    );
  });

  it("elimina el producto si se confirma", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    const user = userEvent.setup();
    renderAdmin();

    await user.click(screen.getAllByRole("button", { name: /eliminar/i })[0]);

    expect(window.confirm).toHaveBeenCalled();
    expect(eliminarProducto).toHaveBeenCalledWith("HM001");
  });

  it("no elimina el producto si se cancela", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    const user = userEvent.setup();
    renderAdmin();

    await user.click(screen.getAllByRole("button", { name: /eliminar/i })[0]);

    expect(eliminarProducto).not.toHaveBeenCalled();
  });
});
