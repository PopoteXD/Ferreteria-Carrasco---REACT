import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import LayoutAdmin from "../src/components/LayoutAdmin";
import { useAuth } from "../src/context/AuthContext";

vi.mock("../src/context/AuthContext", () => ({ useAuth: vi.fn() }));

function renderLayout() {
  return render(
    <MemoryRouter initialEntries={["/admin"]}>
      <Routes>
        <Route path="/admin" element={<LayoutAdmin />}>
          <Route index element={<div>Contenido del panel</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe("LayoutAdmin", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      usuario: { nombre: "Luis", apellidos: "Carrasco", tipoUsuario: "Administrador" },
    });
  });

  it("saluda al administrador", () => {
    renderLayout();

    expect(screen.getByText("Luis Carrasco")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /panel administrador/i })).toBeInTheDocument();
  });

  it("muestra los enlaces de navegacion del panel", () => {
    renderLayout();

    expect(screen.getByRole("link", { name: /resumen/i })).toHaveAttribute("href", "/admin");
    expect(screen.getByRole("link", { name: /productos/i })).toHaveAttribute("href", "/admin/productos");
    expect(screen.getByRole("link", { name: /ver tienda/i })).toHaveAttribute("href", "/");
  });

  it("renderiza el contenido anidado mediante Outlet", () => {
    renderLayout();

    expect(screen.getByText("Contenido del panel")).toBeInTheDocument();
  });
});
