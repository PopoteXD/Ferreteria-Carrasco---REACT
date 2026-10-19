import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../src/components/Navbar";
import { useCart } from "../src/context/CartContext";
import { useAuth } from "../src/context/AuthContext";

vi.mock("../src/context/CartContext", () => ({ useCart: vi.fn() }));
vi.mock("../src/context/AuthContext", () => ({ useAuth: vi.fn() }));

function renderNavbar() {
  return render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );
}

describe("Navbar", () => {
  beforeEach(() => {
    useCart.mockReturnValue({ totalUnidades: 0 });
    useAuth.mockReturnValue({ usuario: null, cerrarSesion: vi.fn() });
  });

  it("muestra los enlaces principales de navegacion", () => {
    renderNavbar();

    expect(screen.getByRole("link", { name: /inicio/i })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /productos/i })).toHaveAttribute("href", "/productos");
    expect(screen.getByRole("link", { name: /nosotros/i })).toHaveAttribute("href", "/nosotros");
    expect(screen.getByRole("link", { name: /contacto/i })).toHaveAttribute("href", "/contacto");
  });

  it("muestra Ingresar cuando no hay sesion", () => {
    renderNavbar();

    expect(screen.getByRole("link", { name: /ingresar/i })).toHaveAttribute("href", "/login");
    expect(screen.queryByRole("link", { name: /mi perfil/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /salir/i })).not.toBeInTheDocument();
  });

  it("muestra opciones de usuario cuando hay sesion iniciada", () => {
    useAuth.mockReturnValue({
      usuario: { nombre: "Ana", apellidos: "Perez", tipoUsuario: "Cliente" },
      cerrarSesion: vi.fn(),
    });

    renderNavbar();

    expect(screen.getByRole("link", { name: /mi perfil/i })).toHaveAttribute("href", "/perfil");
    expect(screen.getByRole("button", { name: /salir/i })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /ingresar/i })).not.toBeInTheDocument();
  });

  it("muestra el enlace al panel solo para administradores", () => {
    useAuth.mockReturnValue({
      usuario: { nombre: "Luis", apellidos: "Carrasco", tipoUsuario: "Administrador" },
      cerrarSesion: vi.fn(),
    });

    renderNavbar();

    expect(screen.getByRole("link", { name: /panel admin/i })).toHaveAttribute("href", "/admin");
  });

  it("no muestra el panel para clientes", () => {
    useAuth.mockReturnValue({
      usuario: { nombre: "Ana", apellidos: "Perez", tipoUsuario: "Cliente" },
      cerrarSesion: vi.fn(),
    });

    renderNavbar();

    expect(screen.queryByRole("link", { name: /panel admin/i })).not.toBeInTheDocument();
  });

  it("cierra la sesion al hacer clic en Salir", async () => {
    const cerrarSesion = vi.fn();
    useAuth.mockReturnValue({
      usuario: { nombre: "Ana", apellidos: "Perez", tipoUsuario: "Cliente" },
      cerrarSesion,
    });
    const user = userEvent.setup();

    renderNavbar();
    await user.click(screen.getByRole("button", { name: /salir/i }));

    expect(cerrarSesion).toHaveBeenCalledTimes(1);
  });

  it("muestra el contador del carrito cuando hay unidades", () => {
    useCart.mockReturnValue({ totalUnidades: 3 });

    const { container } = renderNavbar();

    expect(screen.getByText("3")).toBeInTheDocument();
    expect(container.querySelector(".badge-carrito")).toBeInTheDocument();
  });

  it("oculta el contador cuando el carrito esta vacio", () => {
    const { container } = renderNavbar();

    expect(container.querySelector(".badge-carrito")).not.toBeInTheDocument();
  });
});
