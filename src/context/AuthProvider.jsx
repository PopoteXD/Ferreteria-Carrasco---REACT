import { useState } from "react";
import { AuthContext } from "./AuthContext";

const CLAVE_USUARIOS = "usuarios_carrasco";
const CLAVE_SESION = "sesion_carrasco";

function leerUsuarios() {
  const guardado = localStorage.getItem(CLAVE_USUARIOS);
  if (guardado) return JSON.parse(guardado);

  const inicial = [
    {
      run: "14.520.202-7",
      nombre: "Ferretería",
      apellidos: "Carrasco",
      correo: "admin@duoc.cl",
      clave: "admin123",
      tipoUsuario: "Administrador",
    },
  ];
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(inicial));
  return inicial;
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const guardada = localStorage.getItem(CLAVE_SESION);
    return guardada ? JSON.parse(guardada) : null;
  });

  function iniciarSesion(correo, clave) {
    const usuarios = leerUsuarios();
    const encontrado = usuarios.find(
      (u) => u.correo.toLowerCase() === correo.trim().toLowerCase() && u.clave === clave
    );

    if (!encontrado) {
      return { ok: false, mensaje: "Correo o contraseña incorrectos" };
    }

    localStorage.setItem(CLAVE_SESION, JSON.stringify(encontrado));
    setUsuario(encontrado);
    return { ok: true, usuario: encontrado };
  }

  function registrar(datos) {
    const usuarios = leerUsuarios();

    if (usuarios.some((u) => u.run === datos.run)) {
      return { ok: false, mensaje: "Ya existe una cuenta con ese RUN" };
    }
    if (usuarios.some((u) => u.correo.toLowerCase() === datos.correo.toLowerCase())) {
      return { ok: false, mensaje: "Ya existe una cuenta con ese correo" };
    }

    const nuevo = { ...datos, tipoUsuario: "Cliente" };
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify([...usuarios, nuevo]));
    localStorage.setItem(CLAVE_SESION, JSON.stringify(nuevo));
    setUsuario(nuevo);
    return { ok: true };
  }

  function actualizarPerfil(datos) {
    const usuarios = leerUsuarios();

    const correoRepetido = usuarios.some(
      (u) => u.run !== usuario.run && u.correo.toLowerCase() === datos.correo.toLowerCase()
    );
    if (correoRepetido) return { ok: false, mensaje: "Ese correo ya lo usa otra cuenta" };

    const actualizados = usuarios.map((u) =>
      u.run === usuario.run ? { ...u, ...datos } : u
    );
    const nuevoUsuario = actualizados.find((u) => u.run === usuario.run);

    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(actualizados));
    localStorage.setItem(CLAVE_SESION, JSON.stringify(nuevoUsuario));
    setUsuario(nuevoUsuario);
    return { ok: true };
  }

  function cerrarSesion() {
    localStorage.removeItem(CLAVE_SESION);
    setUsuario(null);
  }

  return (
    <AuthContext.Provider
      value={{ usuario, iniciarSesion, registrar, actualizarPerfil, cerrarSesion }}
    >
      {children}
    </AuthContext.Provider>
  );
}
