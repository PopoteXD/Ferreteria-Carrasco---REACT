import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CATEGORIAS } from "../data/productos";
import { useProductos } from "../context/ProductsContext";

const VACIO = {
  codigo: "", nombre: "", categoria: "", precio: "",
  stock: "", stockCritico: "", descripcion: "", imagen: "",
};

function AdminProductoForm() {
  const { codigo } = useParams();
  const esEdicion = Boolean(codigo);
  const navigate = useNavigate();
  const { productos, agregarProducto, editarProducto } = useProductos();

  const existente = esEdicion ? productos.find((p) => p.codigo === codigo) : null;

  // si es edicion, el formulario parte con los datos del producto
  const [form, setForm] = useState(() =>
    existente
      ? { ...VACIO, ...existente, stockCritico: existente.stockCritico ?? "" }
      : VACIO
  );
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");

  if (esEdicion && !existente) {
    return (
      <p>
        No encontramos ese producto. <Link to="/admin/productos">Volver al listado</Link>
      </p>
    );
  }

  function cambiar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validar() {
    const e = {};
    if (String(form.codigo).trim().length < 3) e.codigo = "Mínimo 3 caracteres";
    if (String(form.nombre).trim() === "") e.nombre = "El nombre es obligatorio";
    else if (form.nombre.length > 100) e.nombre = "Máximo 100 caracteres";
    if (form.categoria === "") e.categoria = "Elige una categoría";

    const precio = String(form.precio).trim();
    if (precio === "" || isNaN(Number(precio)) || Number(precio) < 0) e.precio = "Ingresa un precio válido";

    if (!/^\d+$/.test(String(form.stock).trim())) e.stock = "Solo números enteros";

    const critico = String(form.stockCritico).trim();
    if (critico !== "" && !/^\d+$/.test(critico)) e.stockCritico = "Solo números enteros";

    if (String(form.descripcion).length > 500) e.descripcion = "Máximo 500 caracteres";
    return e;
  }

  function enviar(ev) {
    ev.preventDefault();

    const nuevos = validar();
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    const datos = {
      codigo: String(form.codigo).trim().toUpperCase(),
      nombre: form.nombre.trim(),
      categoria: form.categoria,
      precio: Number(form.precio),
      stock: parseInt(form.stock, 10),
      stockCritico: String(form.stockCritico).trim() === "" ? null : parseInt(form.stockCritico, 10),
      descripcion: String(form.descripcion).trim(),
      imagen: String(form.imagen).trim() || "/img/productos/sin-foto.png",
    };

    if (esEdicion) {
      editarProducto(codigo, datos);
    } else {
      const resultado = agregarProducto(datos);
      if (!resultado.ok) {
        setErrorGeneral(resultado.mensaje);
        return;
      }
    }
    navigate("/admin/productos");
  }

  const campo = (name, label, type = "text", extra = {}) => (
    <div className="campo-formulario">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={form[name]}
        onChange={cambiar}
        className={errores[name] ? "campo-invalido" : ""}
        {...extra}
      />
      {errores[name] && <small className="texto-error visible">{errores[name]}</small>}
    </div>
  );

  return (
    <div className="tarjeta-formulario" style={{ maxWidth: "700px", margin: 0 }}>
      <h2>{esEdicion ? "Editar producto" : "Nuevo producto"}</h2>

      {errorGeneral && <div className="aviso error">{errorGeneral}</div>}

      <form onSubmit={enviar} noValidate>
        {campo("codigo", "Código", "text", { placeholder: "Ej: HM005", disabled: esEdicion })}

        <div className="campo-formulario">
          <label htmlFor="categoria">Categoría</label>
          <select
            id="categoria"
            name="categoria"
            value={form.categoria}
            onChange={cambiar}
            className={errores.categoria ? "campo-invalido" : ""}
          >
            <option value="">Selecciona una categoría</option>
            {CATEGORIAS.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
          {errores.categoria && <small className="texto-error visible">{errores.categoria}</small>}
        </div>

        {campo("nombre", "Nombre", "text", { maxLength: 100 })}

        <div className="campo-formulario">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            rows={3}
            maxLength={500}
            value={form.descripcion}
            onChange={cambiar}
          />
          {errores.descripcion && <small className="texto-error visible">{errores.descripcion}</small>}
        </div>

        {campo("precio", "Precio (CLP)", "number", { min: 0 })}
        {campo("stock", "Stock", "number", { min: 0 })}
        {campo("stockCritico", "Stock crítico (opcional)", "number", { min: 0 })}
        {campo("imagen", "Ruta de la imagen", "text", { placeholder: "/img/productos/mi-foto.jpg" })}

        <button type="submit" className="btn btn-primario">Guardar producto</button>{" "}
        <Link to="/admin/productos" className="btn btn-secundario">Cancelar</Link>
      </form>
    </div>
  );
}

export default AdminProductoForm;