import "./estilos.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Productos from "./components/Productos";
import ProductoDetalle from "./components/ProductoDetalle";
import Carrito from "./components/Carrito";
import Login from "./components/Login";
import Registro from "./components/Registro";
import Perfil from "./components/Perfil";
import Nosotros from "./components/Nosotros";
import Contacto from "./components/Contacto";
import RutaAdmin from "./components/RutaAdmin";
import LayoutAdmin from "./components/LayoutAdmin";
import AdminDashboard from "./components/AdminDashboard";
import AdminProductos from "./components/AdminProductos";
import AdminProductoForm from "./components/AdminProductoForm";

function App() {
  const { pathname } = useLocation();
  const enAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!enAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/producto/:codigo" element={<ProductoDetalle />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/contacto" element={<Contacto />} />

        {/* rutas anidadas del panel, protegidas */}
        <Route path="/admin" element={<RutaAdmin><LayoutAdmin /></RutaAdmin>}>
          <Route index element={<AdminDashboard />} />
          <Route path="productos" element={<AdminProductos />} />
          <Route path="productos/nuevo" element={<AdminProductoForm />} />
          <Route path="productos/editar/:codigo" element={<AdminProductoForm />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;