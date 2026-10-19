import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CATEGORIAS } from "../data/productos";
import { useProductos } from "../context/ProductsContext";
import ProductCard from "./ProductCard";

function Productos() {
  const [params] = useSearchParams();

  const [categoria, setCategoria] = useState(params.get("categoria") || "");
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("");

  const { productos } = useProductos(); 
  
  let lista = productos.filter((p) => {
    const texto = busqueda.toLowerCase();
    const coincideCategoria = categoria === "" || p.categoria === categoria;
    const coincideTexto =
      p.nombre.toLowerCase().includes(texto) || p.codigo.toLowerCase().includes(texto);
    return coincideCategoria && coincideTexto;
  });

  if (orden === "precio-asc") lista.sort((a, b) => a.precio - b.precio);
  if (orden === "precio-desc") lista.sort((a, b) => b.precio - a.precio);

  return (
    <section className="seccion">
      <div className="contenedor">
        <div className="titulo-seccion">
          <h2>Catalogo completo</h2>
        </div>

        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "20px", background: "white", padding: "15px", border: "1px solid #d8d6d0" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "bold" }}>Categoria</label>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
              <option value="">Todas las categorias</option>
              {CATEGORIAS.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "bold" }}>Buscar</label>
            <input
              type="search"
              placeholder="Nombre o codigo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "bold" }}>Ordenar por</label>
            <select value={orden} onChange={(e) => setOrden(e.target.value)}>
              <option value="">Relevancia</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
            </select>
          </div>
        </div>

        <p>{lista.length} producto(s) encontrados</p>

        <div className="grid-productos">
          {lista.map((producto) => (
            <ProductCard key={producto.codigo} producto={producto} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Productos;