import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Registro from "../src/components/Registro";
import { useAuth } from "../src/context/AuthContext";

const { navigateMock } = vi.hoisted(() => ({ navigateMock: vi.fn() }));

vi.mock("../src/context/AuthContext", () => ({ useAuth: vi.fn() }));
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => navigateMock };
});

function renderRegistro() {
  return render(
    <MemoryRouter>
      <Registro />
    </MemoryRouter>
  );
}

async function llenarFormularioValido(user) {
  await user.type(screen.getByLabelText(/run/i), "111111111");
  await user.type(screen.getByLabelText("Nombre"), "Ana");
  await user.type(screen.getByLabelText("Apellidos"), "Perez");
  await user.type(screen.getByLabelText(/correo electronico/i), "ana@duoc.cl");
  await user.type(screen.getByLabelText("Contraseña"), "1234");
  await user.type(screen.getByLabelText("Confirmar contraseña"), "1234");
  await user.selectOptions(screen.getByLabelText(/región/i), "Region de Valparaiso");
  await user.selectOptions(screen.getByLabelText(/comuna/i), "Villa Alemana");
  await user.type(screen.getByLabelText(/dirección/i), "Calle 123");
}

describe("Registro", () => {
  let registrar;

  beforeEach(() => {
    navigateMock.mockClear();
    registrar = vi.fn();
    useAuth.mockReturnValue({ registrar });
  });

  it("muestra los campos del formulario", () => {
    renderRegistro();

    expect(screen.getByRole("heading", { name: /crea tu cuenta/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/run/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Confirmar contraseña")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /inicia sesion/i })).toHaveAttribute("href", "/login");
  });

  it("valida todos los campos obligatorios al enviar vacio", async () => {
    const user = userEvent.setup();
    renderRegistro();

    await user.click(screen.getByRole("button", { name: /crear cuenta/i }));

    expect(screen.getByText(/run no valido/i)).toBeInTheDocument();
    expect(screen.getByText(/el nombre es obligatorio/i)).toBeInTheDocument();
    expect(screen.getByText(/los apellidos son obligatorios/i)).toBeInTheDocument();
    expect(screen.getByText(/usa un correo/i)).toBeInTheDocument();
    expect(screen.getByText(/entre 4 y 10 caracteres/i)).toBeInTheDocument();
    expect(screen.getByText(/elige una región/i)).toBeInTheDocument();
    expect(screen.getByText(/elige una comuna/i)).toBeInTheDocument();
    expect(screen.getByText(/la dirección es obligatoria/i)).toBeInTheDocument();
    expect(registrar).not.toHaveBeenCalled();
  });

  it("rechaza un RUN invalido", async () => {
    const user = userEvent.setup();
    renderRegistro();

    await user.type(screen.getByLabelText(/run/i), "12");
    await user.click(screen.getByRole("button", { name: /crear cuenta/i }));

    expect(screen.getByText(/run no valido/i)).toBeInTheDocument();
  });

  it("rechaza un correo no permitido", async () => {
    const user = userEvent.setup();
    renderRegistro();

    await user.type(screen.getByLabelText(/correo electronico/i), "ana@hotmail.com");
    await user.click(screen.getByRole("button", { name: /crear cuenta/i }));

    expect(screen.getByText(/usa un correo/i)).toBeInTheDocument();
  });

  it("rechaza una contraseña demasiado larga", async () => {
    const user = userEvent.setup();
    renderRegistro();

    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "12345678901" } });
    await user.click(screen.getByRole("button", { name: /crear cuenta/i }));

    expect(screen.getByText(/entre 4 y 10 caracteres/i)).toBeInTheDocument();
  });

  it("rechaza contraseñas que no coinciden", async () => {
    const user = userEvent.setup();
    renderRegistro();

    await user.type(screen.getByLabelText("Contraseña"), "1234");
    await user.type(screen.getByLabelText("Confirmar contraseña"), "9999");
    await user.click(screen.getByRole("button", { name: /crear cuenta/i }));

    expect(screen.getByText(/las contraseñas no coinciden/i)).toBeInTheDocument();
  });

  it("limpia la comuna al cambiar de region", async () => {
    const user = userEvent.setup();
    renderRegistro();

    await user.selectOptions(screen.getByLabelText(/región/i), "Region de Valparaiso");
    await user.selectOptions(screen.getByLabelText(/comuna/i), "Villa Alemana");
    await user.selectOptions(screen.getByLabelText(/región/i), "Region del Maule");

    expect(screen.getByLabelText(/comuna/i)).toHaveValue("");
  });

  it("registra y redirige al inicio con datos validos", async () => {
    registrar.mockReturnValue({ ok: true });
    const user = userEvent.setup();
    renderRegistro();

    await llenarFormularioValido(user);
    await user.click(screen.getByRole("button", { name: /crear cuenta/i }));

    expect(registrar).toHaveBeenCalledWith({
      run: "111111111",
      nombre: "Ana",
      apellidos: "Perez",
      correo: "ana@duoc.cl",
      clave: "1234",
      region: "Region de Valparaiso",
      comuna: "Villa Alemana",
      direccion: "Calle 123",
    });
    expect(navigateMock).toHaveBeenCalledWith("/");
  });

  it("muestra el error general cuando el registro falla", async () => {
    registrar.mockReturnValue({ ok: false, mensaje: "Ya existe una cuenta con ese correo" });
    const user = userEvent.setup();
    renderRegistro();

    await llenarFormularioValido(user);
    await user.click(screen.getByRole("button", { name: /crear cuenta/i }));

    expect(screen.getByText(/ya existe una cuenta con ese correo/i)).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
