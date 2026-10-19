import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCart } from "../src/context/CartContext";
import { useProductos } from "../src/context/ProductsContext";
import { useAuth } from "../src/context/AuthContext";
import { CartProvider } from "../src/context/CartProvider";
import { ProductsProvider } from "../src/context/ProductsProvider";
import { AuthProvider } from "../src/context/AuthProvider";
import { PRODUCTOS_SEMILLA } from "../src/data/productos";

const cartWrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
const productsWrapper = ({ children }) => <ProductsProvider>{children}</ProductsProvider>;
const authWrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

describe("CartContext", () => {
  it("agrega una linea nueva y suma cantidades de lineas existentes", () => {
    const { result } = renderHook(() => useCart(), { wrapper: cartWrapper });

    expect(result.current.carrito).toEqual([]);

    act(() => result.current.agregar("HM001"));
    expect(result.current.carrito).toEqual([{ codigo: "HM001", cantidad: 1 }]);

    act(() => result.current.agregar("HM001", 2));
    expect(result.current.carrito).toEqual([{ codigo: "HM001", cantidad: 3 }]);

    act(() => result.current.agregar("HM002"));
    expect(result.current.carrito).toHaveLength(2);
  });

  it("nunca baja de 1 con cambiarCantidad", () => {
    const { result } = renderHook(() => useCart(), { wrapper: cartWrapper });

    act(() => result.current.agregar("HM001", 3));
    act(() => result.current.cambiarCantidad("HM001", -10));

    expect(result.current.carrito[0].cantidad).toBe(1);
  });

  it("quita lineas y calcula el total de unidades", () => {
    const { result } = renderHook(() => useCart(), { wrapper: cartWrapper });

    act(() => result.current.agregar("HM001", 2));
    act(() => result.current.agregar("HM002", 3));
    expect(result.current.totalUnidades).toBe(5);

    act(() => result.current.quitar("HM001"));
    expect(result.current.carrito).toEqual([{ codigo: "HM002", cantidad: 3 }]);
    expect(result.current.totalUnidades).toBe(3);
  });

  it("vacia el carrito", () => {
    const { result } = renderHook(() => useCart(), { wrapper: cartWrapper });

    act(() => result.current.agregar("HM001"));
    act(() => result.current.vaciar());

    expect(result.current.carrito).toEqual([]);
    expect(result.current.totalUnidades).toBe(0);
  });

  it("persiste el carrito en localStorage", () => {
    const { result } = renderHook(() => useCart(), { wrapper: cartWrapper });

    act(() => result.current.agregar("HM001", 2));

    expect(JSON.parse(localStorage.getItem("carrito_carrasco"))).toEqual([
      { codigo: "HM001", cantidad: 2 },
    ]);
  });

  it("recupera el carrito guardado al iniciar", () => {
    localStorage.setItem("carrito_carrasco", JSON.stringify([{ codigo: "HM001", cantidad: 4 }]));

    const { result } = renderHook(() => useCart(), { wrapper: cartWrapper });

    expect(result.current.carrito).toEqual([{ codigo: "HM001", cantidad: 4 }]);
  });
});

describe("ProductsContext", () => {
  it("parte con el catalogo semilla", () => {
    const { result } = renderHook(() => useProductos(), { wrapper: productsWrapper });

    expect(result.current.productos).toHaveLength(PRODUCTOS_SEMILLA.length);
  });

  it("completa el stock de productos antiguos guardados sin stock", () => {
    localStorage.setItem(
      "productos_carrasco",
      JSON.stringify([{ codigo: "HM001", nombre: "Martillo antiguo", precio: 100 }])
    );

    const { result } = renderHook(() => useProductos(), { wrapper: productsWrapper });
    const producto = result.current.productos.find((p) => p.codigo === "HM001");

    // El stock y demas campos faltantes vienen de la semilla...
    expect(producto.stock).toBe(42);
    expect(producto.stockCritico).toBe(8);
    // ...pero se respetan los datos propios del usuario.
    expect(producto.nombre).toBe("Martillo antiguo");
  });

  it("ignora datos guardados corruptos y usa la semilla", () => {
    localStorage.setItem("productos_carrasco", "no-es-json");

    const { result } = renderHook(() => useProductos(), { wrapper: productsWrapper });

    expect(result.current.productos).toHaveLength(PRODUCTOS_SEMILLA.length);
  });

  it("impide agregar productos con codigo repetido", () => {
    const { result } = renderHook(() => useProductos(), { wrapper: productsWrapper });
    let respuesta;

    act(() => {
      respuesta = result.current.agregarProducto({ codigo: "HM001", nombre: "Duplicado" });
    });

    expect(respuesta.ok).toBe(false);
    expect(respuesta.mensaje).toMatch(/ya existe/i);
    expect(result.current.productos).toHaveLength(PRODUCTOS_SEMILLA.length);
  });

  it("agrega, edita y elimina productos", () => {
    const { result } = renderHook(() => useProductos(), { wrapper: productsWrapper });
    let respuesta;

    act(() => {
      respuesta = result.current.agregarProducto({ codigo: "ZZ999", nombre: "Nuevo" });
    });
    expect(respuesta.ok).toBe(true);
    expect(result.current.productos).toHaveLength(PRODUCTOS_SEMILLA.length + 1);

    act(() => result.current.editarProducto("ZZ999", { nombre: "Editado" }));
    expect(result.current.productos.find((p) => p.codigo === "ZZ999").nombre).toBe("Editado");

    act(() => result.current.eliminarProducto("ZZ999"));
    expect(result.current.productos).toHaveLength(PRODUCTOS_SEMILLA.length);
  });

  it("persiste los productos en localStorage", () => {
    const { result } = renderHook(() => useProductos(), { wrapper: productsWrapper });

    act(() => result.current.agregarProducto({ codigo: "ZZ999", nombre: "Nuevo" }));

    expect(JSON.parse(localStorage.getItem("productos_carrasco"))).toHaveLength(
      PRODUCTOS_SEMILLA.length + 1
    );
  });

  it("descuenta stock del producto indicado", () => {
    const { result } = renderHook(() => useProductos(), { wrapper: productsWrapper });
    const stockInicial = result.current.productos.find((p) => p.codigo === "HM001").stock;

    act(() => result.current.descontarStock("HM001", 2));

    expect(result.current.productos.find((p) => p.codigo === "HM001").stock).toBe(
      stockInicial - 2
    );
  });

  it("no deja el stock en negativo al descontar mas de lo disponible", () => {
    const { result } = renderHook(() => useProductos(), { wrapper: productsWrapper });

    act(() => result.current.descontarStock("HM001", 9999));

    expect(result.current.productos.find((p) => p.codigo === "HM001").stock).toBe(0);
  });
});

