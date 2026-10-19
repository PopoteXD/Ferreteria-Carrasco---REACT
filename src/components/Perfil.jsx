import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { esCorreoValido } from "../utils/validaciones";
import RegionComuna from "./RegionComuna";

function Perfil() {
  const { usuario, actualizarPerfil } = useAuth();

  const [form, setForm] = useState({
    nombre: usuario?.nombre || "",
    apellidos: usuario?.apellidos || "",
    correo: usuario?.correo || "",
    claveNueva: "",
    region: usuario?.region || "",
    comuna: usuario?.comuna || "",
    direccion: usuario?.direccion || "",
  });
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  // si no hay sesion, se manda al login
  if (!usuario) return <Navigate to="/login" />;

  function cambiar(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value, ...(name === "region" ? { comuna: "" } : {}) });
  }

  function enviar(e) {
    e.preventDefault();

    const nuevos = {};
    if (form.nombre.trim() === "") nuevos.nombre = "El nombre es obligatorio";
    if (form.apellidos.trim() === "") nuevos.apellidos = "Los apellidos son obligatorios";
    if (!esCorreoValido(form.correo)) nuevos.correo = "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com";
    if (form.claveNueva !== "" && (form.claveNueva.length < 4 || form.claveNueva.length > 10)) {
      nuevos.claveNueva = "Debe tener entre 4 y 10 caracteres";
    }
    if (form.region === "") nuevos.region = "Elige una región";
    if (form.comuna === "") nuevos.comuna = "Elige una comuna";
    if (form.direccion.trim() === "") nuevos.direccion = "La dirección es obligatoria";

    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    const datos = {
      nombre: form.nombre.trim(),
      apellidos: form.apellidos.trim(),
      correo: form.correo.trim(),
      region: form.region,
      comuna: form.comuna,
      direccion: form.direccion.trim(),
    };
    // la clave nueva es opcional: si queda vacia, se mantiene la anterior
    if (form.claveNueva !== "") datos.clave = form.claveNueva;

    const resultado = actualizarPerfil(datos);
    if (!resultado.ok) {
      setMensaje({ tipo: "error", texto: resultado.mensaje });
      return;
    }
    setForm({ ...form, claveNueva: "" });
    setMensaje({ tipo: "exito", texto: "Tus datos se guardaron correctamente" });
  }

  const campoTexto = (name, label, type = "text", maxLength = 100) => (
    <div className="campo-formulario">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        maxLength={maxLength}
        value={form[name]}
        onChange={cambiar}
        className={errores[name] ? "campo-invalido" : ""}
      />
      {errores[name] && <small className="texto-error visible">{errores[name]}</small>}
    </div>
  );

  return (
    <section className="seccion">
      <div className="contenedor">
        <div className="tarjeta-formulario" style={{ maxWidth: "600px" }}>
          <h1 style={{ textAlign: "center" }}>Mi Perfil</h1>
          <p style={{ textAlign: "center" }}>
            RUN: <strong>{usuario.run}</strong> (no se puede modificar)
          </p>

          {mensaje.texto && <div className={`aviso ${mensaje.tipo}`}>{mensaje.texto}</div>}

          <form onSubmit={enviar} noValidate>
            {campoTexto("nombre", "Nombre", "text", 50)}
            {campoTexto("apellidos", "Apellidos")}
            {campoTexto("correo", "Correo electronico", "email")}
            {campoTexto("claveNueva", "Nueva contraseña (vacío para no cambiarla)", "password", 10)}

            <RegionComuna
              region={form.region}
              comuna={form.comuna}
              onChange={cambiar}
              errores={errores}
            />

            {campoTexto("direccion", "Dirección", "text", 300)}

            <button type="submit" className="btn btn-primario" style={{ width: "100%" }}>
              Guardar cambios
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Perfil;