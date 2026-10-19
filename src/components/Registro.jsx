import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { esRunValido, esCorreoValido } from "../utils/validaciones";
import RegionComuna from "./RegionComuna";

const CAMPOS = [
  { name: "run", label: "RUN (sin puntos ni guion)", type: "text", maxLength: 9 },
  { name: "nombre", label: "Nombre", type: "text", maxLength: 50 },
  { name: "apellidos", label: "Apellidos", type: "text", maxLength: 100 },
  { name: "correo", label: "Correo electronico", type: "email", maxLength: 100 },
  { name: "clave", label: "Contraseña", type: "password", maxLength: 10 },
  { name: "confirmar", label: "Confirmar contraseña", type: "password", maxLength: 10 },
];

function Registro() {
  const { registrar } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    run: "", nombre: "", apellidos: "", correo: "", clave: "", confirmar: "",
    region: "", comuna: "", direccion: "",
  });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");

  function cambiar(e) {
    const { name, value } = e.target;
    // si cambia la region, se limpia la comuna elegida antes
    setForm({ ...form, [name]: value, ...(name === "region" ? { comuna: "" } : {}) });
  }

  function validar() {
    const nuevos = {};
    if (!esRunValido(form.run)) nuevos.run = "RUN no valido (sin puntos ni guion, ej: 190110228)";
    if (form.nombre.trim() === "") nuevos.nombre = "El nombre es obligatorio";
    if (form.apellidos.trim() === "") nuevos.apellidos = "Los apellidos son obligatorios";
    if (!esCorreoValido(form.correo)) nuevos.correo = "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com";
    if (form.clave.length < 4 || form.clave.length > 10) nuevos.clave = "Debe tener entre 4 y 10 caracteres";
    if (form.confirmar !== form.clave) nuevos.confirmar = "Las contraseñas no coinciden";
    if (form.region === "") nuevos.region = "Elige una región";
    if (form.comuna === "") nuevos.comuna = "Elige una comuna";
    if (form.direccion.trim() === "") nuevos.direccion = "La dirección es obligatoria";
    return nuevos;
  }

  function enviar(e) {
    e.preventDefault();

    const nuevos = validar();
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    const resultado = registrar({
      run: form.run.trim(),
      nombre: form.nombre.trim(),
      apellidos: form.apellidos.trim(),
      correo: form.correo.trim(),
      clave: form.clave,
      region: form.region,
      comuna: form.comuna,
      direccion: form.direccion.trim(),
    });

    if (!resultado.ok) {
      setErrorGeneral(resultado.mensaje);
      return;
    }

    navigate("/");
  }

  return (
    <section className="seccion">
      <div className="contenedor">
        <div className="tarjeta-formulario" style={{ maxWidth: "600px" }}>
          <h1 style={{ textAlign: "center" }}>Crea tu cuenta</h1>

          {errorGeneral && <div className="aviso error">{errorGeneral}</div>}

          <form onSubmit={enviar} noValidate>
            {CAMPOS.map((c) => (
              <div className="campo-formulario" key={c.name}>
                <label htmlFor={c.name}>{c.label}</label>
                <input
                  id={c.name}
                  name={c.name}
                  type={c.type}
                  maxLength={c.maxLength}
                  value={form[c.name]}
                  onChange={cambiar}
                  className={errores[c.name] ? "campo-invalido" : ""}
                />
                {errores[c.name] && <small className="texto-error visible">{errores[c.name]}</small>}
              </div>
            ))}

            <RegionComuna
              region={form.region}
              comuna={form.comuna}
              onChange={cambiar}
              errores={errores}
            />

            <div className="campo-formulario">
              <label htmlFor="direccion">Dirección</label>
              <input
                id="direccion"
                name="direccion"
                type="text"
                maxLength={300}
                placeholder="Calle, número, depto/casa"
                value={form.direccion}
                onChange={cambiar}
                className={errores.direccion ? "campo-invalido" : ""}
              />
              {errores.direccion && <small className="texto-error visible">{errores.direccion}</small>}
            </div>

            <button type="submit" className="btn btn-primario" style={{ width: "100%" }}>
              Crear cuenta
            </button>

            <p style={{ textAlign: "center", marginTop: "15px" }}>
              ¿Ya tienes cuenta? <Link to="/login">Inicia sesion</Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Registro;