# TP3

API REST desarrollada con TypeScript, Express y Zod para consultar el catálogo
de productos de la cafetería Origen, registrar pedidos y consultar reportes de
ventas. La solución aplica programación orientada a objetos, separación por
capas y pruebas unitarias y de integración.

## Funcionalidad

- Catálogo en memoria de 20 productos:
  - 9 cafés expresos (3 tamaños × 3 variedades).
  - 9 cafés filtrados (3 tamaños × 3 variedades).
  - Muffin de chocolate y porción de torta selva negra.
- Precios calculados según las cantidades y valores indicados en la
  [consigna](./consigna.md).
- Creación de pedidos con items, estado e importe total.
- Consulta de pedidos y reportes de facturación y unidades vendidas.
- Datos almacenados en memoria: los pedidos se reinician al detener el
  servidor.

## API

| Método | Ruta | Respuesta |
|---|---|---|
| `GET` | `/productos` | Catálogo completo. |
| `GET` | `/productos/:id` | Producto solicitado. |
| `POST` | `/pedidos` | Crea un pedido y devuelve su total. |
| `GET` | `/pedidos` | Lista de pedidos registrados. |
| `GET` | `/pedidos/:id` | Pedido solicitado. |
| `GET` | `/reportes/facturacion` | Importe total facturado. |
| `GET` | `/reportes/mas-vendido` | Producto con más unidades vendidas. |

### Contrato para el menú web

`GET /productos` y `GET /productos/:id` devuelven el precio calculado por el
dominio y un `tipo` explícito. Los cafés incluyen `tamanio`, `gramosCafe` y
`variedad` con su nombre y descripción; la pastelería usa `tipo: "pasteleria"`.
Por ejemplo:

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

`POST /pedidos` acepta `mesaId` opcional y una lista de ítems. Sin mesa, el
pedido se considera para retirar en barra:

```json
{
  "mesaId": 4,
  "items": [{ "productoId": 5, "cantidad": 2 }]
}
```

La creación y `GET /pedidos/:id` responden con el pedido, su estado y el total
calculado por la API. Los errores HTTP responden JSON con un campo `error`.
Con `NODE_ENV=test` se habilitan `POST /__test__/reset` y
`POST /__test__/seed`: reset limpia pedidos y reinicia sus IDs; seed prepara
un pedido conocido (mesa 4, un muffin, ID 1). Estas rutas no existen en otros
entornos.

Los IDs y el body de creación de pedidos se validan. IDs inválidos y pedidos
con datos incorrectos reciben `400`; los recursos no encontrados reciben
`404`. La facturación sin pedidos es `$0`; si todavía no hay ventas, el
endpoint de más vendido informa que no hay ventas registradas.

### Ejemplo de pedido

```json
{
  "items": [
    { "productoId": 1, "cantidad": 2 }
  ]
}
```

La respuesta `201 Created` incluye el ID, los items, el estado y el total
calculado usando el precio de cada producto.

## Organización del repositorio

```text
backend/
  src/                   # API Express, modelos, rutas y servicios
  tests/
    unit/
    integration/
  package.json
frontend/
  src/                   # Aplicación React y sus pruebas
  e2e/                   # Recorridos con Playwright
```

El backend y el frontend tienen dependencias y comandos independientes. La
carpeta `frontend/` se completa en las siguientes etapas del TP.

`Producto` define el contrato de precio y los productos concretos lo
implementan mediante polimorfismo. Los tamaños y variedades de café se
representan con tipos y tablas de datos. `PedidoService` recibe la búsqueda de
productos que necesita para calcular pedidos y reportes.

`createConfiguredApp()` ensambla el catálogo, los servicios y los routers sin
abrir un puerto. Esto permite probar la API con Supertest. `server.ts` usa esa
misma composición y es el único módulo que llama a `listen`.

## Desarrollo con TDD

El trabajo se organizó en ciclos de **Rojo → Verde → Refactor**:

1. **Rojo:** agregar una prueba para un comportamiento y comprobar que falla.
2. **Verde:** implementar el cambio mínimo que hace pasar la prueba.
3. **Refactor:** mejorar el diseño sin cambiar el comportamiento, manteniendo
   las pruebas verdes.

Las fases se registraron en commits separados. La suite combina pruebas
unitarias de modelos y servicios, pruebas HTTP de las rutas y una prueba de
integración del flujo completo.

## Instalación y ejecución

Se requiere tener Node.js y npm instalados. Para preparar y ejecutar la API:

```bash
npm --prefix backend ci
npm --prefix backend run dev
```

El servidor de desarrollo escucha por defecto en `http://localhost:3000`.
Para usar otro puerto, configurar `PORT` antes de iniciar la aplicación. En
PowerShell:

```powershell
$env:PORT=3001
npm --prefix backend run dev
```

### Verificación del backend

| Comando | Descripción |
|---|---|
| `npm --prefix backend run dev` | Inicia el servidor de desarrollo. |
| `npm --prefix backend test` | Ejecuta las pruebas del backend. |
| `npm --prefix backend run coverage` | Genera el reporte de cobertura. |
| `npm --prefix backend run typecheck` | Comprueba los tipos de TypeScript. |
| `npm --prefix backend run build` | Compila TypeScript en `backend/dist/`. |
| `npm --prefix backend start` | Inicia el servidor compilado. |

## División del trabajo

- **Máximo Messina:** modelos de productos y precios, tipos del pedido,
  lógica de negocio de `PedidoService` y composición final de la aplicación
  para ejecutar el flujo integrado.
- **Valentina Guerrieri:** catálogo en memoria (`ProductoService`), consulta
  de productos y pruebas asociadas.
- **Priscila Arrimada:** endpoints de reportes de facturación y producto más
  vendido, con sus pruebas.
- **Tomás Astudillo:** esquema de validación con Zod, endpoints de pedidos y
  pruebas de integración correspondientes.