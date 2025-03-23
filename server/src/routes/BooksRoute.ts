import {Router, Request, Response} from 'express';
import {appService} from "../AppService";
import axios from "axios";
import {v4 as uuidv4} from 'uuid';

const router: Router = Router();

/**
 * Path: /book/search
 */
router.get('/search', async (req: Request, res: Response) => {
    // Params
    const name = req.query.name;
    const isbn = req.query.isbn;
    const author = req.query.author;
    // Array of categories
    const category_id = req.query.category_id;
    const page = Math.max(0, Number(req.query.page)) || 0;

    const pool = appService.getDatabasePool();
    const client = await pool.connect();
    try {
        const MAX_ROWS = 50;
        const skip = MAX_ROWS * page;

        const params = [];
        const conditions: Array<String> = [];

        let query = `
            SELECT books.id,
                   books.name,
                   books.image_url,
                   books.isbn,
                   books.category_id,
                   books.language_code,
                   COALESCE(
                           json_agg(
                                   json_build_object(
                                           'id', authors.id,
                                           'name', authors.name
                                   )
                           ) FILTER(WHERE authors.id IS NOT NULL),
                           '[]'
                   ) AS authors
            FROM books
                     LEFT JOIN book_authors ON books.id = book_authors.book_id
                     LEFT JOIN authors ON book_authors.author_id = authors.id
        `;

        if (name) {
            conditions.push(`name ILIKE $${conditions.length + 1}`);
            params.push(`%${name}%`);
        }

        if (isbn) {
            conditions.push(`isbn ILIKE $${conditions.length + 1}`);
            params.push(`%${isbn}%`); // Use ILIKE for case-insensitive search with partial match
        }

        if (author) {
            conditions.push(`author ILIKE $${conditions.length + 1}`);
            params.push(`%${author}%`); // Use ILIKE for case-insensitive search with partial match
        }

        if (category_id) {
            conditions.push(`category_id IN $${conditions.length + 1}`);
            params.push(`[${category_id}]`); // Use ILIKE for case-insensitive search with partial match
        }

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        /**
         * Total results
         */
        let totalQuery = "SELECT COUNT(*) FROM books";
        if (conditions.length > 0) {
            totalQuery += ` WHERE ${conditions.join(' AND ')}`;
        }
        const totalResults = await client.query(totalQuery, params);

        /**
         * Results
         */
        query += `
            GROUP BY 
                books.id,
                books.name,
                books.image_url,
                books.isbn,
                books.category_id,
                books.language_code
            ORDER BY books.name
            LIMIT ${MAX_ROWS} OFFSET ${skip};
        `;

        // Use a prepared statement to fetch items by name
        console.log("executing query: ", query);
        const result = await client.query(query, params);

        // Return the result (found rows)
        res.status(200).json({
            total: totalResults.rows[0] ? Number(totalResults.rows[0].count) : -1,
            limit: MAX_ROWS,
            books: result.rows
        });
    } catch (err: any) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Internal Server Error');
    } finally {
        client.release();
    }
});

/**
 * Path: /book/{id}
 */
