import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ProductCard from "../src/components/ProductCard";
import { useCart } from "../src/context/CartContext";

vi.mock("../src/context/CartContext", () => ({ useCart: vi.fn() }));

const producto = {
  codigo: "HM001",
  nombre: "Martillo de Uña 16 oz",
  categoria: "herramientas-manuales",
  precio: 7990,
  imagen: "/img/productos/martillo.jpg",
};

function renderCard(props = producto) {
  return render(
    <MemoryRouter>
      <ProductCard producto={props} />
    </MemoryRouter>
  );
}

describe("ProductCard", () => {
  let agregar;

  beforeEach(() => {
    agregar = vi.fn();
    useCart.mockReturnValue({ agregar });
  });

  it("muestra el nombre, codigo y precio formateado", () => {
    renderCard();

    expect(screen.getByRole("heading", { name: producto.nombre })).toBeInTheDocument();
    expect(screen.getByText(`Codigo: ${producto.codigo}`)).toBeInTheDocument();
    expect(screen.getByText("$7.990")).toBeInTheDocument();
  });

  it("enlaza al detalle del producto", () => {
    renderCard();

    expect(screen.getByRole("link", { name: /ver detalle/i })).toHaveAttribute(
      "href",
      "/producto/HM001"
    );
  });

  it("agrega el producto al carrito al pulsar Añadir", async () => {
    const user = userEvent.setup();
    renderCard();

    await user.click(screen.getByRole("button", { name: /añadir/i }));

    expect(agregar).toHaveBeenCalledWith("HM001");
  });

  it("deshabilita la compra y muestra Sin stock cuando no hay unidades", () => {
    renderCard({ ...producto, stock: 0 });

    const boton = screen.getByRole("button", { name: /sin stock/i });
    expect(boton).toBeDisabled();
  });

  it("deshabilita la compra cuando el carrito ya tiene todo el stock", () => {
    useCart.mockReturnValue({ agregar, carrito: [{ codigo: "HM001", cantidad: 2 }] });
    renderCard({ ...producto, stock: 2 });

    const boton = screen.getByRole("button", { name: /max. en carrito/i });
    expect(boton).toBeDisabled();
  });

  it("muestra el stock disponible cuando el producto lo informa", () => {
    renderCard({ ...producto, stock: 7 });

    expect(screen.getByText(/stock disponible: 7/i)).toBeInTheDocument();
  });
});
