# TP3 — Cafetería Origen: menú de mesa

Aplicación web para que los clientes de la cafetería Origen consulten el menú
desde el QR de su mesa, armen el pedido en el celular y lo envíen a la API del
grupo. El objetivo principal del TP3 es construir y probar el frontend con
React, TypeScript y TDD; la API del parcial se conserva como backend del
proyecto y se amplía con los cambios que necesita el menú.

## Alcance del TP3

El menú debe permitir:

1. **Identificar mesa o retiro:** leer `?mesa=N` desde la URL y mostrar la
   mesa. Si falta o no es válida, indicar retiro en barra.
2. **Consultar el catálogo real:** cargar `GET /productos`, mostrar un estado
   de carga, y ante un error explicar el problema y permitir reintentar.
3. **Elegir café:** seleccionar expreso o filtrado, tamaño (pocillo, mediano o
   taza grande) y origen (Brasil, Colombia o Etiopía). Mostrar la descripción
   del origen, el precio que devuelve la API y no habilitar “Agregar” hasta
   completar las opciones.
4. **Elegir pastelería:** ofrecer muffin de chocolate y porción de torta selva
   negra con el precio de la API.
5. **Administrar el carrito:** mostrar cantidades y subtotales orientativos,
   sumar, restar y quitar productos, mostrar el subtotal y no confirmar un
   carrito vacío.
6. **Confirmar:** enviar mesa e ítems a `POST /pedidos` y mostrar el ID, estado
   y total que devuelve el servidor.
7. **Seguir el pedido:** consultar `GET /pedidos/:id` desde la confirmación sin
   recargar la página.
8. **Conservar el carrito ante errores:** mostrar el mensaje del backend si se
   rechaza un pedido, sin perder los productos seleccionados.
9. **Adaptarse al celular:** funcionar a 375 px de ancho, sin scroll
   horizontal y con controles accesibles.

La interfaz prioriza que el flujo sea claro y funcione; el foco no es lograr un
diseño visual complejo.

## Tecnologías y criterios técnicos

- Frontend: Vite, React y TypeScript con `strict: true`, sin `any`.
- Bootstrap personalizado con Sass. Los colores de Origen se definen como
  variables antes de importar Bootstrap.
- Zod 4: un esquema por respuesta de API; los tipos TypeScript se infieren de
  esos esquemas. Validar todas las respuestas antes de usarlas.
- Un único módulo cliente para las llamadas HTTP: los componentes no llaman a
  `fetch` directamente.
- Estado del menú como unión discriminada: `cargando`, `error` con mensaje y
  `listo` con productos.
- Carrito en Context, preferentemente con un reducer puro para que su lógica se
  pueda probar de forma aislada.
- Dependencias del frontend fijadas en `frontend/package.json`: Vite 7,
  Vitest 3, MSW 2 y Zod 4.

## Estado de implementación

- **API base:** el contrato usado por el frontend está implementado y cuenta
  con pruebas.
- **Frontend base:** configuración de Vite/React/TypeScript, estilos Bootstrap
  y Sass, esquemas Zod de productos y pedidos, cliente API, lectura de mesa,
  formato de moneda, carga del menú con reintento y pantalla inicial del
  catálogo.
- **Pendiente:** selector de café, pastelería interactiva, carrito, envío y
  seguimiento del pedido, pruebas completas de esas funcionalidades, E2E con
  Playwright y revisión responsive final a 375 px.

## Estructura

```text
backend/
  src/
    models/              # Productos, cafés, pedidos y reglas de dominio
    routes/              # Endpoints HTTP
    schemas/             # Validación de solicitudes
    services/            # Catálogo, pedidos y reportes
  tests/
    unit/
    integration/
  package.json

frontend/
  src/
    api/                 # Cliente HTTP único
    components/          # Componentes de interfaz
    context/             # Context compartido del carrito
    dominio/             # Mesa, precios y funciones puras
    menu/                # Estado y carga del catálogo
    reducers/            # Reducer del carrito
    schemas/             # Contratos Zod y tipos inferidos
    styles/              # Tema Bootstrap/Sass
    tests/
      unit/
      components/
      integration/
  e2e/                   # Recorridos Playwright (pendiente)
  package.json
```

## Backend del parcial: resumen y contrato del menú

El backend es una API REST con Express y TypeScript. Mantiene en memoria un
catálogo de 20 productos, recibe pedidos y ofrece reportes. Los pedidos se
reinician al detener el servidor.

| Método | Ruta | Uso |
|---|---|---|
| `GET` | `/productos` | Catálogo con tipo y precio calculado. |
| `GET` | `/productos/:id` | Un producto del catálogo. |
| `POST` | `/pedidos` | Crear pedido con `items` y `mesaId` opcional. |
| `GET` | `/pedidos` | Listar pedidos. |
| `GET` | `/pedidos/:id` | Consultar pedido, estado, ítems y total. |
| `GET` | `/reportes/facturacion` | Facturación acumulada. |
| `GET` | `/reportes/mas-vendido` | Producto con más unidades vendidas. |

