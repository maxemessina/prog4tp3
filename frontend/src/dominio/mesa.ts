export function leerMesaDesdeBusqueda(busqueda: string): number | undefined {
  const parametros = new URLSearchParams(busqueda);
  const mesas = parametros.getAll("mesa");

  if (mesas.length !== 1 || !/^[1-9]\d*$/.test(mesas[0])) {
    return undefined;
  }

  const mesa = Number(mesas[0]);

  return Number.isSafeInteger(mesa) ? mesa : undefined;
}
