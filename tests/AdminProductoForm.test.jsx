import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import AdminProductoForm from "../src/components/AdminProductoForm";
import { useProductos } from "../src/context/ProductsContext";

const { navigateMock } = vi.hoisted(() => ({ navigateMock: vi.fn() }));

vi.mock("../src/context/ProductsContext", () => ({ useProductos: vi.fn() }));
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => navigateMock };
});

const PRODUCTOS = [
  {
    codigo: "HM001",
    nombre: "Martillo",
    categoria: "herramientas-manuales",
    precio: 7990,
    stock: 5,
    stockCritico: 2,
    descripcion: "Martillo de acero",
    imagen: "/img/productos/martillo.jpg",
  },
];

function renderForm(route) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/admin/productos/nuevo" element={<AdminProductoForm />} />
        <Route path="/admin/productos/editar/:codigo" element={<AdminProductoForm />} />
        <Route path="/admin/productos" element={<div>Listado admin</div>} />
      </Routes>
    </MemoryRouter>
  );
}

async function llenarNuevo(user) {
  await user.type(screen.getByLabelText("Código"), "hm005");
  await user.type(screen.getByLabelText("Nombre"), "Cinta Metrica");
  await user.selectOptions(screen.getByLabelText("Categoría"), "herramientas-manuales");
  await user.type(screen.getByLabelText("Descripción"), "Cinta de 5 metros");
  await user.type(screen.getByLabelText("Precio (CLP)"), "1500");
  await user.type(screen.getByLabelText("Stock"), "10");
}

describe("AdminProductoForm - nuevo", () => {
  let agregarProducto, editarProducto;

  beforeEach(() => {
    navigateMock.mockClear();
    agregarProducto = vi.fn();
    editarProducto = vi.fn();
    useProductos.mockReturnValue({ productos: PRODUCTOS, agregarProducto, editarProducto });
  });

  it("renderiza el formulario de creacion", () => {
    renderForm("/admin/productos/nuevo");

    expect(screen.getByRole("heading", { name: /nuevo producto/i })).toBeInTheDocument();
  });

  it("valida los campos obligatorios", async () => {
    const user = userEvent.setup();
    renderForm("/admin/productos/nuevo");

    await user.click(screen.getByRole("button", { name: /guardar producto/i }));

    expect(screen.getByText("Mínimo 3 caracteres")).toBeInTheDocument();
    expect(screen.getByText("El nombre es obligatorio")).toBeInTheDocument();
    expect(screen.getByText("Elige una categoría")).toBeInTheDocument();
    expect(screen.getByText("Ingresa un precio válido")).toBeInTheDocument();
    expect(screen.getByText("Solo números enteros")).toBeInTheDocument();
    expect(agregarProducto).not.toHaveBeenCalled();
  });

  it("rechaza precios negativos y stock decimal", async () => {
    const user = userEvent.setup();
    renderForm("/admin/productos/nuevo");

    fireEvent.change(screen.getByLabelText("Precio (CLP)"), { target: { value: "-5" } });
    fireEvent.change(screen.getByLabelText("Stock"), { target: { value: "1.5" } });
    await user.click(screen.getByRole("button", { name: /guardar producto/i }));

    expect(screen.getByText("Ingresa un precio válido")).toBeInTheDocument();
    expect(screen.getByText("Solo números enteros")).toBeInTheDocument();
  });

  it("crea el producto normalizando los datos", async () => {
    agregarProducto.mockReturnValue({ ok: true });
    const user = userEvent.setup();
    renderForm("/admin/productos/nuevo");

    await llenarNuevo(user);
    await user.click(screen.getByRole("button", { name: /guardar producto/i }));

    expect(agregarProducto).toHaveBeenCalledWith({
      codigo: "HM005",
      nombre: "Cinta Metrica",
      categoria: "herramientas-manuales",
      precio: 1500,
      stock: 10,
      stockCritico: null,
      descripcion: "Cinta de 5 metros",
      imagen: "/img/productos/sin-foto.png",
    });
    expect(navigateMock).toHaveBeenCalledWith("/admin/productos");
  });

  it("muestra el error si el codigo ya existe", async () => {
    agregarProducto.mockReturnValue({ ok: false, mensaje: "Ya existe un producto con ese código" });
    const user = userEvent.setup();
    renderForm("/admin/productos/nuevo");

    await llenarNuevo(user);
    await user.click(screen.getByRole("button", { name: /guardar producto/i }));

    expect(screen.getByText(/ya existe un producto con ese código/i)).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();
  });
});

describe("AdminProductoForm - edicion", () => {
  let editarProducto;

  beforeEach(() => {
    navigateMock.mockClear();
    editarProducto = vi.fn();
    useProductos.mockReturnValue({
      productos: PRODUCTOS,
      agregarProducto: vi.fn(),
      editarProducto,
    });
  });

  it("precarga los datos y bloquea el codigo", () => {
    renderForm("/admin/productos/editar/HM001");

    expect(screen.getByRole("heading", { name: /editar producto/i })).toBeInTheDocument();
    const codigo = screen.getByLabelText("Código");
    expect(codigo).toHaveValue("HM001");
    expect(codigo).toBeDisabled();
    expect(screen.getByLabelText("Nombre")).toHaveValue("Martillo");
  });

  it("guarda los cambios y vuelve al listado", async () => {
    const user = userEvent.setup();
    renderForm("/admin/productos/editar/HM001");

    await user.clear(screen.getByLabelText("Nombre"));
    await user.type(screen.getByLabelText("Nombre"), "Martillo Pro");
    await user.click(screen.getByRole("button", { name: /guardar producto/i }));

    expect(editarProducto).toHaveBeenCalledWith(
      "HM001",
      expect.objectContaining({ nombre: "Martillo Pro", codigo: "HM001" })
    );
    expect(navigateMock).toHaveBeenCalledWith("/admin/productos");
  });

  it("avisa cuando el producto a editar no existe", () => {
    renderForm("/admin/productos/editar/ZZZ");

    expect(screen.getByText(/no encontramos ese producto/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /volver al listado/i })).toHaveAttribute(
      "href",
      "/admin/productos"
    );
  });
});