router.get('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    console.log("Get book, id:", id)
    const pool = appService.getDatabasePool();
    const client = await pool.connect();
    try {
        const result = await client.query(`
            SELECT books.id,
                   books.name,
                   books.description,
                   books.image_url,
                   books.isbn,
                   books.category_id,
                   books.language_code,
                   books.publisher,
                   books.published_date,
                   books.date_created,
                   books.date_updated,
                   books.pages,
                   books.format_id,
                   COALESCE(
                           json_agg(
                               DISTINCT jsonb_build_object(
                   'id', book_stocks.id,
                   'code', book_stocks.code,
                   'status', book_stocks.status,
                   'location_id', locations.id,  -- Using correct column from locations table
                   'location_name', locations.name
               )
           ) FILTER(WHERE book_stocks.id IS NOT NULL), '[]'
                   )                                                                    AS stocks,
                   COALESCE(
                           json_agg(
                               DISTINCT jsonb_build_object(
                   'id', authors.id,
                   'name', authors.name
               )
           ) FILTER(WHERE authors.id IS NOT NULL), '[]') AS authors
            FROM books
                     LEFT JOIN book_stocks ON books.id = book_stocks.book_id
                     LEFT JOIN locations ON book_stocks.location_id = locations.id -- Ensure correct join condition
                     LEFT JOIN book_authors ON books.id = book_authors.book_id
                     LEFT JOIN authors ON book_authors.author_id = authors.id
            WHERE books.id = $1
            GROUP BY books.id,
                     books.name,
                     books.description,
                     books.image_url,
                     books.isbn,
                     books.category_id,
                     books.language_code,
                     books.publisher,
                     books.published_date,
                     books.date_created,
                     books.date_updated,
                     books.pages,
                     books.format_id;
        `, [id]);

        if (result.rows.length !== 1) {
            res.status(404).send("Book not found");
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (err: any) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Internal Server Error');
    } finally {
        client.release();
    }
});

/**
 * Path: /book/{id}
 */
//@ts-ignore
router.put('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    console.log("Update book, id:", id);

    // Body params
    const {
        name,
        image_url,
        isbn,
        category_id,
        language_code,
        authors,
        description,
        publisher,
        published_date,
        pages,
        format_id
    } = req.body;

    // Database connection
    const pool = appService.getDatabasePool();
    const client = await pool.connect();

    try {
        // Validate the existence of the book
        const bookCheck = await client.query('SELECT id FROM books WHERE id = $1', [id]);
        if (bookCheck.rowCount === 0) {
            return res.status(404).send({error: "Book not found"});
        }

        // Start transaction
        await client.query('BEGIN');

        // Update the books table
        const updateQuery = `
            UPDATE books
            SET name           = $1,
                description    = $2,
                image_url      = $3,
                isbn           = $4,
                category_id    = $5,
                format_id      = $6,
                publisher      = $7,
                published_date = $8,
                language_code  = $9,
                pages          = $10,
                date_updated   = CURRENT_TIMESTAMP
            WHERE id = $11
        `;
        const updateValues = [
            name,
            description,
            image_url,
            isbn,
            category_id,
            format_id,
            publisher,
            published_date,
            language_code,
            pages,
            id
        ];
        console.log("published_date", published_date)
        await client.query(updateQuery, updateValues);

        // Handle authors relationship in the book_authors table
        if (authors && Array.isArray(authors)) {
            // Fetch existing authors associated with the book
            const existingAuthorsResult = await client.query(
                'SELECT author_id FROM book_authors WHERE book_id = $1',
                [id]
            );
            const existingAuthors = existingAuthorsResult.rows.map(row => row.author_id);

            // Determine authors to remove (present in the database but not in the new list)
            const authorsToRemove = existingAuthors.filter(authorId => !authors.includes(authorId));

            // Determine authors to add (present in the new list but not in the database)
            const authorsToAdd = authors.filter(authorId => !existingAuthors.includes(authorId));

            // Remove authors no longer associated with the book
            for (const authorId of authorsToRemove) {
                await client.query(
                    'DELETE FROM book_authors WHERE book_id = $1 AND author_id = $2',
                    [id, authorId]
                );
            }

            // Add new authors to the book
            for (const authorId of authorsToAdd) {
                // Ensure the author exists in the authors table
                const authorCheck = await client.query('SELECT id FROM authors WHERE id = $1', [authorId]);
                if (authorCheck.rowCount !== 0) {
                    // Associate the author with the book
                    await client.query(
                        'INSERT INTO book_authors (book_id, author_id) VALUES ($1, $2)',
                        [id, authorId]
                    );
                } else {
                    console.warn(`Author with ID ${authorId} not found, skipping association.`);
                }
            }
        }

        // Commit transaction
        await client.query('COMMIT');
        res.send({message: "Book updated successfully"});
    } catch (e) {
        // Rollback transaction in case of error
        await client.query('ROLLBACK');
        console.error("Error while updating book", e);
        res.status(500).send('Internal Server Error');
    } finally {
        client.release();
    }
});

