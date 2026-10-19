import { createContext, useContext } from "react";

export const ProductsContext = createContext();

export function useProductos() {
  return useContext(ProductsContext);
}