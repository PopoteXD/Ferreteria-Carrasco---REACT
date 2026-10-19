import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Productos from "../src/components/Productos";
import { useProductos } from "../src/context/ProductsContext";
import { useCart } from "../src/context/CartContext";

vi.mock("../src/context/ProductsContext", () => ({ useProductos: vi.fn() }));
vi.mock("../src/context/CartContext", () => ({ useCart: vi.fn() }));

const PRODUCTOS = [
  { codigo: "HM001", nombre: "Martillo", categoria: "herramientas-manuales", precio: 7990, imagen: "" },
  { codigo: "HE001", nombre: "Taladro", categoria: "herramientas-electricas", precio: 44990, imagen: "" },
  { codigo: "MC001", nombre: "Cemento", categoria: "materiales-construccion", precio: 6890, imagen: "" },
  { codigo: "PL001", nombre: "Llave de Paso", categoria: "plomeria", precio: 2990, imagen: "" },
];

function renderProductos(route = "/productos", productos = PRODUCTOS) {
  useProductos.mockReturnValue({ productos });
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Productos />
    </MemoryRouter>
  );
}

function nombresMostrados() {
  return screen
    .getAllByRole("heading", { level: 3 })
    .map((h) => h.textContent);
}

describe("Productos", () => {
  beforeEach(() => {
    useCart.mockReturnValue({ agregar: vi.fn() });
  });

  it("muestra todos los productos y su conteo", () => {
    renderProductos();

    expect(screen.getByText("4 producto(s) encontrados")).toBeInTheDocument();
    expect(nombresMostrados()).toEqual(["Martillo", "Taladro", "Cemento", "Llave de Paso"]);
  });

  it("filtra por categoria desde el selector", async () => {
    const user = userEvent.setup();
    renderProductos();

    await user.selectOptions(screen.getAllByRole("combobox")[0], "herramientas-electricas");

    expect(screen.getByText("1 producto(s) encontrados")).toBeInTheDocument();
    expect(nombresMostrados()).toEqual(["Taladro"]);
  });

  it("aplica la categoria inicial recibida por la URL", () => {
    renderProductos("/productos?categoria=plomeria");

    expect(nombresMostrados()).toEqual(["Llave de Paso"]);
    expect(screen.getByText("1 producto(s) encontrados")).toBeInTheDocument();
  });

  it("busca por nombre sin distinguir mayusculas", async () => {
    const user = userEvent.setup();
    renderProductos();

    await user.type(screen.getByPlaceholderText(/nombre o codigo/i), "marti");

    expect(nombresMostrados()).toEqual(["Martillo"]);
  });

  it("busca tambien por codigo", async () => {
    const user = userEvent.setup();
    renderProductos();

    await user.type(screen.getByPlaceholderText(/nombre o codigo/i), "he0");

    expect(nombresMostrados()).toEqual(["Taladro"]);
  });

  it("ordena por precio de menor a mayor", async () => {
    const user = userEvent.setup();
    renderProductos();

    await user.selectOptions(screen.getAllByRole("combobox")[1], "precio-asc");

    expect(nombresMostrados()).toEqual(["Llave de Paso", "Cemento", "Martillo", "Taladro"]);
  });

  it("ordena por precio de mayor a menor", async () => {
    const user = userEvent.setup();
    renderProductos();

    await user.selectOptions(screen.getAllByRole("combobox")[1], "precio-desc");

    expect(nombresMostrados()).toEqual(["Taladro", "Martillo", "Cemento", "Llave de Paso"]);
  });

  it("muestra 0 resultados cuando la busqueda no coincide", async () => {
    const user = userEvent.setup();
    renderProductos();

    await user.type(screen.getByPlaceholderText(/nombre o codigo/i), "zzzz");

    expect(screen.getByText("0 producto(s) encontrados")).toBeInTheDocument();
    expect(screen.queryAllByRole("heading", { level: 3 })).toHaveLength(0);
  });
});
