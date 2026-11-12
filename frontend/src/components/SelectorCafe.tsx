
import { useState } from "react";
import type { Cafe } from "../schemas/productoSchema";
import { buscarCafe } from "../dominio/buscarCafe";

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

      <div>
        <h4>Tipo</h4>
        <button type="button" onClick={() => setTipo("expreso")}>
          Expreso
        </button>
        <button type="button" onClick={() => setTipo("filtrado")}>
          Filtrado
        </button>
      </div>

      <div>
        <h4>Tamaño</h4>
        <button type="button" onClick={() => setTamanio("Pocillo")}>
          Pocillo
        </button>
        <button type="button" onClick={() => setTamanio("Mediano")}>
          Mediano
        </button>
        <button type="button" onClick={() => setTamanio("Taza grande")}>
          Taza grande
        </button>
      </div>

      <div>
        <h4>Variedad</h4>
        <button type="button" onClick={() => setVariedad("Brasil")}>
          Brasil
        </button>
        <button type="button" onClick={() => setVariedad("Colombia")}>
          Colombia
        </button>
        <button type="button" onClick={() => setVariedad("Etiopía")}>
          Etiopía
        </button>
      </div>

      <button
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
