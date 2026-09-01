# Lending & returns

Vaultisse tracks lending at the level of a single physical **copy**, not the book title — so you always know exactly which copy a customer has.

## Lending a copy

A copy is considered lent out when its status is **Booked** and it has a customer assigned. You can set this up in two ways:

- From the book's [Stocks table](#book-details), add a new copy (or edit an existing one), set its status to **Booked**, and choose the customer.
- From the [Customers](#customers-and-groups) page, use a customer's own book list to add a copy directly to them.

While a copy is Booked, it shows up:

- On the book's own page, in the **Booked by** column.
- On the customer's expanded row, in their list of borrowed books.
- In the **Booked books** total on the [Dashboard](#dashboard).

## Returning books

When a copy comes back, use the **Return books** button — available on both the [Dashboard](#dashboard) and the [Customers](#customers-and-groups) page.

1. Click **Return books** to open the dialog.
2. For each returning copy, **scan its barcode label** with your camera or **type its stock code**.
3. As each code is recognized, its book cover and title appear in the list so you can confirm you're returning the right copy.
4. You can queue up **multiple copies** before submitting — handy when several books come back at once.
5. Click **Return** to mark them all as available again.

Once returned, a copy's status changes back to **Available** and it's freed up to be lent out again.

## The Loans view

The **Loans** page gives you a single list of every copy currently on loan — its book, who has it, their group, and the date it was loaned out.

- Filter by **Group** to see only what one class/department has out, or by a **From**/**To** date range to see loans from a particular period.
- Click **Return** on any row to bring that single copy back — no need to know its stock code.

It's the fastest way to answer "what's out right now, and to whom" without going through each customer individually.

## Exporting a loan report

Click **Generate report** in the top-right corner of the Loans page to export an Excel (.xlsx) file of loan history — including copies that have already been returned, not just what's currently out.

1. Pick a **From** and **To** date — required, since the report always covers a date range.
2. Optionally narrow it down to one **Group** or **Customer**.
3. Click **Generate report** to download the file.

Each row lists the book, stock code, customer, group, the date it was loaned, and either its return date or **Still on loan**.
