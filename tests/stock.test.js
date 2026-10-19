import { describe, it, expect } from "vitest";
import { tieneControlDeStock, unidadesDisponibles } from "../src/utils/stock";

describe("stock utils", () => {
  it("detecta si un producto tiene control de stock", () => {
    expect(tieneControlDeStock({ stock: 5 })).toBe(true);
    expect(tieneControlDeStock({ stock: 0 })).toBe(true);
    expect(tieneControlDeStock({})).toBe(false);
    expect(tieneControlDeStock(undefined)).toBe(false);
  });

  it("calcula las unidades disponibles descontando el carrito", () => {
    expect(unidadesDisponibles({ stock: 5 }, 2)).toBe(3);
  });

  it("usa 0 como cantidad en carrito por defecto", () => {
    expect(unidadesDisponibles({ stock: 4 })).toBe(4);
  });

  it("nunca devuelve cantidades negativas", () => {
    expect(unidadesDisponibles({ stock: 1 }, 5)).toBe(0);
  });

  it("devuelve Infinity cuando no hay control de stock", () => {
    expect(unidadesDisponibles({}, 3)).toBe(Infinity);
  });
});
