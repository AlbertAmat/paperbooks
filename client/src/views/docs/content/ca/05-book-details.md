# Detalls del llibre i estoc

Cada llibre té la seva pròpia pàgina amb dues parts: la **informació** del llibre i la llista dels seus **exemplars** físics (anomenats "estoc").

## Informació del llibre

A la part superior de la pàgina pots editar tot allò relatiu al títol en si:

- **Nom** i **ISBN**
- **Categoria** i **Idioma** (tria'ls de les llistes que gestiones a [Categories](#categories-and-authors))
- **Format** (per exemple, tapa tova o tapa dura) i **nombre de pàgines**
- **Autors** — comença a escriure un nom per cercar autors existents, o afegeix-ne un de nou sobre la marxa
- **Editorial** i **data de publicació**
- **Descripció**
- **Imatge de portada**, mostrada a la dreta

Els canvis no es desen fins que fas clic a **Desar**, a la cantonada superior dreta, que només s'activa un cop has fet algun canvi. La **icona de paperera** del costat elimina el llibre completament — se't demanarà confirmació prèviament.

## Entendre l'estoc

Un títol de llibre pot existir al teu catàleg amb **zero, un o diversos exemplars físics**. Cada exemplar és una fila diferent a la taula d'**Estoc**, amb el seu propi:

- **Codi** — l'identificador únic imprès a l'etiqueta de codi de barres d'aquest exemplar.
- **Ubicació** — on es troba aquest exemplar en concret (consulta [Ubicacions](#locations)).
- **Estat**:
  - 🔵 **Reservat** — actualment en préstec a un client.
  - 🟢 **Disponible** — al prestatge, a punt per ser agafat en préstec.
  - ⚪ **No disponible** — temporalment fora de circulació.
  - 🟠 **Malmès** — danyat i no es pot deixar en préstec.
- **Reservat per** — el client que té actualment aquest exemplar, si el seu estat és Reservat.

## Afegir un exemplar

Fes clic a **Afegir**, a sobre de la taula d'Estoc, tria un **estat** i una **ubicació**, i (si el marques com a Reservat) selecciona quin **client** el té. Pots:

- **Afegir** — només crear l'exemplar, o
- **Afegir i imprimir** — crear-lo i posar la seva etiqueta de codi de barres a la cua d'impressió immediatament (consulta [Imprimir etiquetes](#printing-labels)).

## Editar o eliminar un exemplar

Fes servir les accions de fila a la dreta de cada entrada d'estoc:

- 🖨️ Afegeix l'etiqueta d'aquest exemplar a la **cua d'impressió**.
- ✏️ **Edita** el seu estat, ubicació o client assignat.
- 🗑️ **Elimina** l'exemplar (amb confirmació).

> **Consell:** Per deixar un exemplar en préstec a algú, marca'n l'estat com a **Reservat** i tria un client aquí, o bé fes servir el flux de préstec des de la fila d'un client — consulta [Préstecs i devolucions](#lending-and-returns).
