import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegionComuna from "../src/components/RegionComuna";
import { REGIONES_COMUNAS } from "../src/data/regiones";

function opciones() {
  return screen.getAllByRole("option").map((o) => o.value);
}

describe("RegionComuna", () => {
  it("lista todas las regiones mas el placeholder", () => {
    render(<RegionComuna region="" comuna="" onChange={() => {}} />);

    const valores = opciones();
    expect(valores[0]).toBe("");
    Object.keys(REGIONES_COMUNAS).forEach((r) => {
      expect(valores).toContain(r);
    });
  });

  it("deshabilita el selector de comuna si no hay region", () => {
    render(<RegionComuna region="" comuna="" onChange={() => {}} />);

    expect(screen.getByLabelText(/comuna/i)).toBeDisabled();
  });

  it("muestra las comunas de la region seleccionada", () => {
    render(
      <RegionComuna region="Region de Valparaiso" comuna="" onChange={() => {}} />
    );

    const comuna = screen.getByLabelText(/comuna/i);
    expect(comuna).toBeEnabled();
    expect(opciones()).toEqual(
      expect.arrayContaining(["Valparaiso", "Viña del Mar", "Villa Alemana"])
    );
  });

  it("notifica los cambios mediante onChange", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<RegionComuna region="" comuna="" onChange={onChange} />);

    await user.selectOptions(screen.getByLabelText(/región/i), "Region de Valparaiso");

    expect(onChange).toHaveBeenCalled();
  });

  it("muestra los mensajes de error recibidos", () => {
    render(
      <RegionComuna
        region=""
        comuna=""
        onChange={() => {}}
        errores={{ region: "Elige una región", comuna: "Elige una comuna" }}
      />
    );

    expect(screen.getByText("Elige una región")).toBeInTheDocument();
    expect(screen.getByText("Elige una comuna")).toBeInTheDocument();
  });
});
