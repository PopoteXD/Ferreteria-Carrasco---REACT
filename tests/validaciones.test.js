import { describe, it, expect } from "vitest";
import { esRunValido, esCorreoValido } from "../src/utils/validaciones";

describe("esRunValido", () => {
  it("acepta RUN correctos", () => {
    expect(esRunValido("111111111")).toBe(true); // 8 digitos + DV 1
    expect(esRunValido("123456785")).toBe(true); // 8 digitos + DV 5
    expect(esRunValido("11111112k")).toBe(true); // DV K en minuscula
  });

  it("rechaza RUN con digito verificador incorrecto", () => {
    expect(esRunValido("111111112")).toBe(false);
    expect(esRunValido("123456784")).toBe(false);
  });

  it("rechaza RUN con formato invalido", () => {
    expect(esRunValido("12")).toBe(false);
    expect(esRunValido("")).toBe(false);
    expect(esRunValido("14.520.202-7")).toBe(false); // con puntos y guion
    expect(esRunValido("abcdefgh9")).toBe(false);
  });
});

describe("esCorreoValido", () => {
  it("acepta los dominios permitidos", () => {
    expect(esCorreoValido("alumno@duoc.cl")).toBe(true);
    expect(esCorreoValido("docente@profesor.duoc.cl")).toBe(true);
    expect(esCorreoValido("persona@gmail.com")).toBe(true);
  });

  it("ignora mayusculas y espacios externos", () => {
    expect(esCorreoValido("  ALUMNO@DUOC.CL  ")).toBe(true);
  });

  it("rechaza dominios no permitidos y formatos invalidos", () => {
    expect(esCorreoValido("alumno@hotmail.com")).toBe(false);
    expect(esCorreoValido("alumno@duoc.com")).toBe(false);
    expect(esCorreoValido("sin-arroba")).toBe(false);
    expect(esCorreoValido("")).toBe(false);
  });
});
