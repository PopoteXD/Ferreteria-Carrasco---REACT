/**
 * Utilidades de stock compartidas por el catalogo y el carrito.
 *
 * Un producto con `stock` numerico tiene control de stock. Si no lo trae
 * (datos antiguos o creados sin stock) se considera disponibilidad
 * ilimitada, para no bloquear la tienda por datos incompletos.
 */

export function tieneControlDeStock(producto) {
  return typeof producto?.stock === "number";
}

/**
 * Unidades que aun se pueden agregar de un producto, descontando lo que
 * ya esta en el carrito. Devuelve Infinity cuando no hay control de stock.
 */
export function unidadesDisponibles(producto, cantidadEnCarrito = 0) {
  if (!tieneControlDeStock(producto)) return Infinity;
  return Math.max(0, producto.stock - cantidadEnCarrito);
}
