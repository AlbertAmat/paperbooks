# Préstamos y devoluciones

Paper Book registra los préstamos a nivel de **ejemplar** físico individual, no del título del libro — así siempre sabes exactamente qué ejemplar tiene cada cliente.

## Prestar un ejemplar

Un ejemplar se considera prestado cuando su estado es **Reservado** y tiene un cliente asignado. Puedes configurarlo de dos formas:

- Desde la [tabla de Stock](#book-details) del libro, añade un ejemplar nuevo (o edita uno existente), pon su estado como **Reservado** y elige el cliente.
- Desde la página de [Clientes](#customers-and-groups), usa la lista de libros propia de un cliente para añadirle un ejemplar directamente.

Mientras un ejemplar está Reservado, aparece:

- En la propia página del libro, en la columna **Reservado por**.
- En la fila expandida del cliente, en su lista de libros prestados.
- En el total de **Libros reservados** del [Panel de control](#dashboard).

## Devolver libros

Cuando un ejemplar vuelve, usa el botón **Devolver libros** — disponible tanto en el [Panel de control](#dashboard) como en la página de [Clientes](#customers-and-groups).

1. Haz clic en **Devolver libros** para abrir el diálogo.
2. Para cada ejemplar que se devuelve, **escanea su etiqueta de código de barras** con la cámara o **escribe su código de stock**.
3. A medida que se reconoce cada código, su portada y título aparecen en la lista para que puedas confirmar que estás devolviendo el ejemplar correcto.
4. Puedes poner en cola **varios ejemplares** antes de enviar — útil cuando vuelven varios libros a la vez.
5. Haz clic en **Devolver** para marcarlos todos como disponibles de nuevo.

Una vez devuelto, el estado de un ejemplar vuelve a **Disponible** y queda libre para volver a prestarse.

## La vista de Préstamos

La página de **Préstamos** te ofrece una única lista de todos los ejemplares actualmente prestados — su libro, quién lo tiene, su grupo y la fecha en que se prestó.

- Filtra por **Grupo** para ver solo lo que tiene una clase/departamento, o por un rango de fechas **Desde**/**Hasta** para ver los préstamos de un periodo concreto.
- Haz clic en **Devolver** en cualquier fila para devolver ese ejemplar en concreto — sin necesidad de saber su código de stock.

Es la forma más rápida de saber "qué hay fuera ahora mismo, y con quién" sin tener que repasar cliente por cliente.

## Exportar un informe de préstamos

Haz clic en **Generar informe**, en la esquina superior derecha de la página de Préstamos, para exportar un archivo Excel (.xlsx) con el historial de préstamos — incluidos los ejemplares ya devueltos, no solo los que están prestados ahora.

1. Elige una fecha **Desde** y **Hasta** — obligatorias, ya que el informe siempre cubre un rango de fechas.
2. Opcionalmente, restríngelo a un **Grupo** o **Cliente** concreto.
3. Haz clic en **Generar informe** para descargar el archivo.

Cada fila muestra el libro, el código de stock, el cliente, el grupo, la fecha en que se prestó y su fecha de devolución, o bien **Aún en préstamo**.
