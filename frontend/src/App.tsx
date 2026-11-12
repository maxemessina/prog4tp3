
import { leerMesaDesdeBusqueda } from "./dominio/mesa";
import { useMenu } from "./menu/useMenu";
import SelectorCafe from "./components/SelectorCafe";
import TarjetaPasteleria from "./components/TarjetaPasteleria";
import { CarritoProvider, useCarrito } from "./context/carritoContext";
import { Carrito } from "./components/carrito";
import { ConfirmacionPedido } from "./components/ConfirmacionPedido";
import { crearPedido, obtenerPedido } from "./api/api";
import type { Cafe, Pasteleria } from "./schemas/productoSchema";
import type { PedidoItem } from "./schemas/pedidoSchema";

export default function App() {
  return (
    <CarritoProvider>
      <MenuConCarrito />
    </CarritoProvider>
  );
}

function MenuConCarrito() {
  const mesa = leerMesaDesdeBusqueda(window.location.search);
  const { estado, reintentar } = useMenu();

  const {
    carrito,
    agregarProducto,
    vaciarCarrito,
  } = useCarrito();

  const items: PedidoItem[] = carrito.map((item) => ({
    productoId: item.producto.id,
    cantidad: item.cantidad,
  }));

  const cafes =
    estado.estado === "listo"
      ? estado.productos.filter(
          (producto): producto is Cafe =>
            producto.tipo === "expreso" ||
            producto.tipo === "filtrado",
        )
      : [];

  const pasteleria =
    estado.estado === "listo"
      ? estado.productos.filter(
          (producto): producto is Pasteleria =>
            producto.tipo === "pasteleria",
        )
      : [];

  return (
    <main className="container py-4">
      <header className="mb-4">
        <h1>Cafetería Origen</h1>
        <h2>{mesa ? `Mesa ${mesa}` : "Retiro en barra"}</h2>
      </header>

      {estado.estado === "cargando" && (
        <p role="status">Cargando menú...</p>
      )}

      {estado.estado === "error" && (
        <div role="alert">
          <p>{estado.mensaje}</p>
          <button type="button" onClick={reintentar}>
            Reintentar
          </button>
        </div>
      )}

      {estado.estado === "listo" && (
        <>
          {cafes.length > 0 && (
            <SelectorCafe
              cafes={cafes}
              onAgregar={agregarProducto}
            />
          )}

          {pasteleria.length > 0 && (
            <section className="mt-4">
              <h3>Pastelería</h3>

              <div className="row g-3">
                {pasteleria.map((producto) => (
                  <div
                    className="col-12 col-sm-6 col-lg-4"
                    key={producto.id}
                  >
                    <TarjetaPasteleria
                      producto={producto}
                      onAgregar={agregarProducto}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <section className="mt-4">
        <Carrito />

        <ConfirmacionPedido
          mesaId={mesa}
          items={items}
          crearPedido={crearPedido}
          obtenerPedido={obtenerPedido}
          vaciarCarrito={vaciarCarrito}
        />
      </section>
    </main>
  );
}
