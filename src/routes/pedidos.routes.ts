
import { Router } from "express";
import { PedidoService } from "../services/pedidoService";
import { pedidoSchema } from "../schemas/pedidoSchema";

export const crearPedidosRouter = (pedidoService: PedidoService) => {
  const router = Router();

  // POST /pedidos
  router.post("/", (req, res) => {
    const resultado = pedidoSchema.safeParse(req.body);

    if (!resultado.success) {
      return res.status(400).json({
        error: "Datos del pedido inválidos",
        detalles: resultado.error.issues,
      });
    }

    try {
      const pedido = pedidoService.crearPedido(resultado.data.items);
      return res.status(201).json(pedido);
    } catch (error) {
      return res.status(400).json({
        error: error instanceof Error ? error.message : "Error al crear el pedido",
      });
    }
  });

  // GET /pedidos
  router.get("/", (_req, res) => {
    const pedidos = pedidoService.listarPedidos();
    return res.status(200).json(pedidos);
  });

  // GET /pedidos/:id
  router.get("/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const pedido = pedidoService.obtenerPedidoPorId(id);

    if (!pedido) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    return res.status(200).json(pedido);
  });

  return router;
};
