import express, {
  type ErrorRequestHandler,
  type Router,
} from "express";
import { crearPedidosRouter } from "./routes/pedidos.routes";
import { TomaReportesRouter } from "./routes/reportes.routes";
import productosRouter from "./routes/productos.routes";
import { PedidoService } from "./services/pedidoService";
import { obtenerProductoPorId } from "./services/productoService";

export interface AppRouters {
  productos: Router;
  pedidos: Router;
  reportes: Router;
  test?: Router;
}

function crearRouterDePruebas(pedidoService: PedidoService): Router {
  const router = express.Router();

  router.post("/reset", (_request, response) => {
    pedidoService.resetear();
    return response.status(204).end();
  });

  router.post("/seed", (_request, response) => {
    pedidoService.cargarDatosDePrueba();
    return response.status(204).end();
  });

  return router;
}

export function createApp({ productos, pedidos, reportes, test }: AppRouters) {
  const app = express();

  app.use(express.json());
  app.use("/productos", productos);
  app.use("/pedidos", pedidos);
  app.use("/reportes", reportes);
  if (process.env.NODE_ENV === "test" && test) {
    app.use("/__test__", test);
  }
  app.use((_request, response) => {
    response.status(404).json({ error: "Ruta no encontrada" });
  });
  const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
    const status =
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      typeof error.status === "number" &&
      error.status >= 400 &&
      error.status < 500
        ? error.status
        : 500;

    const message =
      status === 400
        ? "JSON inválido"
        : status === 413
          ? "Cuerpo de solicitud demasiado grande"
          : status < 500
            ? "Solicitud inválida"
            : "Error interno del servidor";

    return response.status(status).json({ error: message });
  };
  app.use(errorHandler);

  return app;
}

export function createConfiguredApp() {
  const productoLookup = { obtenerProductoPorId };
  const pedidoService = new PedidoService(productoLookup);

  return createApp({
    productos: productosRouter,
    pedidos: crearPedidosRouter(pedidoService),
    reportes: TomaReportesRouter(pedidoService),
    ...(process.env.NODE_ENV === "test"
      ? { test: crearRouterDePruebas(pedidoService) }
      : {}),
  });
}