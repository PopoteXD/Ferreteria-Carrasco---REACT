import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Limpia el DOM y el almacenamiento entre pruebas para que no se filtren datos.
afterEach(() => {
  cleanup();
  localStorage.clear();
});
