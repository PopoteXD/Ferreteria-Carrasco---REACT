import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Perfil from "../src/components/Perfil";
import { useAuth } from "../src/context/AuthContext";

vi.mock("../src/context/AuthContext", () => ({ useAuth: vi.fn() }));

const USUARIO = {
  run: "111111111",
  nombre: "Ana",
  apellidos: "Perez",
  correo: "ana@duoc.cl",
  region: "Region de Valparaiso",
  comuna: "Villa Alemana",
  direccion: "Calle 123",
  tipoUsuario: "Cliente",
};

function renderPerfil() {
  return render(
    <MemoryRouter initialEntries={["/perfil"]}>
      <Routes>
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/login" element={<div>Pagina de login</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("Perfil", () => {
  let actualizarPerfil;

  beforeEach(() => {
    actualizarPerfil = vi.fn();
    useAuth.mockReturnValue({ usuario: USUARIO, actualizarPerfil });
  });

  it("redirige al login cuando no hay sesion", () => {
    useAuth.mockReturnValue({ usuario: null, actualizarPerfil });

    renderPerfil();

    expect(screen.getByText("Pagina de login")).toBeInTheDocument();
  });

  it("precarga los datos del usuario", () => {
    renderPerfil();

    expect(screen.getByText(USUARIO.run)).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre")).toHaveValue("Ana");
    expect(screen.getByLabelText("Apellidos")).toHaveValue("Perez");
    expect(screen.getByLabelText(/correo electronico/i)).toHaveValue("ana@duoc.cl");
    expect(screen.getByLabelText(/dirección/i)).toHaveValue("Calle 123");
  });

  it("valida los campos obligatorios", async () => {
    const user = userEvent.setup();
    renderPerfil();

    await user.clear(screen.getByLabelText("Nombre"));
    await user.click(screen.getByRole("button", { name: /guardar cambios/i }));

    expect(screen.getByText(/el nombre es obligatorio/i)).toBeInTheDocument();
    expect(actualizarPerfil).not.toHaveBeenCalled();
  });

  it("guarda los cambios sin incluir clave si esta vacia", async () => {
    actualizarPerfil.mockReturnValue({ ok: true });
    const user = userEvent.setup();
    renderPerfil();

    await user.clear(screen.getByLabelText("Nombre"));
    await user.type(screen.getByLabelText("Nombre"), "Ana Maria");
    await user.click(screen.getByRole("button", { name: /guardar cambios/i }));

    expect(actualizarPerfil).toHaveBeenCalledWith({
      nombre: "Ana Maria",
      apellidos: "Perez",
      correo: "ana@duoc.cl",
      region: "Region de Valparaiso",
      comuna: "Villa Alemana",
      direccion: "Calle 123",
    });
    expect(screen.getByText(/tus datos se guardaron correctamente/i)).toBeInTheDocument();
  });

  it("incluye la clave cuando se escribe una nueva", async () => {
    actualizarPerfil.mockReturnValue({ ok: true });
    const user = userEvent.setup();
    renderPerfil();

    await user.type(screen.getByLabelText(/nueva contraseña/i), "abcd");
    await user.click(screen.getByRole("button", { name: /guardar cambios/i }));

    expect(actualizarPerfil).toHaveBeenCalledWith(
      expect.objectContaining({ clave: "abcd" })
    );
  });

  it("muestra el error devuelto por actualizarPerfil", async () => {
    actualizarPerfil.mockReturnValue({ ok: false, mensaje: "Ese correo ya lo usa otra cuenta" });
    const user = userEvent.setup();
    renderPerfil();

    await user.click(screen.getByRole("button", { name: /guardar cambios/i }));

    expect(screen.getByText(/ese correo ya lo usa otra cuenta/i)).toBeInTheDocument();
  });
});
