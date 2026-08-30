# Detalle del libro y stock

Cada libro tiene su propia página con dos partes: la **información** del libro y la lista de sus **ejemplares** físicos (llamados "stock").

## Información del libro

En la parte superior de la página puedes editar todo lo relacionado con el título en sí:

- **Nombre** e **ISBN**
- **Categoría** e **Idioma** (elige de las listas que gestionas en [Categorías](#categories-and-authors))
- **Formato** (por ejemplo, tapa blanda, tapa dura) y **número de páginas**
- **Autores** — empieza a escribir un nombre para buscar entre los autores existentes, o añade uno nuevo sobre la marcha
- **Editorial** y **fecha de publicación**
- **Descripción**
- **Imagen de portada**, mostrada a la derecha

Los cambios no se guardan hasta que hagas clic en **Guardar**, en la esquina superior derecha, que solo se activa una vez has hecho alguna edición. El **icono de papelera** junto a él elimina el libro por completo — se te pedirá confirmación antes.

## Entendiendo el stock

Un título puede existir en tu catálogo con **cero, uno o varios ejemplares físicos**. Cada ejemplar es una fila independiente en la tabla de **Stock**, con su propio:

- **Código** — el identificador único impreso en la etiqueta de código de barras de ese ejemplar.
- **Ubicación** — dónde se encuentra ese ejemplar en concreto (consulta [Ubicaciones](#locations)).
- **Estado**:
  - 🔵 **Reservado** — actualmente prestado a un cliente.
  - 🟢 **Disponible** — en la estantería, listo para ser prestado.
  - ⚪ **No disponible** — temporalmente fuera de circulación.
  - 🟠 **Dañado** — dañado y no disponible para préstamo.
- **Reservado por** — el cliente que tiene actualmente ese ejemplar, si su estado es Reservado.

## Añadir un ejemplar

Haz clic en **Añadir** encima de la tabla de Stock, elige un **estado** y una **ubicación**, y (si lo marcas como Reservado) selecciona qué **cliente** lo tiene. Puedes elegir entre:

- **Añadir** — simplemente crear el ejemplar, o
- **Añadir e imprimir** — crearlo y poner en cola inmediatamente su etiqueta de código de barras para imprimir (consulta [Impresión de etiquetas](#printing-labels)).

## Editar o eliminar un ejemplar

Usa las acciones de fila a la derecha de cada entrada de stock:

- 🖨️ Añade la etiqueta de este ejemplar a la **cola de impresión**.
- ✏️ **Edita** su estado, ubicación o cliente asignado.
- 🗑️ **Elimina** el ejemplar (con confirmación).

> **Consejo:** Para prestar un ejemplar a alguien, puedes cambiar su estado a **Reservado** y elegir aquí un cliente, o usar el flujo de préstamo grupal desde la fila de un cliente — consulta [Préstamos y devoluciones](#lending-and-returns).

## Copia de seguridad del archivo digital

Junto a la imagen de portada puedes, opcionalmente, guardar una copia de seguridad del **archivo epub o pdf** del libro — útil si lo has descargado y transferido a un lector electrónico, ya que entonces el lector se convierte en el único lugar donde vive esa copia. Haz clic o arrastra y suelta un archivo (máximo 100MB) para subirlo; un libro conserva como máximo un archivo, así que subir uno nuevo sustituye al anterior.

Una vez subido, puedes **descargarlo** de nuevo en cualquier momento (por ejemplo, si pierdes o restableces tu lector electrónico) o **eliminarlo** (con confirmación). Esto está pensado únicamente como copia de seguridad personal de archivos sobre los que ya tienes los derechos — no como un lugar para obtener libros de otras fuentes.
