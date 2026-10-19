import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Nosotros from "../src/components/Nosotros";

describe("Nosotros", () => {
  it("muestra el titulo y la historia de la empresa", () => {
    render(<Nosotros />);

    expect(screen.getByRole("heading", { name: /nosotros/i })).toBeInTheDocument();
    expect(screen.getByText(/ferretería carrasco nace/i)).toBeInTheDocument();
  });

  it("muestra mision y vision", () => {
    render(<Nosotros />);

    expect(screen.getByRole("heading", { name: /nuestra misión y visión/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^misión$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^visión$/i })).toBeInTheDocument();
  });

  it("lista los valores corporativos", () => {
    render(<Nosotros />);

    expect(screen.getByText("Compromiso con el cliente")).toBeInTheDocument();
    expect(screen.getByText("Honestidad en precios y consejos")).toBeInTheDocument();
    expect(screen.getByText("Mejora continua")).toBeInTheDocument();
  });
});
