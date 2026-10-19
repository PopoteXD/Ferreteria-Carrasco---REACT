import { useState } from "react";
import { esCorreoValido } from "../utils/validaciones";

function Contacto() {
  const [form, setForm] = useState({ nombre: "", correo: "", comentario: "" });
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  function cambiar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function enviar(e) {
    e.preventDefault();

    const nuevos = {};
    if (form.nombre.trim() === "") nuevos.nombre = "Tu nombre es obligatorio";
    if (form.correo.trim() !== "" && !esCorreoValido(form.correo)) {
      nuevos.correo = "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com";
    }
    if (form.comentario.trim() === "") nuevos.comentario = "Cuéntanos en qué te ayudamos";

    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    // se guarda el mensaje en localStorage (simulacion de envio)
    const mensajes = JSON.parse(localStorage.getItem("mensajes_carrasco") || "[]");
    mensajes.push({ ...form, fecha: new Date().toISOString() });
    localStorage.setItem("mensajes_carrasco", JSON.stringify(mensajes));

    setEnviado(true);
    setForm({ nombre: "", correo: "", comentario: "" });
  }

  return (
    <>
      <section className="seccion">
        <div className="contenedor">
          <div className="tarjeta-formulario">
            <h1 style={{ textAlign: "center" }}>Contáctanos</h1>

            {enviado && <div className="aviso exito">¡Gracias! Recibimos tu mensaje.</div>}

            <form onSubmit={enviar} noValidate>
              <div className="campo-formulario">
                <label htmlFor="nombre">Nombre</label>
                <input id="nombre" name="nombre" type="text" maxLength={100}
                  value={form.nombre} onChange={cambiar}
                  className={errores.nombre ? "campo-invalido" : ""} />
                {errores.nombre && <small className="texto-error visible">{errores.nombre}</small>}
              </div>

              <div className="campo-formulario">
                <label htmlFor="correo">Correo (opcional)</label>
                <input id="correo" name="correo" type="email" maxLength={100}
                  value={form.correo} onChange={cambiar}
                  className={errores.correo ? "campo-invalido" : ""} />
                {errores.correo && <small className="texto-error visible">{errores.correo}</small>}
              </div>

              <div className="campo-formulario">
                <label htmlFor="comentario">¿En qué te ayudamos?</label>
                <textarea id="comentario" name="comentario" rows={5} maxLength={500}
                  value={form.comentario} onChange={cambiar}
                  className={errores.comentario ? "campo-invalido" : ""} />
                {errores.comentario && <small className="texto-error visible">{errores.comentario}</small>}
              </div>

              <button type="submit" className="btn btn-primario" style={{ width: "100%" }}>
                Enviar mensaje
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="seccion">
        <div className="contenedor">
          <div className="titulo-seccion">
            <h2>Otras formas de contactarnos</h2>
          </div>
          <div className="grid-contacto-info">
            <div className="tarjeta-contacto-info"><strong>Teléfono</strong>+56 9 3902 9324</div>
            <div className="tarjeta-contacto-info"><strong>Correo</strong>Luis.ferreteria373@gmail.com</div>
            <div className="tarjeta-contacto-info"><strong>Dirección</strong>Pasaje E #2057, Los Avellanos 2, Villa Alemana, Valparaíso</div>
            <div className="tarjeta-contacto-info"><strong>Horario</strong>Lun a Sáb 8:30–19:30, Dom 9:30–16:00</div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contacto;