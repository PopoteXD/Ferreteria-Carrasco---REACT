import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Carrito from "../src/components/Carrito";
import { useCart } from "../src/context/CartContext";
import { useProductos } from "../src/context/ProductsContext";

vi.mock("../src/context/CartContext", () => ({ useCart: vi.fn() }));
vi.mock("../src/context/ProductsContext", () => ({ useProductos: vi.fn() }));

const PRODUCTOS = [
  { codigo: "HM001", nombre: "Martillo", categoria: "herramientas-manuales", precio: 7990, imagen: "/m.jpg" },
  { codigo: "HE001", nombre: "Taladro", categoria: "herramientas-electricas", precio: 44990, imagen: "/t.jpg" },
];

function renderCarrito() {
  return render(
    <MemoryRouter>
      <Carrito />
    </MemoryRouter>
  );
}

describe("Carrito", () => {
  let acciones;
  let descontarStock;

  beforeEach(() => {
    descontarStock = vi.fn();
    acciones = {
      carrito: [{ codigo: "HM001", cantidad: 2 }, { codigo: "HE001", cantidad: 1 }],
      cambiarCantidad: vi.fn(),
      quitar: vi.fn(),
      vaciar: vi.fn(),
    };
    useCart.mockReturnValue(acciones);
    useProductos.mockReturnValue({ productos: PRODUCTOS, descontarStock });
  });

  it("muestra el mensaje cuando el carrito esta vacio", () => {
    acciones.carrito = [];
    renderCarrito([]);

    expect(screen.getByText(/tu carrito esta vacio/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /catalogo/i })).toHaveAttribute("href", "/productos");
  });

  it("lista las lineas con sus totales", () => {
    renderCarrito();

    expect(screen.getByText("Martillo")).toBeInTheDocument();
    expect(screen.getByText("Taladro")).toBeInTheDocument();
    // subtotal 7990*2 + 44990 = 60970, envio 4990, total 65960
    expect(screen.getByText("$60.970")).toBeInTheDocument();
    expect(screen.getByText("$4.990")).toBeInTheDocument();
    expect(screen.getByText("$65.960")).toBeInTheDocument();
  });

  it("ignora lineas cuyo producto ya no existe", () => {
    acciones.carrito = [{ codigo: "HM001", cantidad: 1 }, { codigo: "ZZZ", cantidad: 5 }];
    renderCarrito(acciones.carrito);

    expect(screen.getByText("Martillo")).toBeInTheDocument();
    expect(screen.queryByText("ZZZ")).not.toBeInTheDocument();
    expect(screen.getAllByText("$7.990")).toHaveLength(3); // precio + total linea + subtotal
  });

  it("aumenta y disminuye la cantidad de una linea", async () => {
    const user = userEvent.setup();
    renderCarrito();

    const filas = screen.getAllByRole("row");
    const filaMartillo = filas.find((f) => within(f).queryByText("Martillo"));
    await user.click(within(filaMartillo).getByRole("button", { name: "+" }));
    await user.click(within(filaMartillo).getByRole("button", { name: "-" }));

    expect(acciones.cambiarCantidad).toHaveBeenNthCalledWith(1, "HM001", 1);
    expect(acciones.cambiarCantidad).toHaveBeenNthCalledWith(2, "HM001", -1);
  });

  it("quita una linea del carrito", async () => {
    const user = userEvent.setup();
    renderCarrito();

    await user.click(screen.getAllByRole("button", { name: /quitar/i })[0]);

    expect(acciones.quitar).toHaveBeenCalledWith("HM001");
  });

  it("vacia el carrito con el boton correspondiente", async () => {
    const user = userEvent.setup();
    renderCarrito();

    await user.click(screen.getByRole("button", { name: /vaciar carrito/i }));

    expect(acciones.vaciar).toHaveBeenCalledTimes(1);
  });

  it("finaliza la compra, descuenta stock y muestra el aviso de exito", async () => {
    const user = userEvent.setup();
    renderCarrito();

    await user.click(screen.getByRole("button", { name: /finalizar compra/i }));

    expect(descontarStock).toHaveBeenCalledWith("HM001", 2);
    expect(descontarStock).toHaveBeenCalledWith("HE001", 1);
    expect(descontarStock).toHaveBeenCalledTimes(2);
    expect(acciones.vaciar).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/compra registrada con exito/i)).toBeInTheDocument();
  });

  it("no descuenta stock de lineas cuyo producto no existe", async () => {
    acciones.carrito = [{ codigo: "HM001", cantidad: 1 }, { codigo: "ZZZ", cantidad: 5 }];
    const user = userEvent.setup();
    renderCarrito();

    await user.click(screen.getByRole("button", { name: /finalizar compra/i }));

    expect(descontarStock).toHaveBeenCalledTimes(1);
    expect(descontarStock).toHaveBeenCalledWith("HM001", 1);
  });

  it("muestra el stock y deshabilita + al alcanzarlo", () => {
    useProductos.mockReturnValue({
      productos: [
        { codigo: "HM001", nombre: "Martillo", precio: 7990, imagen: "/m.jpg", stock: 2 },
        { codigo: "HE001", nombre: "Taladro", precio: 44990, imagen: "/t.jpg", stock: 10 },
      ],
      descontarStock,
    });
    renderCarrito();

    expect(screen.getByText(/stock disponible: 2/i)).toBeInTheDocument();

    const filaMartillo = screen
      .getAllByRole("row")
      .find((f) => within(f).queryByText("Martillo"));

    // HM001 tiene cantidad 2 y stock 2, por lo que no se puede aumentar mas
    expect(within(filaMartillo).getByRole("button", { name: "+" })).toBeDisabled();
  });

  it("bloquea la compra si una linea supera el stock disponible", async () => {
    const user = userEvent.setup();
    useProductos.mockReturnValue({
      productos: [
        { codigo: "HM001", nombre: "Martillo", precio: 7990, imagen: "/m.jpg", stock: 1 },
      ],
      descontarStock,
    });
    acciones.carrito = [{ codigo: "HM001", cantidad: 3 }];
    renderCarrito();

    await user.click(screen.getByRole("button", { name: /finalizar compra/i }));

    expect(descontarStock).not.toHaveBeenCalled();
    expect(acciones.vaciar).not.toHaveBeenCalled();
    expect(screen.getByText(/no hay stock suficiente/i)).toBeInTheDocument();
  });
});
