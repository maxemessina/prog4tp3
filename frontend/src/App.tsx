import { leerMesaDesdeBusqueda } from "./dominio/mesa";
import { formatearPrecio } from "./dominio/formatearPrecio";
import { useMenu } from "./menu/useMenu";
import SelectorCafe from "./components/SelectorCafe";
import type { Cafe } from "./schemas/productoSchema";

export default function App() {
  const mesa = leerMesaDesdeBusqueda(window.location.search);
  const { estado, reintentar } = useMenu();
  const cafes =
  estado.estado === "listo"
    ? estado.productos.filter(
        (producto): producto is Cafe =>
          producto.tipo === "expreso" || producto.tipo === "filtrado",
      )
    : [];
    const pasteleria =
  estado.estado === "listo"
    ? estado.productos.filter(
        (producto) => producto.tipo === "pasteleria",
      )
    : [];

  return (
    <main className="container py-4">
      <header className="mb-4">
        <h1>Cafetería Origen</h1>
        <h2 className="mb-3">
          {mesa === undefined ? "Retiro en barra" : `Mesa ${mesa}`}
        </h2>
      </header>

      <section aria-labelledby="menu-titulo">
        <h3 id="menu-titulo" className="h3 mb-3">
          Menú
        </h3>

        {estado.estado === "cargando" && (
          <div className="d-flex align-items-center gap-2" role="status">
            <span className="spinner-border spinner-border-sm" aria-hidden="true" />
            <span>Cargando menú...</span>
          </div>
        )}

        {estado.estado === "error" && (
          <div className="alert alert-danger" role="alert">
            <p>{estado.mensaje}</p>
            <button
              className="btn btn-primary mt-2"
              onClick={reintentar}
              type="button"
            >
              Reintentar
            </button>
          </div>
        )}

     {estado.estado === "listo" && (
  <div>
    {cafes.length > 0 && (
      <SelectorCafe
        cafes={cafes}
        onAgregar={(cafe) => console.log("Café seleccionado:", cafe)}
      />
    )}

    {pasteleria.length > 0 && (
      <section>
        <h3>Pastelería</h3>

        <ul className="list-group">
          {pasteleria.map((producto) => (
            <li
              className="list-group-item d-flex justify-content-between align-items-center"
              key={producto.id}
            >
              <span>{producto.nombre}</span>
              <span>{formatearPrecio(producto.precio)}</span>
            </li>
          ))}
        </ul>
      </section>
    )}
  </div>
)}
      </section>
    </main>
  );
}
