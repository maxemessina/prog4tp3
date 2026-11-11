import { useCallback, useEffect, useState } from "react";
import { obtenerProductos } from "../api/api";
import {
  crearEstadoError,
  crearEstadoListo,
  estadoCargando,
  type EstadoMenu,
} from "./estadoMenu";

export function useMenu(): {
  estado: EstadoMenu;
  reintentar: () => void;
} {
  const [estado, setEstado] = useState<EstadoMenu>(estadoCargando);
  const [intento, setIntento] = useState(0);

  const reintentar = useCallback(() => {
    setEstado(estadoCargando);
    setIntento((actual) => actual + 1);
  }, []);

  useEffect(() => {
    let activo = true;

    obtenerProductos().then(
      (productos) => {
        if (activo) {
          setEstado(crearEstadoListo(productos));
        }
      },
      (error: unknown) => {
        if (!activo) {
          return;
        }

        const mensaje =
          error instanceof Error
            ? error.message
            : "No se pudo cargar el menú.";
        setEstado(crearEstadoError(mensaje));
      },
    );

    return () => {
      activo = false;
    };
  }, [intento]);

  return { estado, reintentar };
}
