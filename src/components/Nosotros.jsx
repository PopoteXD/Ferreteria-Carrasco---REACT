function Nosotros() {
  return (
    <>
      <section className="seccion">
        <div className="contenedor">
          <div className="titulo-seccion">
            <h1>Nosotros</h1>
          </div>

          <div className="grid-nosotros">
            <div>
              <p>
                Ferretería Carrasco nace como un emprendimiento familiar con un objetivo simple:
                que las personas encuentren todo lo que necesitan para sus proyectos en un solo
                lugar. Desde herramientas manuales hasta materiales de construcción, pinturas y
                artículos de jardín, trabajamos cada día para ofrecer productos de calidad,
                buenos precios y una atención cercana.
              </p>
              <p>
                Hoy seguimos creciendo junto a nuestros clientes, manteniendo la misma idea con
                la que partimos: resolver, conseguir y asesorar. Si hay algo que necesitas y no
                lo ves en la tienda, te lo conseguimos.
              </p>
            </div>
            <img src="/img/productos/Tienda.png" alt="Ferretería Carrasco" />
          </div>
        </div>
      </section>

      <section className="seccion">
        <div className="contenedor">
          <div className="titulo-seccion">
            <h2>Nuestra misión y visión</h2>
          </div>
          <div className="grid-categorias" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
            <div className="tarjeta-categoria">
              <h3>Misión</h3>
              <p>
                Entregar a nuestros clientes las herramientas y materiales que necesitan, con
                asesoría honesta y precios justos, para que sus proyectos se hagan realidad.
              </p>
            </div>
            <div className="tarjeta-categoria">
              <h3>Visión</h3>
              <p>
                Ser la ferretería de confianza de la comunidad, reconocida por la calidad de
                nuestros productos y por el trato cercano con cada cliente.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="seccion">
        <div className="contenedor">
          <div className="titulo-seccion">
            <h2>Nuestros valores</h2>
          </div>
          <div className="grid-categorias">
            <div className="tarjeta-categoria">Compromiso con el cliente</div>
            <div className="tarjeta-categoria">Honestidad en precios y consejos</div>
            <div className="tarjeta-categoria">Calidad en cada producto</div>
            <div className="tarjeta-categoria">Trabajo en equipo</div>
            <div className="tarjeta-categoria">Responsabilidad con la comunidad</div>
            <div className="tarjeta-categoria">Mejora continua</div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Nosotros;