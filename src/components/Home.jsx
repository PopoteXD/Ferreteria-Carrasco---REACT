import { Link } from "react-router-dom";
import { CATEGORIAS } from "../data/productos";
import { useProductos } from "../context/ProductsContext";
import ProductCard from "./ProductCard";

function Home() {
  const { productos } = useProductos();
  const destacados = productos.slice(0, 8);

  return (
    <>
      <section className="hero">
        <video autoPlay muted loop playsInline>
          <source src="src/assets/video/bienvenida.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay">
          <div className="contenedor">
            <h1>Todo lo que tu proyecto necesita</h1>
            <p>Herramientas, materiales de construccion, pinturas, plomeria y electricidad.</p>
            <div className="hero-acciones">
              <a href="/productos" className="btn btn-primario">Ver catalogo</a>
              <a href="/nosotros" className="btn btn-secundario">Conocenos</a>
            </div>
          </div>
        </div>
      </section>

      <section className="seccion">
        <div className="contenedor">
          <div className="titulo-seccion">
            <h2>Compra por categoria</h2>
          </div>
          <div className="grid-categorias">
            {CATEGORIAS.map((cat) => (
              <Link key={cat.id} className="tarjeta-categoria" to={`/productos?categoria=${cat.id}`}>
                {cat.nombre}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="seccion">
        <div className="contenedor">
          <div className="titulo-seccion">
            <h2>Destacados</h2>
          </div>
          <div className="grid-productos">
            {destacados.map((producto) => (
              <ProductCard key={producto.codigo} producto={producto} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;