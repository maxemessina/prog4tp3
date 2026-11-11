const formatoMoneda = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function formatearPrecio(precio: number): string {
  if (!Number.isFinite(precio)) {
    throw new RangeError("El precio debe ser un número finito.");
  }

  return formatoMoneda.format(precio);
}