/**
 *
 */
//@ts-ignore
router.post('/isbn/:isbn', async (req: Request, res: Response) => {
    const isbnCode = req.params.isbn;
    if (!isbnCode) {
        return res.status(400).send('No ISBN code provided');
    }

    try {
        // Fetch book details from Google Books API
        const {data} = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbnCode}`);
        if (!data.items || data.items.length === 0) {
            return res.status(404).send('Book not found');
        }

        const bookData = data.items[0].volumeInfo;
        const {
            title: name,
            authors,
            description,
            categories,
            publisher,
            publishedDate,
            pageCount: pages,
            language,
            imageLinks,
        } = bookData;

        // Format the publishedDate
        const formattedPublishedDate = formatPublishedDate(publishedDate);

        /**
         * Book image
         */
        let imageUrl: null | string = null;
        if (imageLinks && imageLinks.thumbnail) {
            imageUrl = imageLinks.thumbnail as string | null;
        } else {
            // Step 1: Try Open Library Covers API
            const openLibraryCoverUrl = `https://covers.openlibrary.org/b/isbn/${isbnCode}-M.jpg`;
            const openLibraryResponse = await axios.get(
                openLibraryCoverUrl,
                {responseType: 'arraybuffer'}
            );

            // Check if the response is an image
            const contentType = openLibraryResponse.headers['content-type'];
            const isImage = contentType && contentType.startsWith('image/');

            // Check if Open Library returned an image
            if (openLibraryResponse.status === 200 && isImage) {
                imageUrl = openLibraryCoverUrl;
            }
        }

        const categoryName = categories ? categories[0] : null;
        const languageCode = language;

        // Begin a transaction
        const pool = appService.getDatabasePool();
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Check and insert language if not exists
            let languageResult = await client.query(
                "SELECT code FROM languages WHERE code = $1",
                [languageCode]
            );
            if (languageResult.rowCount === 0) {
                await client.query(
                    "INSERT INTO languages (code, name) VALUES ($1, $2)",
                    [languageCode, languageCode] // Replace with proper language name if available
                );
            }

            // Check and insert category if not exists
            let categoryId: number | null = null;
            if (categoryName) {
                let categoryResult = await client.query(
                    "SELECT id FROM categories WHERE name = $1",
                    [categoryName]
                );
                if (categoryResult.rowCount === 0) {
                    const insertCategoryResult = await client.query(
                        "INSERT INTO categories (name) VALUES ($1) RETURNING id",
                        [categoryName]
                    );
                    categoryId = insertCategoryResult.rows[0].id;
                } else {
                    categoryId = categoryResult.rows[0].id;
                }
            }

            // Check if the book already exists
            let bookId: number | null = null;
            let bookResult = await client.query(
                "SELECT id FROM books WHERE isbn = $1",
                [isbnCode]
            );
            if (bookResult.rowCount === 0) {
                // Insert the book into the books table
                const insertBookResult = await client.query(
                    `INSERT INTO books (name, description, image_url, isbn, category_id,
                                        publisher, published_date, language_code, pages)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
                    [
                        name, description, imageUrl, isbnCode, categoryId,
                        publisher, formattedPublishedDate, languageCode, pages
                    ]
                );
                bookId = insertBookResult.rows[0].id;
            } else {
                bookId = bookResult.rows[0].id;
            }

            // Insert authors into the authors and book_authors tables
            if (authors && bookId) {
                for (const author of authors) {
                    // Check if the author exists
                    let authorResult = await client.query(
                        "SELECT id FROM authors WHERE name = $1",
                        [author]
                    );
                    let authorId: number | null = null;
                    if (authorResult.rowCount === 0) {
                        const insertAuthorResult = await client.query(
                            "INSERT INTO authors (name) VALUES ($1) RETURNING id",
                            [author]
                        );
                        authorId = insertAuthorResult.rows[0].id;
                    } else {
                        authorId = authorResult.rows[0].id;
                    }

                    // Insert into book_authors
                    await client.query(
                        "INSERT INTO book_authors (book_id, author_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
                        [bookId, authorId]
                    );
                }
            }

            // Commit transaction
            await client.query("COMMIT");
            res.status(200).json(bookId);
        } catch (error) {
            // Rollback on error
            await client.query("ROLLBACK");
            console.error("Transaction error:", error);
            res.status(500).send("Error processing the book");
        } finally {
            client.release();
        }
    } catch (error) {
        console.error("Error fetching book details:", error);
        res.status(500).send("Error fetching book details");
    }
});

/**
 *
 */
//@ts-ignore
router.post('/:id/stock', async (req: Request, res: Response) => {
    const bookId = req.params.id;
    const status = req.body.status;
    const locationId = req.body.location_id;
    if (!bookId) {
        return res.status(400).send('No book ID provided');
    }

    const pool = appService.getDatabasePool();
    const client = await pool.connect();

    try {
        console.log(`Adding book stock with status ${status} in book id: ${bookId}`);
        await client.query("BEGIN");

        const code = await generateBookStockCode();

        console.log("Stock code: " + code)

        const insertStock = await client.query(
            "INSERT INTO book_stocks (book_id, code, status, location_id) VALUES ($1, $2, $3, $4) RETURNING id",
            [bookId, code, status, locationId]
        );

        await client.query("COMMIT");

        // fetch new data
        const result = await pool.query(`
            SELECT book_stocks.id,
                   book_stocks.code,
                   book_stocks.status,
                   book_stocks.location_id,
                   locations.name as location_name
            FROM book_stocks
            LEFT JOIN locations ON book_stocks.location_id = locations.id
            WHERE book_stocks.id = ${insertStock.rows[0].id}
        `)

        res.status(200).json(result.rows[0]);
    } catch (error) {
        // Rollback on error
        await client.query("ROLLBACK");
        console.error("Transaction error:", error);
        res.status(500).send("Error adding the book stock");
    } finally {
        client.release();
    }
});


/**
 *
 */
//@ts-ignore
router.delete('/:id/stock/:stock_id', async (req: Request, res: Response) => {
    const bookId = req.params.id;
    const stockId = req.params.stock_id;
    if (!bookId || !stockId) {
        return res.status(400).send('No book ID or stock ID provided');
    }

    const pool = appService.getDatabasePool();

    try {
        console.log(`Removing book stock with status ${stockId} and book id: ${bookId}`);

        const deleteQueryResult = await pool.query(
            'DELETE FROM book_stocks WHERE book_id = $1 AND id = $2',
            [bookId, stockId]
        );

        res.status(200).json(deleteQueryResult.rowCount === 1);
    } catch (error) {
        // Rollback on error
        console.error("Transaction error:", error);
        res.status(500).send("Error deleting the book stock");
    }
});

// Helper function to format date to YYYY-MM-DD
function formatPublishedDate(date: string | undefined): string | null {
    if (!date) return null;

    // Attempt to parse the date and format it to YYYY-MM-DD
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
        return null; // Return null if the date is invalid
    }

    // Return the date in the format YYYY-MM-DD
    return parsedDate.toISOString().split('T')[0];
}

/**
 *
 */
async function generateBookStockCode(): Promise<string> {
    let code: string = "";
    let isUnique = false;

    const pool = appService.getDatabasePool();


    while (!isUnique) {
        // Generate a random 10-character code
        code = uuidv4().replace(/-/g, '').substring(0, 10);

        // Check if the code already exists
        const {rowCount} = await pool.query(
            "SELECT 1 FROM book_stocks WHERE code = $1",
            [code]
        );

        if (rowCount === 0) {
            isUnique = true;
        }
    }

    return code;
}
export default router;