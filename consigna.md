# ☕ ORIGEN - Cafetería de Especialidad

> Cultivado con pasión - Tostado artesanal - Est. 2023

---

## 📖 Contexto del Proyecto

**Valentina** abrió una cafetería de especialidad pequeña. Vende café de distintos orígenes (Colombia, Etiopía, Brasil) preparado de varias formas, y algo de pastelería. Hoy anota los pedidos en un cuaderno y necesita una API para organizarse.

### Productos Disponibles

Los productos con los que cuenta hoy son:
*   Café expreso
*   Café filtrado
*   Pastelería

Tanto el **expreso** como el **filtrado** se pueden preparar con diferentes variedades de café:
*   🇨🇴 **Café Colombia:** Reconocido por su acidez media, su cuerpo equilibrado y sus notas cítricas y florales.
*   🇪🇹 **Café de Etiopía:** Con su acidez muy viva, cuerpo ligero y notas frutales.
*   🇧🇷 **Café Brasil:** Con acidez baja, cuerpo denso y notas de avellana.

La **pastelería** al día de la fecha tiene:
*   Muffins de chocolate
*   Porción de torta selva negra

---

## 💻 Especificaciones Técnicas

### Estructura de Clases / Objetos
Cada producto debe tener:
*   `Id`
*   `nombre`
*   `precioBase`
*   Debe existir un método llamado `calcularPrecio()` que devuelve el precio del producto dependiendo de lo que sea.

### Lógica de Pedidos
**Estructura del Pedido:** `Pedido { id, items: [{ productoId, cantidad }], estado }`

Se deben poder calcular los siguientes requerimientos:
1.  **Total de un pedido:** suma de `calcularPrecio() * cantidad`.
2.  **Facturación total:** suma de los totales de todos los pedidos.
3.  **Cantidad vendida por producto:** Ej: `{ "Espresso": 10, "Filtrado": 4 }`.
4.  **Producto más vendido:** parte del resultado anterior.

### 🌐 Endpoints

La API debe contar con las siguientes rutas:

*   `GET /productos` ➔ Muestra una lista de todos los productos.
*   `GET /productos/:id` ➔ Devuelve el producto pedido según su ID.
*   `POST /pedidos` ➔ Devuelve el pedido con su total calculado.
*   `GET /pedidos` ➔ Lista de pedidos de todas las mesas.
*   `GET /pedidos/:id` ➔ Pedido de una mesa específica.
*   `GET /reportes/facturacion` ➔ Devuelve cuánto se facturó en total.
*   `GET /reportes/mas-vendido` ➔ Devuelve el producto más vendido.

> ⚠️ **Requisito de Evaluación:** Todo debe estar testeado según lo visto en la teoría y realizado en la práctica.

---

## 🎥 Consigna del Video

Cada grupo debe grabar un video de entre **5 y 8 minutos** donde muestren:

1.  Una **recorrida rápida del código** que escribieron, explicando las decisiones de diseño más importantes (no línea por línea, sino lo que consideran relevante).
2.  Una **ejecución en vivo de los tests** (`npm test`) mostrando que pasan en verde.
3.  Una **demo del servidor** corriendo y al menos un request manual (curl o Postman) mostrando que funciona.
4.  **Participación:** Cada integrante debe hablar al menos una vez, explicando una parte del trabajo que haya resuelto personalmente. 

**Formato de Entrega:** Archivo `.MP4` o enlace a YouTube/Google Drive (no listado). Incluir los nombres y legajos de todos los integrantes al inicio del video.

---

## 📊 Tablas de Precios y Costos

### Café (Expreso y Filtrado)

| Máquina (clase) | Tamaño | Café (g) | Variedad | Precio por g ($) | Costo del café ($) | precioBase ($) | Precio final ($) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Expreso | Pocillo | 18 | Brasil | 140 | 2.520 | 2.500 | 5.020 |
| Expreso | Pocillo | 18 | Colombia | 180 | 3.240 | 2.500 | 5.740 |
| Expreso | Pocillo | 18 | Etiopía | 240 | 4.320 | 2.500 | 6.820 |
| Expreso | Mediano | 27 | Brasil | 140 | 3.780 | 2.500 | 6.280 |
| Expreso | Mediano | 27 | Colombia | 180 | 4.860 | 2.500 | 7.360 |
| Expreso | Mediano | 27 | Etiopía | 240 | 6.480 | 2.500 | 8.980 |
| Expreso | Taza grande | 36 | Brasil | 140 | 5.040 | 2.500 | 7.540 |
| Expreso | Taza grande | 36 | Colombia | 180 | 6.480 | 2.500 | 8.980 |
| Expreso | Taza grande | 36 | Etiopía | 240 | 8.640 | 2.500 | 11.140 |
| Filtrado | Pocillo | 6 | Brasil | 140 | 840 | 3.200 | 4.040 |
| Filtrado | Pocillo | 6 | Colombia | 180 | 1.080 | 3.200 | 4.280 |
| Filtrado | Pocillo | 6 | Etiopía | 240 | 1.440 | 3.200 | 4.640 |
| Filtrado | Mediano | 15 | Brasil | 140 | 2.100 | 3.200 | 5.300 |
| Filtrado | Mediano | 15 | Colombia | 180 | 2.700 | 3.200 | 5.900 |
| Filtrado | Mediano | 15 | Etiopía | 240 | 3.600 | 3.200 | 6.800 |
| Filtrado | Taza grande | 25 | Brasil | 140 | 3.500 | 3.200 | 6.700 |
| Filtrado | Taza grande | 25 | Colombia | 180 | 4.500 | 3.200 | 7.700 |
| Filtrado | Taza grande | 25 | Etiopía | 240 | 6.000 | 3.200 | 9.200 |

### Pastelería

| Máquina (clase) | Tamaño | Café (g) | Variedad / Producto | Precio por g ($) | Costo del café ($) | precioBase ($) | Precio final ($) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Pasteleria | - | - | Muffin de chocolate | - | - | 2.500 | 2.500 |
| Pasteleria | - | - | Torta selva negra | - | - | 4.200 | 4.200 |