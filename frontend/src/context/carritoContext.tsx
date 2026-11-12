import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from "react";

import {
  carritoInicial,
  carritoReducer,
  calcularSubtotalCarrito,
} from "../reducers/carritoReducers";

import type { Producto } from "../schemas/productoSchema";

type CarritoContextType = {
  carrito: typeof carritoInicial;
  subtotal: number;
  agregarProducto: (producto: Producto) => void;
  sumarProducto: (productoId: number) => void;
  restarProducto: (productoId: number) => void;
  quitarProducto: (productoId: number) => void;
};

const CarritoContext = createContext<CarritoContextType | undefined>(
  undefined,
);

type CarritoProviderProps = {
  children: ReactNode;
};

export function CarritoProvider({ children }: CarritoProviderProps) {
  const [carrito, dispatch] = useReducer(carritoReducer, carritoInicial);

  function agregarProducto(producto: Producto) {
    dispatch({ type: "AGREGAR", producto });
  }

  function sumarProducto(productoId: number) {
    dispatch({ type: "SUMAR", productoId });
  }

  function restarProducto(productoId: number) {
    dispatch({ type: "RESTAR", productoId });
  }

  function quitarProducto(productoId: number) {
    dispatch({ type: "QUITAR", productoId });
  }

  const subtotal = calcularSubtotalCarrito(carrito);

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        subtotal,
        agregarProducto,
        sumarProducto,
        restarProducto,
        quitarProducto,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const context = useContext(CarritoContext);

  if (!context) {
    throw new Error(
      "useCarrito debe utilizarse dentro de un CarritoProvider",
    );
  }

  return context;
}