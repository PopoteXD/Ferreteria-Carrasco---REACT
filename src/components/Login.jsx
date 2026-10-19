import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");

  function enviar(e) {
    e.preventDefault(); // evita que el formulario recargue la pagina

    if (correo.trim() === "" || clave === "") {
      setError("Completa el correo y la contraseña");
      return;
    }

    const resultado = iniciarSesion(correo, clave);
    if (!resultado.ok) {
      setError(resultado.mensaje);
      return;
    }

    navigate(resultado.usuario.tipoUsuario === "Administrador" ? "/admin" : "/");
  }

  return (
    <section className="seccion">
      <div className="contenedor">
        <div className="tarjeta-formulario">
          <h1 style={{ textAlign: "center" }}>Inicia sesion</h1>

          {error && <div className="aviso error">{error}</div>}

          <form onSubmit={enviar} noValidate>
            <div className="campo-formulario">
              <label htmlFor="correo">Correo electronico</label>
              <input
                id="correo"
                type="email"
                placeholder="nombre@duoc.cl"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>

            <div className="campo-formulario">
              <label htmlFor="clave">Contraseña</label>
              <input
                id="clave"
                type="password"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primario" style={{ width: "100%" }}>
              Ingresar
            </button>

            <p style={{ textAlign: "center", marginTop: "15px" }}>
              ¿Aun no tienes cuenta? <Link to="/registro">Registrate</Link>
            </p>

            <div className="aviso" style={{ marginTop: "20px" }}>
              <strong>Cuenta administradora de prueba:</strong>
              <br />
              admin@duoc.cl / admin123
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Login;