# Book details & stock

Every book has its own page with two parts: the book's **information** and the list of its physical **copies** (called "stock").

## Book information

At the top of the page you can edit everything about the title itself:

- **Name** and **ISBN**
- **Category** and **Language** (pick from the lists you manage under [Categories](#categories-and-authors))
- **Format** (e.g. paperback, hardcover) and **number of pages**
- **Authors** — start typing a name to search existing authors, or add a new one on the fly
- **Publisher** and **published date**
- **Description**
- **Cover image**, shown on the right

Changes aren't saved until you click **Save** in the top-right corner, which only becomes active once you've made an edit. The **trash icon** next to it deletes the book entirely — you'll be asked to confirm first.

## Understanding stock

A book title can exist in your catalog with **zero, one, or many physical copies**. Each copy is a separate row in the **Stocks** table, with its own:

- **Code** — the unique identifier printed on that copy's barcode label.
- **Location** — where that specific copy lives (see [Locations](#locations)).
- **Status**:
  - 🔵 **Booked** — currently lent out to a customer.
  - 🟢 **Available** — on the shelf, ready to be borrowed.
  - ⚪ **Not available** — temporarily out of circulation.
  - 🟠 **Damage** — damaged and not lendable.
- **Booked by** — the customer currently holding that copy, if its status is Booked.

## Adding a copy

Click **Add** above the Stocks table, choose a **status** and a **location**, and (if marking it as Booked) select which **customer** has it. You can either:

- **Add** — just create the copy, or
- **Add and print** — create it and immediately queue its barcode label for printing (see [Printing labels](#printing-labels)).

## Editing or removing a copy

Use the row actions on the right of each stock entry:

- 🖨️ Add this copy's label to the **print queue**.
- ✏️ **Edit** its status, location, or assigned customer.
- 🗑️ **Delete** the copy (with confirmation).

> **Tip:** To lend a copy to someone, either set its status to **Booked** and pick a customer here, or use the group borrowing flow from a customer's row — see [Lending & returns](#lending-and-returns).

## Ebook file backup

Next to the cover image you can optionally back up the actual **epub or pdf file** for the book — useful if you've downloaded it and transferred it to an e-reader, since the reader then becomes the only place that copy lives. Click or drag-and-drop a file (max 100MB) to upload it; a book keeps at most one file, so uploading a new one replaces the previous one.

Once uploaded, you can **download** it again at any time (e.g. after losing or resetting your e-reader) or **delete** it (with confirmation). This is meant purely as a personal backup of files you already have the rights to — not a place to source books from elsewhere.