Cada producto incluye su `precio` calculado en el backend y `tipo` explícito:
`expreso`, `filtrado` o `pasteleria`. Los cafés también exponen tamaño,
gramos, variedad y descripción. El frontend muestra esos datos, pero **no
calcula precios ni el total final**; el subtotal del carrito es orientativo.

Ejemplo de un producto:

```json
{
  "id": 5,
  "tipo": "expreso",
  "nombre": "Café expreso Mediano Colombia",
  "tamanio": "Mediano",
  "gramosCafe": 27,
  "variedad": {
    "nombre": "Colombia",
    "descripcion": "Acidez media, cuerpo equilibrado y notas cítricas y florales"
  },
  "precio": 7360
}
```

Ejemplo del cuerpo de creación de un pedido:

```json
{
  "mesaId": 4,
  "items": [
    { "productoId": 5, "cantidad": 2 },
    { "productoId": 19, "cantidad": 1 }
  ]
}
```

La respuesta del pedido incluye `id`, `mesaId` cuando corresponde, `items`,
`estado` y `total`. Si no se envía mesa, es un pedido para retirar en barra.
Los errores usan `{ "error": "mensaje" }`. Con `NODE_ENV=test` se habilitan
`POST /__test__/reset` y `POST /__test__/seed` para preparar datos
deterministas de E2E; no se exponen en otros entornos. El proxy de desarrollo
de Vite reenvía `/productos` y `/pedidos` a `http://localhost:3000`, por lo que
no se necesita configurar CORS para el desarrollo local.

## Instalación, ejecución y comandos

Se requiere Node.js y npm. Instalar y arrancar la API desde la raíz:

```bash
npm --prefix backend ci
npm --prefix backend run dev
```

La API escucha por defecto en `http://localhost:3000`. En otra terminal,
instalar y arrancar el frontend:

```bash
npm --prefix frontend ci
npm --prefix frontend run dev
```

Abrir `http://localhost:5173`. Vite reenvía las rutas de API al backend.

### Backend

| Comando | Descripción |
|---|---|
| `npm --prefix backend run dev` | Servidor de desarrollo. |
| `npm --prefix backend test` | Pruebas unitarias e integración de API. |
| `npm --prefix backend run coverage` | Reporte de cobertura. |
| `npm --prefix backend run typecheck` | Verificación de TypeScript. |
| `npm --prefix backend run build` | Compilar a `backend/dist/`. |
| `npm --prefix backend start` | Ejecutar servidor compilado. |

### Frontend

| Comando | Descripción |
|---|---|
| `npm --prefix frontend run dev` | Servidor Vite. |
| `npm --prefix frontend test` | Unitarias, componentes e integración. |
| `npm --prefix frontend run test:watch` | Vitest interactivo. |
| `npm --prefix frontend run build` | Verificar TypeScript y compilar a `frontend/dist/`. |
| `npm --prefix frontend run test:e2e` | E2E con Playwright (pendiente de configurar). |

## División del trabajo

### Máximo Messina — base e integración

- Mantener el contrato API/frontend y documentar cambios compatibles.
- Preparar y mantener la infraestructura de `backend/` y `frontend/`.
- Implementar los cambios transversales del backend que habilitan el menú:
  contrato de producto, `mesaId`, total consultable, errores y datos de
  prueba deterministas.
- Mantener los esquemas Zod, el cliente HTTP único y las utilidades
  compartidas del frontend.
- Integrar las partes del equipo, resolver conflictos y mantener el flujo
  completo ejecutable.
- Configurar Playwright y el recorrido E2E con la API real; completar la
  documentación y verificar el ancho de 375 px.

### Valentina Guerrieri — catálogo y selección

- Presentar los productos cargados desde la API y distinguir café expreso,
  filtrado y pastelería usando `tipo`.
- Implementar la selección de bebida, tamaño y origen del café.
- Mostrar descripción y precio recibido para cada origen, y habilitar
  “Agregar” únicamente cuando la selección esté completa.
- Implementar las opciones de muffin y torta con sus precios y acciones para
  agregarlos.
- Cubrir la selección y pastelería con pruebas unitarias/de componente y
  pruebas de integración con MSW cuando corresponda.

### Tomás Astudillo — carrito

- Crear el reducer puro del carrito y su Context compartido.
- Implementar agregar productos, acumular cantidades, sumar, restar y quitar.
- Mostrar productos, cantidades, subtotales de línea, subtotal general y
  estado vacío.
- Impedir confirmar un carrito vacío y mantener controles accesibles.
- Probar reducer y componente del carrito: carrito vacío, cambios de cantidad,
  eliminación y subtotales orientativos.

### Priscila Arrimada — confirmación y seguimiento

- Conectar la confirmación al cliente API y enviar `mesaId` cuando exista junto
  con los ítems del carrito.
- Evitar envíos duplicados y mostrar el ID, estado y total respondidos por la
  API.
- Vaciar el carrito solo al confirmar con éxito; ante un rechazo, mostrar el
  mensaje y conservar el carrito.
- Permitir consultar el estado mediante `GET /pedidos/:id` sin recargar la
  página.
- Probar el cuerpo enviado, la confirmación, los errores recuperables y la
  conservación del carrito con MSW.