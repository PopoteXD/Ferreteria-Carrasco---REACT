import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Contacto from "../src/components/Contacto";

function renderContacto() {
  return render(<Contacto />);
}

describe("Contacto", () => {
  it("muestra el formulario y la informacion de contacto", () => {
    renderContacto();

    expect(screen.getByRole("heading", { name: /contáctanos/i })).toBeInTheDocument();
    expect(screen.getByText(/\+56 9 3902 9324/)).toBeInTheDocument();
    expect(screen.getByText(/Luis\.ferreteria373@gmail\.com/)).toBeInTheDocument();
  });

  it("valida nombre y comentario obligatorios", async () => {
    const user = userEvent.setup();
    renderContacto();

    await user.click(screen.getByRole("button", { name: /enviar mensaje/i }));

    expect(screen.getByText(/tu nombre es obligatorio/i)).toBeInTheDocument();
    expect(screen.getByText(/cuéntanos en qué te ayudamos/i)).toBeInTheDocument();
    expect(localStorage.getItem("mensajes_carrasco")).toBeNull();
  });

  it("rechaza un correo invalido", async () => {
    const user = userEvent.setup();
    renderContacto();

    await user.type(screen.getByLabelText(/correo/i), "correo@hotmail.com");
    await user.click(screen.getByRole("button", { name: /enviar mensaje/i }));

    expect(screen.getByText(/usa un correo/i)).toBeInTheDocument();
  });

  it("guarda el mensaje y muestra el aviso de exito", async () => {
    const user = userEvent.setup();
    renderContacto();

    await user.type(screen.getByLabelText("Nombre"), "Ana");
    await user.type(screen.getByLabelText(/correo/i), "ana@gmail.com");
    await user.type(screen.getByLabelText(/en qué te ayudamos/i), "Necesito cotizar cemento");
    await user.click(screen.getByRole("button", { name: /enviar mensaje/i }));

    expect(screen.getByText(/recibimos tu mensaje/i)).toBeInTheDocument();
    const guardados = JSON.parse(localStorage.getItem("mensajes_carrasco"));
    expect(guardados).toHaveLength(1);
    expect(guardados[0]).toMatchObject({
      nombre: "Ana",
      correo: "ana@gmail.com",
      comentario: "Necesito cotizar cemento",
    });
  });

  it("permite enviar sin correo", async () => {
    const user = userEvent.setup();
    renderContacto();

    await user.type(screen.getByLabelText("Nombre"), "Ana");
    await user.type(screen.getByLabelText(/en qué te ayudamos/i), "Consulta general");
    await user.click(screen.getByRole("button", { name: /enviar mensaje/i }));

    expect(screen.getByText(/recibimos tu mensaje/i)).toBeInTheDocument();
    expect(localStorage.getItem("mensajes_carrasco")).not.toBeNull();
  });
});
