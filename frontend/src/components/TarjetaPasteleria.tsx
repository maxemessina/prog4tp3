
import type { Pasteleria } from "../schemas/productoSchema";
import { formatearPrecio } from "../dominio/formatearPrecio";

interface TarjetaPasteleriaProps {
  producto: Pasteleria;
  onAgregar: (producto: Pasteleria) => void;
}

export default function TarjetaPasteleria({
  producto,
  onAgregar,
}: TarjetaPasteleriaProps) {
  return (
    <article>
      <h4>{producto.nombre}</h4>

      <p>{formatearPrecio(producto.precio)}</p>

      <button
        type="button"
        onClick={() => onAgregar(producto)}
      >
        Agregar
      </button>
    </article>
  );
}
