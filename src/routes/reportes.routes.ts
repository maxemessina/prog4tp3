
import { Router } from "express";
import { PedidoService } from "../services/pedidoService";

export function TomaReportesRouter(
  pedidoService: PedidoService
) {
  const router = Router();

  router.get("/facturacion", (_req, res) => {
    const facturacionTotal =
      pedidoService.calcularFacturacionTotal();

    res.status(200).json({ facturacionTotal });
  });

  router.get("/mas-vendido", (_req, res) => {
    const masVendido = pedidoService.obtenerProductoMasVendido();

    if (!masVendido) {
      return res.status(404).json({
        error: "No hay ventas registradas",
      });
    }

    return res.status(200).json(masVendido);
  });

  return router;
}
