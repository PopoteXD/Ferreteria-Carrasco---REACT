export const CATEGORIAS = [
  { id: "herramientas-manuales", nombre: "Herramientas Manuales" },
  { id: "herramientas-electricas", nombre: "Herramientas Electricas" },
  { id: "materiales-construccion", nombre: "Materiales de Construccion" },
  { id: "pinturas-selladores", nombre: "Pinturas y Selladores" },
  { id: "plomeria", nombre: "Plomeria" },
  { id: "electricidad", nombre: "Electricidad" },
  { id: "seguridad", nombre: "Seguridad y Proteccion" },
  { id: "jardin-exterior", nombre: "Jardin y Exterior" },
];

export const PRODUCTOS_SEMILLA = [
  { codigo: "HM001", nombre: "Martillo de Uña 16 oz", categoria: "herramientas-manuales", precio: 7990, stock: 42, stockCritico: 8, descripcion: "Martillo de uña con mango de fibra de vidrio antideslizante.", imagen: "/img/productos/martillo.jpg" },
  { codigo: "HM002", nombre: "Juego de Destornilladores 6 piezas", categoria: "herramientas-manuales", precio: 9990, stock: 30, stockCritico: 6, descripcion: "Set de destornilladores planos y phillips con mango ergonomico.", imagen: "/img/productos/destornilladores.jpg" },
  { codigo: "HM003", nombre: "Llave Ajustable 10 pulgadas", categoria: "herramientas-manuales", precio: 6490, stock: 25, stockCritico: 5, descripcion: "Llave inglesa de acero al cromo vanadio.", imagen: "/img/productos/llave-ajustable.jpg" },
  { codigo: "HE001", nombre: "Taladro Percutor 750W", categoria: "herramientas-electricas", precio: 44990, stock: 2, stockCritico: 3, descripcion: "Taladro percutor de doble velocidad con maletin incluido.", imagen: "/img/productos/taladro.jpg" },
  { codigo: "HE002", nombre: "Amoladora Angular 4.5 pulgadas", categoria: "herramientas-electricas", precio: 32990, stock: 12, stockCritico: 3, descripcion: "Amoladora de 820W con proteccion de disco ajustable.", imagen: "/img/productos/amoladora.jpg" },
  { codigo: "MC001", nombre: "Cemento Gris 25 kg", categoria: "materiales-construccion", precio: 6890, stock: 120, stockCritico: 20, descripcion: "Cemento Portland de uso general para albañileria.", imagen: "/img/productos/cemento.jpg" },
  { codigo: "PI001", nombre: "Pintura Latex Interior 1 galon", categoria: "pinturas-selladores", precio: 15990, stock: 5, stockCritico: 8, descripcion: "Latex lavable de alto poder cubriente, terminacion mate.", imagen: "/img/productos/pintura-latex.jpg" },
  { codigo: "PL001", nombre: "Llave de Paso PVC 20mm", categoria: "plomeria", precio: 2990, stock: 55, stockCritico: 10, descripcion: "Llave de corte de PVC roscada.", imagen: "/img/productos/llave-paso.jpg" },
  { codigo: "EL001", nombre: "Cable Electrico 2.5mm (rollo 20m)", categoria: "electricidad", precio: 13990, stock: 18, stockCritico: 4, descripcion: "Cable de cobre, aislacion 600V.", imagen: "/img/productos/cable.jpg" },
  { codigo: "SE001", nombre: "Casco de Seguridad Ajustable", categoria: "seguridad", precio: 8990, stock: 20, stockCritico: 5, descripcion: "Casco tipo jockey con matraca de ajuste.", imagen: "/img/productos/casco.jpg" },
  { codigo: "JA001", nombre: "Manguera de Jardin 15 m", categoria: "jardin-exterior", precio: 11990, stock: 20, stockCritico: 4, descripcion: "Manguera reforzada con pistola rociadora.", imagen: "/img/productos/manguera.jpg" }
];

export function formatoCLP(numero) {
  return "$" + numero.toLocaleString("es-CL");
}