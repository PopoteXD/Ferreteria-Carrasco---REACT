import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminDashboard from "../src/components/AdminDashboard";
import { useProductos } from "../src/context/ProductsContext";

vi.mock("../src/context/ProductsContext", () => ({ useProductos: vi.fn() }));

const PRODUCTOS = [
  { codigo: "HM001", nombre: "Martillo", precio: 7990, stock: 3, stockCritico: 5 },
  { codigo: "HE001", nombre: "Taladro", precio: 44990, stock: 10, stockCritico: 3 },
  { codigo: "MC001", nombre: "Cemento", precio: 6890, stock: 0, stockCritico: 0 },
];

function renderDashboard(productos = PRODUCTOS) {
  useProductos.mockReturnValue({ productos });
  return render(
    <MemoryRouter>
      <AdminDashboard />
    </MemoryRouter>
  );
}

function metricas() {
  return Array.from(document.querySelectorAll(".tarjeta-metrica strong")).map(
    (n) => n.textContent
  );
}

describe("AdminDashboard", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("muestra las metricas de productos, usuarios y stock critico", () => {
    localStorage.setItem("usuarios_carrasco", JSON.stringify([{ run: "1" }, { run: "2" }]));

    renderDashboard();

    expect(metricas()).toEqual(["3", "2", "2"]);
  });

  it("lista los productos con stock critico", () => {
    renderDashboard();

    // Cabecera + Martillo (3 <= 5) + Cemento (0 <= 0)
    expect(screen.getByRole("cell", { name: "HM001" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "MC001" })).toBeInTheDocument();
    expect(screen.queryByRole("cell", { name: "HE001" })).not.toBeInTheDocument();
  });

  it("muestra un aviso cuando no hay productos criticos", () => {
    renderDashboard([PRODUCTOS[1]]);

    expect(screen.getByText(/ningún producto bajo el umbral crítico/i)).toBeInTheDocument();
  });

  it("enlaza al listado de productos", () => {
    renderDashboard();

    expect(screen.getByRole("link", { name: /ir a productos/i })).toHaveAttribute(
      "href",
      "/admin/productos"
    );
  });
});
