import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProductoDetalle from "../src/components/ProductoDetalle";
import { useProductos } from "../src/context/ProductsContext";
import { useCart } from "../src/context/CartContext";

vi.mock("../src/context/ProductsContext", () => ({ useProductos: vi.fn() }));
vi.mock("../src/context/CartContext", () => ({ useCart: vi.fn() }));

const PRODUCTO = {
  codigo: "HM001",
  nombre: "Martillo de Uña 16 oz",
  categoria: "herramientas-manuales",
  precio: 7990,
  stock: 5,
  descripcion: "Martillo con mango de fibra de vidrio.",
  imagen: "/img/productos/martillo.jpg",
};

function renderDetalle(codigo = "HM001", productos = [PRODUCTO]) {
  useProductos.mockReturnValue({ productos });
  return render(
    <MemoryRouter initialEntries={[`/producto/${codigo}`]}>
      <Routes>
        <Route path="/producto/:codigo" element={<ProductoDetalle />} />
        <Route path="/productos" element={<div>Catalogo</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("ProductoDetalle", () => {
  let agregar;

  beforeEach(() => {
    agregar = vi.fn();
    useCart.mockReturnValue({ agregar });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("muestra los datos del producto encontrado", () => {
    renderDetalle();

    expect(screen.getByRole("heading", { name: PRODUCTO.nombre })).toBeInTheDocument();
    expect(screen.getByText(PRODUCTO.descripcion)).toBeInTheDocument();
    expect(screen.getByText("$7.990")).toBeInTheDocument();
    expect(screen.getByText(`Código: ${PRODUCTO.codigo}`)).toBeInTheDocument();
    expect(screen.getByText(/stock disponible: 5 unidades/i)).toBeInTheDocument();
    expect(screen.getByText(/herramientas manuales/i)).toBeInTheDocument();
  });

  it("muestra un mensaje cuando el producto no existe", () => {
    renderDetalle("NOEXISTE");

    expect(screen.getByText(/no encontramos ese producto/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /volver al catálogo/i })).toHaveAttribute("href", "/productos");
  });

  it("agrega al carrito con la cantidad indicada", () => {
    renderDetalle();

    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: "3" } });
    fireEvent.click(screen.getByRole("button", { name: /agregar al carrito/i }));

    expect(agregar).toHaveBeenCalledWith("HM001", 3);
  });

  it("usa cantidad 1 por defecto", () => {
    renderDetalle();

    fireEvent.click(screen.getByRole("button", { name: /agregar al carrito/i }));

    expect(agregar).toHaveBeenCalledWith("HM001", 1);
  });

  it("no permite cantidades menores a 1", () => {
    renderDetalle();

    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: "0" } });

    expect(input).toHaveValue(1);
  });

  it("muestra la confirmacion y luego la oculta", () => {
    vi.useFakeTimers();
    renderDetalle();

    fireEvent.click(screen.getByRole("button", { name: /agregar al carrito/i }));
    expect(screen.getByText(/producto agregado al carrito/i)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(screen.queryByText(/producto agregado al carrito/i)).not.toBeInTheDocument();
  });

  it("deshabilita la compra cuando el producto no tiene stock", () => {
    renderDetalle("HM001", [{ ...PRODUCTO, stock: 0 }]);

    expect(screen.getByRole("button", { name: /sin stock disponible/i })).toBeDisabled();
  });

  it("deshabilita la compra si el carrito ya tiene todo el stock", () => {
    useCart.mockReturnValue({ agregar, carrito: [{ codigo: "HM001", cantidad: 5 }] });
    renderDetalle();

    expect(screen.getByRole("button", { name: /sin stock disponible/i })).toBeDisabled();
  });

  it("no permite pedir mas unidades que el stock disponible", () => {
    renderDetalle("HM001", [{ ...PRODUCTO, stock: 2 }]);

    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: "10" } });

    expect(input).toHaveValue(2);
  });

  it("no agrega nada si no hay stock disponible", () => {
    renderDetalle("HM001", [{ ...PRODUCTO, stock: 0 }]);

    fireEvent.click(screen.getByRole("button", { name: /sin stock disponible/i }));

    expect(agregar).not.toHaveBeenCalled();
  });
});
