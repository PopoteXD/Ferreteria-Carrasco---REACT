import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import RutaAdmin from "../src/components/RutaAdmin";
import { useAuth } from "../src/context/AuthContext";

vi.mock("../src/context/AuthContext", () => ({ useAuth: vi.fn() }));

function renderRuta() {
  return render(
    <MemoryRouter initialEntries={["/admin"]}>
      <Routes>
        <Route
          path="/admin"
          element={
            <RutaAdmin>
              <div>Contenido protegido</div>
            </RutaAdmin>
          }
        />
        <Route path="/login" element={<div>Pagina de login</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("RutaAdmin", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ usuario: null });
  });

  it("redirige al login cuando no hay sesion", () => {
    renderRuta();

    expect(screen.getByText("Pagina de login")).toBeInTheDocument();
    expect(screen.queryByText("Contenido protegido")).not.toBeInTheDocument();
  });

  it("redirige al login cuando el usuario es cliente", () => {
    useAuth.mockReturnValue({ usuario: { tipoUsuario: "Cliente" } });

    renderRuta();

    expect(screen.getByText("Pagina de login")).toBeInTheDocument();
  });

  it("muestra el contenido cuando el usuario es administrador", () => {
    useAuth.mockReturnValue({ usuario: { tipoUsuario: "Administrador" } });

    renderRuta();

    expect(screen.getByText("Contenido protegido")).toBeInTheDocument();
    expect(screen.queryByText("Pagina de login")).not.toBeInTheDocument();
  });
});