describe("AuthContext", () => {
  it("inicia sesion con el administrador semilla", () => {
    const { result } = renderHook(() => useAuth(), { wrapper: authWrapper });
    let respuesta;

    act(() => {
      respuesta = result.current.iniciarSesion("admin@duoc.cl", "admin123");
    });

    expect(respuesta.ok).toBe(true);
    expect(respuesta.usuario.tipoUsuario).toBe("Administrador");
    expect(result.current.usuario.correo).toBe("admin@duoc.cl");
  });

  it("rechaza credenciales incorrectas", () => {
    const { result } = renderHook(() => useAuth(), { wrapper: authWrapper });
    let respuesta;

    act(() => {
      respuesta = result.current.iniciarSesion("admin@duoc.cl", "mala");
    });

    expect(respuesta.ok).toBe(false);
    expect(result.current.usuario).toBeNull();
  });

  it("registra un usuario nuevo y lo deja con sesion activa", () => {
    const { result } = renderHook(() => useAuth(), { wrapper: authWrapper });
    let respuesta;

    act(() => {
      respuesta = result.current.registrar({
        run: "111111111",
        nombre: "Ana",
        apellidos: "Perez",
        correo: "ana@duoc.cl",
      });
    });

    expect(respuesta.ok).toBe(true);
    expect(result.current.usuario.tipoUsuario).toBe("Cliente");
    expect(result.current.usuario.nombre).toBe("Ana");
  });

  it("no permite RUN ni correo duplicados", () => {
    const { result } = renderHook(() => useAuth(), { wrapper: authWrapper });
    let porRun;
    let porCorreo;

    act(() => {
      porRun = result.current.registrar({ run: "14.520.202-7", correo: "nuevo@duoc.cl" });
    });
    expect(porRun.ok).toBe(false);

    act(() => {
      porCorreo = result.current.registrar({
        run: "222222222",
        correo: "admin@duoc.cl",
      });
    });
    expect(porCorreo.ok).toBe(false);
  });

  it("actualiza el perfil y evita correos repetidos", () => {
    const { result } = renderHook(() => useAuth(), { wrapper: authWrapper });
    let alta;
    let ok;
    let repetido;

    act(() => {
      alta = result.current.registrar({
        run: "111111111",
        nombre: "Ana",
        apellidos: "Perez",
        correo: "ana@duoc.cl",
      });
    });
    expect(alta.ok).toBe(true);

    act(() => {
      ok = result.current.actualizarPerfil({
        nombre: "Ana Maria",
        apellidos: "Perez",
        correo: "ana@duoc.cl",
      });
    });
    expect(ok.ok).toBe(true);
    expect(result.current.usuario.nombre).toBe("Ana Maria");

    act(() => {
      repetido = result.current.actualizarPerfil({
        nombre: "Ana Maria",
        apellidos: "Perez",
        correo: "admin@duoc.cl",
      });
    });
    expect(repetido.ok).toBe(false);
  });

  it("cierra la sesion", () => {
    const { result } = renderHook(() => useAuth(), { wrapper: authWrapper });

    act(() => {
      result.current.iniciarSesion("admin@duoc.cl", "admin123");
    });
    expect(result.current.usuario).not.toBeNull();

    act(() => result.current.cerrarSesion());

    expect(result.current.usuario).toBeNull();
    expect(localStorage.getItem("sesion_carrasco")).toBeNull();
  });
});
