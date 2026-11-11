import { createConfiguredApp } from "./app";

const port = Number(process.env.PORT ?? 3000);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(`El puerto configurado no es válido: ${process.env.PORT}`);
}

const app = createConfiguredApp();

app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
