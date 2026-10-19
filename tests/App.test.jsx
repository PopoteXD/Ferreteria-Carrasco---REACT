import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import App from "../src/App.jsx";
import { renderConProveedores } from "./test-utils";

describe("App", () => {
  it("renderiza el inicio con el navbar", () => {
    renderConProveedores(<App />, { route: "/" });

    expect(screen.getByRole("link", { name: /inicio/i })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /todo lo que tu proyecto necesita/i })
    ).toBeInTheDocument();
  });

  it("renderiza la ruta nosotros", () => {
    renderConProveedores(<App />, { route: "/nosotros" });

    expect(screen.getByRole("heading", { name: /nosotros/i })).toBeInTheDocument();
  });

  it("renderiza la ruta contacto", () => {
    renderConProveedores(<App />, { route: "/contacto" });

    expect(screen.getByRole("heading", { name: /contáctanos/i })).toBeInTheDocument();
  });

  it("redirige al login al entrar a /admin sin sesion", () => {
    renderConProveedores(<App />, { route: "/admin" });

    expect(screen.getByRole("heading", { name: /inicia sesion/i })).toBeInTheDocument();
  });

  it("muestra el panel admin sin navbar cuando hay sesion de administrador", () => {
    localStorage.setItem(
      "sesion_carrasco",
      JSON.stringify({
        run: "1",
        nombre: "Luis",
        apellidos: "Carrasco",
        tipoUsuario: "Administrador",
      })
    );

    renderConProveedores(<App />, { route: "/admin" });

    expect(screen.queryByRole("link", { name: /inicio/i })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /panel administrador/i })).toBeInTheDocument();
  });
});
