
import { useState } from "react";
import type { Cafe } from "../schemas/productoSchema";
import { buscarCafe } from "../dominio/buscarCafe";
import { formatearPrecio } from "../dominio/formatearPrecio";

interface SelectorCafeProps {
  cafes: Cafe[];
  onAgregar: (cafe: Cafe) => void;
}

export default function SelectorCafe({
  cafes,
  onAgregar,
}: SelectorCafeProps) {
  const [tipo, setTipo] = useState<Cafe["tipo"] | "">("");
  const [tamanio, setTamanio] = useState<Cafe["tamanio"] | "">("");
  const [variedad, setVariedad] = useState<
    Cafe["variedad"]["nombre"] | ""
  >("");

  const seleccionCompleta =
    tipo !== "" && tamanio !== "" && variedad !== "";

  const cafeSeleccionado = seleccionCompleta
    ? buscarCafe(cafes, tipo, tamanio, variedad)
    : undefined;

  return (
    <section>
      <h3>Elegí tu café</h3>

      <div role="group" aria-labelledby="tipo-cafe-label">
        <h4 id="tipo-cafe-label">Tipo</h4>
        <button
          className={`btn ${tipo === "expreso" ? "btn-primary" : "btn-outline-primary"} me-2 mb-2`}
          type="button"
          aria-pressed={tipo === "expreso"}
          onClick={() => setTipo("expreso")}
        >
          Expreso
        </button>
        <button
          className={`btn ${tipo === "filtrado" ? "btn-primary" : "btn-outline-primary"} me-2 mb-2`}
          type="button"
          aria-pressed={tipo === "filtrado"}
          onClick={() => setTipo("filtrado")}
        >
          Filtrado
        </button>
      </div>

      <div role="group" aria-labelledby="tamanio-cafe-label">
        <h4 id="tamanio-cafe-label">Tamaño</h4>
        <button
          className={`btn ${tamanio === "Pocillo" ? "btn-primary" : "btn-outline-primary"} me-2 mb-2`}
          type="button"
          aria-pressed={tamanio === "Pocillo"}
          onClick={() => setTamanio("Pocillo")}
        >
          Pocillo
        </button>
        <button
          className={`btn ${tamanio === "Mediano" ? "btn-primary" : "btn-outline-primary"} me-2 mb-2`}
          type="button"
          aria-pressed={tamanio === "Mediano"}
          onClick={() => setTamanio("Mediano")}
        >
          Mediano
        </button>
        <button
          className={`btn ${tamanio === "Taza grande" ? "btn-primary" : "btn-outline-primary"} me-2 mb-2`}
          type="button"
          aria-pressed={tamanio === "Taza grande"}
          onClick={() => setTamanio("Taza grande")}
        >
          Taza grande
        </button>
      </div>

      <div role="group" aria-labelledby="variedad-cafe-label">
        <h4 id="variedad-cafe-label">Variedad</h4>
        <button
          className={`btn ${variedad === "Brasil" ? "btn-primary" : "btn-outline-primary"} me-2 mb-2`}
          type="button"
          aria-pressed={variedad === "Brasil"}
          onClick={() => setVariedad("Brasil")}
        >
          Brasil
        </button>
        <button
          className={`btn ${variedad === "Colombia" ? "btn-primary" : "btn-outline-primary"} me-2 mb-2`}
          type="button"
          aria-pressed={variedad === "Colombia"}
          onClick={() => setVariedad("Colombia")}
        >
          Colombia
        </button>
        <button
          className={`btn ${variedad === "Etiopía" ? "btn-primary" : "btn-outline-primary"} me-2 mb-2`}
          type="button"
          aria-pressed={variedad === "Etiopía"}
          onClick={() => setVariedad("Etiopía")}
        >
          Etiopía
        </button>
      </div>

      {cafeSeleccionado && (
        <div aria-live="polite" aria-atomic="true">
          <h4>{cafeSeleccionado.nombre}</h4>
          <p>{cafeSeleccionado.variedad.descripcion}</p>
          <p>Precio: {formatearPrecio(cafeSeleccionado.precio)}</p>
        </div>
      )}

      {seleccionCompleta && !cafeSeleccionado && (
        <p role="status">No hay un café disponible con esa selección.</p>
      )}

      <button
        className="btn btn-primary"
        type="button"
        disabled={!cafeSeleccionado}
        onClick={() => {
          if (cafeSeleccionado) {
            onAgregar(cafeSeleccionado);
          }
        }}
      >
        Agregar café
      </button>
    </section>
  );
}
