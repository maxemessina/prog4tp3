import { Router } from "express";
import {
  listarProductos,
  obtenerProductoPorId,
  serializarProducto,
} from "../services/productoService";

const router = Router();

router.get("/", (_req, res) => {
  res.status(200).json(listarProductos().map(serializarProducto));
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "ID de producto inválido" });
  }

  const producto = obtenerProductoPorId(id);

  if (!producto) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  return res.status(200).json(serializarProducto(producto));
});

export default router;
