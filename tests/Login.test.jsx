import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Login from "../src/components/Login";
import { useAuth } from "../src/context/AuthContext";

const { navigateMock } = vi.hoisted(() => ({ navigateMock: vi.fn() }));

vi.mock("../src/context/AuthContext", () => ({ useAuth: vi.fn() }));
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => navigateMock };
});

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
}

async function completar(user, correo, clave) {
  await user.type(screen.getByLabelText(/correo electronico/i), correo);
  await user.type(screen.getByLabelText("Contraseña"), clave);
}

describe("Login", () => {
  let iniciarSesion;

  beforeEach(() => {
    navigateMock.mockClear();
    iniciarSesion = vi.fn();
    useAuth.mockReturnValue({ iniciarSesion });
  });

  it("muestra el formulario y las credenciales de prueba", () => {
    renderLogin();

    expect(screen.getByRole("heading", { name: /inicia sesion/i })).toBeInTheDocument();
    expect(screen.getByText("admin@duoc.cl / admin123")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /registrate/i })).toHaveAttribute("href", "/registro");
  });

  it("exige correo y contraseña", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole("button", { name: /ingresar/i }));

    expect(screen.getByText(/completa el correo y la contraseña/i)).toBeInTheDocument();
    expect(iniciarSesion).not.toHaveBeenCalled();
  });

  it("rechaza un correo vacio aunque haya contraseña", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText("Contraseña"), "1234");
    await user.click(screen.getByRole("button", { name: /ingresar/i }));

    expect(screen.getByText(/completa el correo y la contraseña/i)).toBeInTheDocument();
    expect(iniciarSesion).not.toHaveBeenCalled();
  });

  it("muestra el error cuando las credenciales son incorrectas", async () => {
    iniciarSesion.mockReturnValue({ ok: false, mensaje: "Correo o contraseña incorrectos" });
    const user = userEvent.setup();
    renderLogin();

    await completar(user, "nadie@duoc.cl", "mala");
    await user.click(screen.getByRole("button", { name: /ingresar/i }));

    expect(screen.getByText(/correo o contraseña incorrectos/i)).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("redirige al inicio cuando ingresa un cliente", async () => {
    iniciarSesion.mockReturnValue({ ok: true, usuario: { tipoUsuario: "Cliente" } });
    const user = userEvent.setup();
    renderLogin();

    await completar(user, "cliente@duoc.cl", "1234");
    await user.click(screen.getByRole("button", { name: /ingresar/i }));

    expect(iniciarSesion).toHaveBeenCalledWith("cliente@duoc.cl", "1234");
    expect(navigateMock).toHaveBeenCalledWith("/");
  });

  it("redirige al panel cuando ingresa un administrador", async () => {
    iniciarSesion.mockReturnValue({ ok: true, usuario: { tipoUsuario: "Administrador" } });
    const user = userEvent.setup();
    renderLogin();

    await completar(user, "admin@duoc.cl", "admin123");
    await user.click(screen.getByRole("button", { name: /ingresar/i }));

    expect(navigateMock).toHaveBeenCalledWith("/admin");
  });
});
