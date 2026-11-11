import express, { type Router } from "express";
import { crearPedidosRouter } from "./routes/pedidos.routes";
import { TomaReportesRouter } from "./routes/reportes.routes";
import productosRouter from "./routes/productos.routes";
import { PedidoService } from "./services/pedidoService";
import { obtenerProductoPorId } from "./services/productoService";

export interface AppRouters {
  productos: Router;
  pedidos: Router;
  reportes: Router;
}

export function createApp({ productos, pedidos, reportes }: AppRouters) {
  const app = express();

  app.use(express.json());
  app.use("/productos", productos);
  app.use("/pedidos", pedidos);
  app.use("/reportes", reportes);
  app.use((_request, response) => {
    response.status(404).json({ error: "Ruta no encontrada" });
  });

  return app;
}

export function createConfiguredApp() {
  const productoLookup = { obtenerProductoPorId };
  const pedidoService = new PedidoService(productoLookup);

  return createApp({
    productos: productosRouter,
    pedidos: crearPedidosRouter(pedidoService),
    reportes: TomaReportesRouter(pedidoService),
  });
}