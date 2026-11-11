import { leerMesaDesdeBusqueda } from "./dominio/mesa";
import { formatearPrecio } from "./dominio/formatearPrecio";
import { useMenu } from "./menu/useMenu";

export default function App() {
  const mesa = leerMesaDesdeBusqueda(window.location.search);
  const { estado, reintentar } = useMenu();

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
          <ul className="list-group">
            {estado.productos.map((producto) => (
              <li
                className="list-group-item d-flex justify-content-between align-items-center"
                key={producto.id}
              >
                <span>{producto.nombre}</span>
                <span>{formatearPrecio(producto.precio)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
