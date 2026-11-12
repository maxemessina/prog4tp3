import { leerMesaDesdeBusqueda } from "./dominio/mesa";
import { formatearPrecio } from "./dominio/formatearPrecio";
import { useMenu } from "./menu/useMenu";
import { CarritoProvider, useCarrito } from "./context/carritoContext";
import { Carrito } from "./components/carrito";
import type { Producto } from "./schemas/productoSchema";

function BotonAgregar({ producto }: { producto: Producto }) {
  const { agregarProducto } = useCarrito();

  return (
    <button
      className="btn btn-primary btn-sm"
      type="button"
      onClick={() => agregarProducto(producto)}
    >
      Agregar al carrito
    </button>
  );
}

  export default function App() {
  const mesa = leerMesaDesdeBusqueda(window.location.search);
  const { estado, reintentar } = useMenu();

  return (
    <CarritoProvider>
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
              <span
                className="spinner-border spinner-border-sm"
                aria-hidden="true"
              />
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
                  <div>
                    <span>{producto.nombre}</span>
                    <span className="d-block text-muted">
                      {formatearPrecio(producto.precio)}
                    </span>
                  </div>

                  <BotonAgregar producto={producto} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-4">
          <Carrito />
        </section>
      </main>
    </CarritoProvider>
  );
}